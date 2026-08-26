# API Reference (MVP)

## Conventions

- All routes are versioned implicitly (we're v1; no `/v1/` prefix needed yet)
- All routes return JSON unless noted
- All authenticated routes require a valid session cookie
- Auth is determined server-side from the session; `userId` is **never** accepted from the client
- Errors are returned as `{ error: { code, message, details? } }` with appropriate HTTP status
- All write endpoints require `Content-Type: application/json` (or `multipart/form-data` for uploads)

## Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Validation error (Zod issue) |
| 401 | Not authenticated |
| 403 | Authenticated but forbidden (rarely used; we prefer 404 to prevent enumeration) |
| 404 | Not found OR not yours |
| 409 | Conflict (duplicate username/email) |
| 413 | Payload too large |
| 429 | Rate limited |
| 500 | Server error (no detail leaked) |

## Auth (provided by Auth.js)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/auth/csrf` | CSRF token |
| POST | `/api/auth/callback/credentials` | Login |
| POST | `/api/auth/signout` | Logout |
| GET | `/api/auth/session` | Current session |
| POST | `/api/auth/register` | Register (custom route) |
| POST | `/api/auth/forgot-password` | Request reset (architectural, stubbed email) |
| POST | `/api/auth/reset-password` | Reset with token (architectural, stubbed email) |

## Profile

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/me` | Current user profile |
| PATCH | `/api/me` | Update display name, bio |
| POST | `/api/me/avatar` | Upload avatar (multipart) |
| DELETE | `/api/me/avatar` | Remove avatar |

## Wardrobe (Clothing Items)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/wardrobe/items` | List current user's items (filter, sort, paginate via query) |
| POST | `/api/wardrobe/items` | Create item (JSON; image must be uploaded first) |
| GET | `/api/wardrobe/items/:id` | Get one item |
| PATCH | `/api/wardrobe/items/:id` | Update |
| DELETE | `/api/wardrobe/items/:id` | Delete |
| POST | `/api/wardrobe/items/:id/favorite` | Toggle favorite |
| GET | `/api/wardrobe/items/:id/image` | Returns a signed URL (302 to it) |

### Query Parameters (list)

```
?category=jacket,coat          # comma-separated
?favorite=true
?search=black+denim
?sort=created_desc | created_asc | name_asc | last_worn_desc
?cursor=<itemId>               # keyset pagination
?limit=24
```

## Outfits

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/outfits` | List current user's outfits |
| POST | `/api/outfits` | Create outfit |
| GET | `/api/outfits/:id` | Get outfit with items |
| PATCH | `/api/outfits/:id` | Update (name, notes, tags, favorite) |
| DELETE | `/api/outfits/:id` | Delete |
| PUT | `/api/outfits/:id/items` | Replace all outfit items (body: { items: [{ clothingItemId, slot, sortOrder }] }) |

## Upload (pre-signed)

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/upload/sign` | Get a presigned PUT URL for a new image |
| POST | `/api/upload/finalize` | Confirm the upload and create a `clothing_images` row |

## Try-On (architectural; minimal MVP surface)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/try-on/profiles` | List current user's try-on profiles |
| POST | `/api/try-on/profiles` | Create profile (after images uploaded) |
| GET | `/api/try-on/profiles/:id` | Get profile (with images) |
| DELETE | `/api/try-on/profiles/:id` | Delete profile + images |
| GET | `/api/try-on/generations` | List past generations |
| GET | `/api/try-on/generations/:id` | Get status + output URL (if ready) |
| POST | `/api/try-on/generate` | Request a new generation (returns generationId; works only when a non-stub provider is configured) |

## AI

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/ai/capabilities` | Returns `{ analyzeClothing, suggestOutfits, generateTryOn }` booleans |
| POST | `/api/ai/analyze-clothing` | Analyze an image (returns suggestions); 503 if not configured |

## Connections (placeholder; not in MVP)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/connections` | List connections (accepted) |
| POST | `/api/connections` | Send request |
| PATCH | `/api/connections/:id` | Accept / decline / block |
| DELETE | `/api/connections/:id` | Remove connection |

## Settings

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/settings` | Get user settings |
| PATCH | `/api/settings` | Update settings (theme, notifications opt-in) |
| POST | `/api/settings/change-password` | Change password (requires current) |
| POST | `/api/settings/delete-account` | Soft-delete account (confirmation required) |

## Example: Create Clothing Item

```http
POST /api/wardrobe/items
Cookie: __Host-auth.session=...
Content-Type: application/json

{
  "name": "Black Denim Jacket",
  "category": "jacket",
  "primaryColor": "black",
  "imageIds": ["clothing_img_abc123"]
}

→ 201
{
  "item": {
    "id": "clothing_item_xyz",
    "name": "Black Denim Jacket",
    "category": "jacket",
    "primaryColor": "black",
    "images": [{ "id": "clothing_img_abc123", "url": "https://...?X-Amz-Signature=...", "isPrimary": true }],
    "favorite": false,
    "createdAt": "2026-08-26T12:34:56.000Z"
  }
}
```

## Example: Cross-User Access (must return 404)

```http
GET /api/wardrobe/items/clothing_item_for_user_A
Cookie: __Host-auth.session=<user B's session>

→ 404
{ "error": { "code": "not_found", "message": "Not found" } }
```

## Versioning Strategy

- No `/v1/` prefix in URLs
- Breaking changes go behind a version header (`Accept: application/vnd.wardrobe.v2+json`)
- Non-breaking additions (new optional fields) ship without version bump
- We document any breaking change in `CHANGELOG.md`
