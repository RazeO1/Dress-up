# Roadmap

## Phase 0 — Architecture (NOW)

You are here.

- [x] Product spec
- [x] Architecture
- [x] Database design
- [x] Authentication
- [x] Authorization
- [x] Storage
- [x] AI system
- [x] Virtual try-on
- [x] UI / UX system
- [x] Security
- [x] API reference
- [x] Testing strategy
- [x] Roadmap (this file)

**STOP. Wait for user approval before writing any application code.**

## Phase 1 — Foundations

Deliverable: a deployable Next.js app where a user can register, log in, and see an empty dashboard. No clothing yet.

1. Initialize Next.js + TypeScript + Tailwind + shadcn/ui
2. Initialize Prisma; first migration (users + Auth.js tables)
3. Wire up Auth.js v5 with Credentials + DB sessions
4. Register / login / logout pages and flows
5. Middleware: auth gate, security headers, request ID
6. Rate limit infrastructure (table + helper)
7. .env.example, .gitignore, ESLint, Prettier, TypeScript strict
8. CI: lint, typecheck, test
9. Deploy to Vercel (preview envs)
10. Documentation: `README.md` with setup steps

Exit criteria: a tester can register, log in, log out, and the security test suite passes.

## Phase 2 — Wardrobe MVP

Deliverable: a user can add, view, edit, delete clothing items with images.

1. Storage: R2 client + signed URL endpoints
2. Image upload flow (sign → upload → finalize)
3. Image processing (thumbnails, EXIF strip)
4. `clothing_items` schema + migration
5. `clothing_images` schema + migration
6. Wardrobe service (`WardrobeService`) with `assertOwner` enforcement
7. API routes (list, create, get, update, delete)
8. UI: `/wardrobe` grid, `/wardrobe/new` add, `/wardrobe/[id]` detail
9. UI: filters, search, sort, pagination
10. Security tests for cross-user access
11. Unit + integration tests
12. E2E: add-clothing flow

Exit criteria: a user can manage a personal wardrobe of 100+ items with images, and no other user can touch them.

## Phase 3 — Outfits

Deliverable: a user can compose clothing items into saved outfits.

1. `outfits` + `outfit_items` schema
2. Outfit service
3. API routes
4. UI: `/outfits` list, `/outfits/new`, `/outfits/[id]`
5. Outfit slot picker (top/bottom/outerwear/footwear/accessory)
6. Security tests

Exit criteria: full outfit CRUD with ownership enforcement.

## Phase 4 — Polish + Profile + Settings

1. Profile page (avatar, display name, bio)
2. Settings page (change password, theme, delete account)
3. Email verification architecture (stubbed send)
4. Password reset architecture (stubbed send)
5. Empty states, error pages, loading states
6. Performance: image optimization, lazy loading, pagination tuning
7. Accessibility audit (axe-core in CI)
8. Lighthouse pass

Exit criteria: the product feels like a finished consumer app for the wardrobe + outfits flow.

## Phase 5 — AI Integration (Light)

1. OpenAI adapter for clothing analysis (category, color, style suggestions)
2. UI: "AI suggestions" chips on the add-clothing form
3. AI capabilities endpoint surfaces the feature
4. Caching and cost controls
5. AI stylist (text-based, grounded in wardrobe) — later

Exit criteria: clothing analysis works end-to-end with a real provider.

## Phase 6 — AI Stylist

1. `WardrobeSnapshot` serializer
2. OpenAI / Anthropic adapter for stylist
3. UI: `/ai-stylist` page with prompt input
4. Cost controls and per-user caps
5. Safety review

Exit criteria: user can ask "what should I wear to a wedding?" and get grounded suggestions.

## Phase 7 — Connections (Social Lite)

1. `connections` schema
2. Send/accept/decline/block flows
3. `/connections` page
4. Privacy posture (no automatic wardrobe access)

Exit criteria: users can be friends; nothing more is shared.

## Phase 8 — Sharing

1. `shared_items` schema
2. Per-item sharing with specific users
3. `Shared with me` view

Exit criteria: a user can share one item; recipient sees only that item.

## Phase 9 — Try-On Profiles

1. Try-on profile data model
2. Reference image upload (separate private bucket)
3. `/try-on` page: profile list, create profile
4. Profile gallery

Exit criteria: a user can manage try-on reference photos. No generation yet.

## Phase 10 — Virtual Try-On

1. Replicate (or other) try-on adapter behind the interface
2. Background job (queue or simple poll)
3. Generation flow with per-call consent
4. History view + retention
5. Cost controls

Exit criteria: user can generate a try-on image of themselves in one of their garments.

## Phase 11 — Borrowing (Future)

1. Borrow request flow
2. Item status (`available | borrowed`)
3. Return date and notifications

## Phase 12 — Scale & Operate

- Move to a real CDN for images
- Add monitoring (Sentry, Logflare)
- Add observability for AI costs
- Add background job runner (Inngest / Cloudflare Queues)
- Add email sending (Resend)
- Add bug bounty / responsible disclosure
- GDPR data export & delete

---

## Risk Register (live)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Auth.js v5 still in beta | Medium | Medium | Pin to a known-good version; have a Lucia fallback in mind |
| R2 SDK quirks with presigned URLs | Low | Medium | Integration test in Phase 2 covers the sign/upload/finalize path |
| Try-on provider cost overrun | Medium | High | Hard per-user caps; per-day limits; cost dashboard before enabling publicly |
| Cross-user access bug in a new feature | Medium | Critical | Security test checklist on every PR; lint rules for `req.query.userId` |
| Image storage cost growth | Medium | Medium | Quotas; lifecycle rules; lazy cleanup |
| Schema migration breaks prod | Low | High | Backfill-then-constraint pattern; preview branches for every PR |
| Vendor lock-in (Vercel, R2) | Low | Medium | Standard Next.js + S3 SDK; portable to AWS/GCP later |
