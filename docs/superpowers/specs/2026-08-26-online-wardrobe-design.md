# Online Wardrobe Platform — Phase 0 Design Spec

**Date:** 2026-08-26
**Status:** Draft, awaiting user approval
**Path:** Architectural (new project from empty directory)

## 1. Product

A multi-user SaaS-style application where each registered user owns a private wardrobe. Every person has their own account, their own data, and their own try-on profile. Connections and sharing are explicit, opt-in, and never grant blanket access.

The MVP scope (per master prompt Section 30):

```
Account → Login → Personal Profile → Private Wardrobe
        → Upload Clothing → Manage Clothing → Create Outfit
```

Everything beyond (connections, sharing, AI, try-on) is architecturally present but not implemented as a real feature in MVP.

## 2. Stack (locked after 4 user decisions)

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript strict |
| Styling | Tailwind + shadcn/ui |
| Forms / validation | react-hook-form + Zod |
| Server state | TanStack Query + RSC |
| Client state | Zustand (sparingly) |
| Database | PostgreSQL (Neon) + Prisma |
| Auth | Auth.js v5 (Credentials) + DB sessions + argon2id |
| Storage | Cloudflare R2 (S3-compatible, private) + signed URLs |
| AI | Interface + Stub adapter (no real provider in MVP) |
| Tests | Vitest + Playwright |
| Deploy | Vercel |

## 3. Architecture (one paragraph)

A Next.js application deployed on Vercel. Auth.js handles credentials login with DB-backed sessions. All data lives in Postgres (via Prisma). All user images live in private R2 buckets and are served via short-lived signed URLs minted server-side after the requester is verified to be the resource owner. AI features go through `server/services/ai/` which exposes a single interface; the MVP ships only `StubAdapter` that returns `AINotConfiguredError` — no fake results. Domain logic lives in `server/services/<feature>/` and takes `userId` as its first argument; cross-user access is impossible by construction.

## 4. Authorization (the single rule)

**No request may read or modify a user-owned resource without the user identity being derived from the server-side session, and the resource being verified to belong to that user.**

Concrete enforcement:

- Service methods take `userId` as first arg
- `assertOwner(resource, userId)` is the only ownership check
- DB queries include `WHERE user_id = $userId` (defense in depth)
- Cross-user attempts return 404 (not 403) to prevent ID enumeration
- Cross-user attempts are audit-logged
- Lint rules ban `req.query.userId` / `req.body.userId` patterns

## 5. AI / Try-on (architectural honesty)

- Interface defined; no implementation in MVP
- `StubAdapter` returns typed `AINotConfiguredError`
- UI shows "Coming soon" honestly
- No mock data is presented as real output
- A `capabilities` endpoint tells the UI which features are live

## 6. Security posture (highlights)

- argon2id passwords; per-user salt
- DB sessions (revocable); httpOnly + Secure + SameSite=Lax cookies
- 5/15min rate limit on login (per IP) and 10/15min (per account)
- 10 MB upload cap; magic-byte MIME check; EXIF GPS strip
- 5-minute signed URL TTL
- CSP, HSTS, X-Frame-Options, Permissions-Policy
- Audit log for cross-user attempts
- Mandatory security tests in CI

## 7. MVP scope (explicit)

In:
- Register, login, logout
- Profile + avatar
- Wardrobe CRUD with images
- Outfit CRUD
- Settings (change password, theme, delete account)
- Email verification / password reset **architecture** (send is stubbed to console)
- All security tests
- Deployment to Vercel

Out (architected, deferred):
- Real AI analysis / stylist / try-on (StubAdapter only)
- Connections and friends
- Sharing
- Borrowing
- Public profile
- Email sending (send is a no-op stub in MVP)
- WebSockets / real-time

## 8. Phasing

Phase 0 (NOW): this spec + 12 docs in `docs/`. STOP for review.
Phase 1: foundations (auth, deploy, CI)
Phase 2: wardrobe MVP
Phase 3: outfits
Phase 4: polish + profile + settings
Phase 5+: AI, social, sharing, try-on (one at a time)

Full detail in `docs/roadmap.md`.

## 9. Top 5 risks

1. Cross-user access bug in a new feature → mitigated by the security test suite + lint rules
2. AI cost overrun when real providers land → mitigated by per-user caps and capabilities endpoint
3. Storage cost growth with many images → mitigated by quotas and lifecycle rules
4. Vendor lock-in (Vercel, R2) → mitigated by using standard SDKs (S3 SDK) and Next.js conventions
5. Auth.js v5 still in beta → mitigated by version pinning and a Lucia fallback plan

## 10. Open questions for later (intentionally deferred)

- Single-garment vs full-outfit try-on (v1)
- AI styling: free-text only or guided?
- Background job runner choice (Postgres queue vs Inngest vs Cloudflare Queues)
- Email provider (Resend vs Postmark)
- CDN in front of private images (probably not needed; signed URLs + R2 edge is enough for MVP)

## 11. What I will NOT do without your explicit approval

- Write any application code
- Initialize the Next.js project
- Install dependencies
- Create a git repo
- Run any commands beyond `ls` and `mkdir docs/`

I will stop after this spec and wait for your review.
