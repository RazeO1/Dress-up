# Virtual Try-On

## Goal

Let a user see what they look like wearing clothing from their wardrobe, with results stored privately and never shared without explicit action.

The architecture is in MVP. The provider integration is **not** in MVP. When a provider is added, the integration is small and the rest of the system does not change.

## Data Model (already in schema)

- `try_on_profiles` — one or more per user (e.g., "Front", "Side")
- `try_on_profile_images` — the reference photos (front, back, side, full body)
- `try_on_generations` — a record of every attempt: input, output, status, provider, cost

## Privacy Posture

- Try-on reference images are among the most sensitive data in the system
- They are stored in the `wardrobe-try-on-refs` private bucket
- They are NEVER made public
- They are NEVER sent to a third-party AI provider without per-call explicit consent
- A user can delete a profile → all images and past generations are deleted (CASCADE)
- Connections cannot view try-on references or outputs

## Reference Image Capture

The user uploads 1–4 images labeled by pose (front, back, side, full-body). These are the ground-truth representation of the user.

Validation:
- 1–4 images per profile
- Max 10 MB each
- Strip EXIF GPS
- Server stores in `wardrobe-try-on-refs/<user_id>/<profile_id>/<pose>.jpg`
- Encrypted at rest by R2 (SSE-S3 or SSE-KMS — R2 supports both)

User UX:
- Clear "this is private" copy during upload
- A toggle to "show only my eyes/face" mask (not implemented in MVP; the option exists for the future)

## Generation Flow (architectural)

```
User (in app)
  │
  │  1. Open Try-On page
  │  2. Select profile (e.g., "Front")
  │  3. Select garment (or full outfit)
  │  4. Click "Generate"
  │  5. Consent prompt: "This will send your reference photo and the
  │     garment to <provider>. Continue?"
  │
  ↓
POST /api/try-on/generate
  { profileId, clothingItemIds, outfitId? }
  │
  ↓
Server
  1. Verify ownership of profile + clothing/outfit
  2. Mint signed URLs for: reference image + each garment image
  3. Create try_on_generation row (status=pending)
  4. Enqueue background job
  5. Return { generationId }
  │
  ↓
Background job
  1. Call AI provider's try-on endpoint with signed URLs
  2. Poll or await callback
  3. Fetch the result, upload to wardrobe-try-on-outputs/<user_id>/<generation_id>/result.jpg
  4. Update generation row (status=succeeded, output_key=...)
  5. Push a notification (later) or expose via polling endpoint
  │
  ↓
User
  GET /api/try-on/generations/<id>  → { status, outputUrl (signed) }
```

## Polling vs Webhooks

For MVP, the background job runs **in the same Vercel function** (or a Cloudflare Worker) and the client polls `GET /api/try-on/generations/<id>` every 2 seconds until `status` is `succeeded` or `failed`. Typical generation time: 10–30 seconds.

If a provider offers webhooks, we register a `/api/try-on/webhook/<provider>` endpoint that verifies the provider's signature, then looks up the generation by an idempotency key and updates it. Webhooks are not in MVP.

## Cost & Quotas

- Each generation costs the provider money (roughly $0.05–$0.20 per image depending on the model)
- Per-user cap: 50 generations/day, 500/month (configurable)
- All generations are logged with provider cost estimate
- Failures don't count against the quota (after we've actually attempted them)

## Status States

```
pending   → created, job not yet picked up
running   → job in progress
succeeded → output_key set
failed    → error_message set
expired   → output deleted after retention (90 days in MVP)
```

A generation that stays in `pending` for >5 min is marked `failed` with `error_message = "Timeout"`.

## History & Retention

- Users see their last 100 generations by default
- Old generations are kept for 90 days, then the output is deleted; the row remains as "expired"
- Users can manually delete any generation immediately

## Try-On Profile UX (MVP)

Even without a real provider, the MVP includes:

- The data model and migrations
- The `/try-on` page with profile list and create-profile flow
- Reference image upload (via the storage flow)
- A "Generate" button that, when clicked, shows: "Virtual try-on is not yet available. We'll notify you when it launches."
- All routes behind the same auth/ownership checks as everything else

## What the AI Provider Receives

- A signed URL to the user's reference image (short TTL, single-use ideally)
- A signed URL to each garment image
- The garment metadata (category, color)
- The desired output pose (matching the reference pose)
- The user ID (for abuse tracking on the provider side, if supported)

The provider does NOT receive:
- The user's email
- The user's full wardrobe
- Other users' data
- Anything outside the scope of the single request

## Why these choices

| Choice | Why | Alternatives considered |
|---|---|---|
| Same try-on in MVP as architecture | Lets us ship the rest now | Block everything on provider (delays launch) |
| Polling, not WebSockets | Simpler; works in serverless; cheap | WebSockets (real-time but ops overhead) |
| Signed URLs to provider | No proxying of image bytes through us | Stream through our server (slow + costly) |
| 90-day retention | Privacy + cost balance | Forever (storage cost), 7 days (too short) |
| Per-call consent | Aligns with product spec; legally cleaner | Implied consent (faster but risky) |
| Failed generations don't count | Fair to users | Always count (anti-user) |

## Open Questions for Later

- Do we support multi-garment try-on (full outfit) in v1, or single garment only?
- Do we provide pose control (slight turn, smile) or just match the reference pose?
- Do we cache the result and serve it for the same input on retry? (Privacy + cost trade-off.)
- Do we support "what would this look like on me in this setting" with a background image?

These are intentionally deferred; the architecture supports all of them.
