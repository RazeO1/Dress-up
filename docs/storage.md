# Image Storage

## Goals

- Store private user images (clothing, try-on references, try-on outputs) securely
- Serve them only to the authenticated owner (or explicit grantee)
- Optimize for the web (thumbnails, multiple sizes, lazy loading)
- Prevent direct-URL access (no `*.r2.dev/...?image=abc` style leaks)
- Allow graceful future migration to a CDN

## Stack

- **Cloudflare R2** (S3-compatible, no egress fees)
- **AWS SDK v3** (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`) — works with R2 via custom endpoint
- Buckets:
  - `wardrobe-clothing` — clothing item photos
  - `wardrobe-try-on-refs` — user's try-on reference images
  - `wardrobe-try-on-outputs` — generated try-on images
- All buckets are **private**. No public bucket policy.

## Object Key Convention

```
clothing/<user_id>/<clothing_item_id>/<variant>.jpg
try-on-refs/<user_id>/<try_on_profile_id>/<variant>.jpg
try-on-outputs/<user_id>/<try_on_generation_id>/<variant>.jpg
```

- `user_id` is the first path segment after the resource type. This makes per-user R2 IAM policies and lifecycle rules simple, and makes manual inspection (if ever needed) obvious.
- `variant` is one of: `original`, `thumb` (256px), `medium` (1024px). We never serve `original` to browsers.

## Upload Flow

```
Browser
  │
  │  POST /api/upload/sign   { resourceType, contentType, size }
  ├────────────────────────────────────────────────────→│
  │                                                     │ Server validates
  │                                                     │ - resourceType allowed
  │                                                     │ - contentType in allowlist
  │                                                     │ - size ≤ maxBytes (10 MB)
  │                                                     │ - user is authenticated
  │                                                     │
  │  { uploadUrl, fields, objectKey, expiresIn: 600 }   │
  │←────────────────────────────────────────────────────┤
  │
  │  PUT uploadUrl with body (direct to R2)
  ├─────────────────────────────────────────────→ R2
  │←────────────────────────────────────────────┤
  │
  │  POST /api/upload/finalize { objectKey, ... }
  ├────────────────────────────────────────────────────→│
  │                                                     │ Server HEADs the object to confirm
  │                                                     │ it exists and matches expected size
  │                                                     │ Creates DB row (clothing_item, image)
  │                                                     │ Enqueues thumbnail job
  │←────────────────────────────────────────────────────┤
```

Two-step upload (sign → upload → finalize) is required so we can:
- Validate before the file lands in R2
- Avoid the file passing through our server (lower bandwidth, faster)
- Verify the object exists before creating a DB reference

If finalize fails after a successful upload, the object is a soft-orphan and a reaper deletes it after 24h.

## Read Flow

```
Browser
  │
  │  GET /api/wardrobe/items/<id>
  ├────────────────────→│
  │                     │ Server: getItem(userId, itemId) → returns item with imageKey
  │                     │ Server: storage.getSignedViewUrl({ key, userId, ttl: 300 })
  │                     │   - asserts the key's user_id segment matches requester
  │                     │   - returns 5-minute presigned GET URL
  │  { item, imageUrl } │
  │←────────────────────┤
  │
  │  GET imageUrl       │
  ├────────────────→ R2 (with signature in query)
  │←────────────────┤ 200 image/jpeg
```

Critical: the signed URL minting function asserts that the requester is the owner of the object. It does this by parsing the object key and comparing its `user_id` segment to the session's `userId`. There is no way to mint a signed URL for someone else's object.

```ts
function getSignedViewUrl(key: string, userId: string) {
  const keyUserId = key.split('/')[1];
  if (keyUserId !== userId) {
    auditLog.securityEvent('cross_user_storage_access', { userId, key });
    throw new ForbiddenError('Not found');
  }
  return r2.presignedGetObject({ key, expiresIn: 300 });
}
```

## Image Processing

- **Server-side**, in a background job after upload:
  - Generate `thumb` (256px max edge, WebP, quality 80)
  - Generate `medium` (1024px max edge, WebP, quality 85)
  - Extract EXIF, strip GPS data, store width/height
- **Library**: `sharp` (or `@cf-wasmphoton` for edge runtimes)
- **MVP job runner**: simple in-process queue (Postgres-backed). Later: Cloudflare Queues or Inngest.

## Validation Rules

| Rule | Value | Where enforced |
|---|---|---|
| Max file size | 10 MB (original) | `/api/upload/sign` |
| Allowed MIME | `image/jpeg`, `image/png`, `image/webp` | `/api/upload/sign` + magic-byte check on finalize |
| Min dimensions | 200×200 | `sharp` metadata on finalize |
| Max dimensions | 8000×8000 | `sharp` metadata on finalize |
| Strip EXIF GPS | always | `sharp` strip on thumbnail generation |
| Antivirus scan | future | queue hook |

The MIME type is **re-checked on finalize** by reading the first 12 bytes. A file claiming to be `image/jpeg` but starting with `<svg` is rejected.

## Caching

- Signed URLs include `Cache-Control: private, max-age=300` (matches TTL)
- Browser-side: images cache for the session
- No shared cache for private objects

## Cost & Limits (per-user)

- Soft cap: 500 items per user, 5 try-on profiles × 4 images, 100 stored try-on outputs
- Hard cap: 5 GB total per user (checked lazily by a daily job)
- Users over the cap can delete to free space; we don't auto-purge

## Disaster Recovery

- R2 has built-in 11-nines durability
- We **do not** keep a second copy — R2 is the source of truth
- DB rows reference the `objectKey`; if a row's object disappears, the row is shown as "image unavailable"
- We log all storage deletes with a 30-day grace period before hard delete (except user-initiated)

## Why these choices

| Choice | Why | Alternatives considered |
|---|---|---|
| R2 over S3 | No egress fees (huge for image reads) | S3 (mature but pricey), Backblaze B2 (fine) |
| Private bucket + signed URLs | No public surface to misconfigure | Public bucket + obfuscation (insecure) |
| Two-step upload | Server doesn't proxy bytes; faster; pre-validate | One-step through server (simpler but slower) |
| `user_id` in key | IAM and audit-friendly; ownership easy to verify | Random UUID only (more secure but harder to audit) |
| WebP variants | 25-35% smaller than JPEG at same quality | AVIF (better but slower to encode) |
| 5-min signed URL TTL | Short enough to limit replay | 24h (more cacheable but bigger replay window) |

## What we explicitly do NOT do

- No public bucket for any user content
- No client-side direct upload that bypasses our `/sign` endpoint
- No long-lived signed URLs
- No S3 website hosting for user images
- No CDN in front of private images in MVP (signed URLs + R2's edge network is sufficient)
