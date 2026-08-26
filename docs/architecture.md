# Architecture

## System Overview

```
                    ┌──────────────────────────────────────────┐
                    │              Browser (Client)            │
                    │   Next.js App Router, React, Tailwind    │
                    └────────────────┬─────────────────────────┘
                                     │ HTTPS
                                     │ (httpOnly session cookies)
                                     ↓
                    ┌──────────────────────────────────────────┐
                    │         Next.js (Vercel)                 │
                    │  ┌────────────────────────────────────┐  │
                    │  │  Server Components / Pages         │  │
                    │  │  Route Handlers  (REST /api/*)     │  │
                    │  │  Server Actions                    │  │
                    │  │  Middleware (auth, rate limit)     │  │
                    │  └────────────┬───────────┬───────────┘  │
                    │               │           │              │
                    │        ┌──────┴─────┐  ┌──┴──────────┐  │
                    │        │ Auth.js   │  │ Services     │  │
                    │        │ sessions  │  │ (domain)     │  │
                    │        └──────┬─────┘  └──┬───────────┘  │
                    │               │           │              │
                    │        ┌──────┴───────────┴───────────┐  │
                    │        │  Data Access (Prisma)        │  │
                    │        └──────┬───────────┬───────────┘  │
                    └───────────────┼───────────┼──────────────┘
                                    │           │
                          ┌─────────┘           └──────────┐
                          ↓                                ↓
              ┌────────────────────┐          ┌──────────────────────┐
              │  PostgreSQL        │          │  Cloudflare R2       │
              │  (Neon)            │          │  (S3-compatible)     │
              │                    │          │                      │
              │  - users           │          │  clothing images     │
              │  - sessions        │          │  try-on refs         │
              │  - clothing_items  │          │  generated outputs   │
              │  - outfits         │          │                      │
              │  - try-on profiles │          │  private by default  │
              │  - permissions     │          │  signed URLs only    │
              └────────────────────┘          └──────────────────────┘

                                  ┌──────────────────────────┐
                                  │   AI Service Layer       │
                                  │   services/ai/           │
                                  │                          │
                                  │  interface.ts (types)    │
                                  │  StubAdapter  (MVP)      │
                                  │  OpenAIAdapter  (later)  │
                                  │  TryOnAdapter  (later)   │
                                  │                          │
                                  │  Selected via env var:   │
                                  │  AI_PROVIDER=stub        │
                                  └──────────────────────────┘
```

## Layered Design

```
app/                  ── Presentation (RSC, client components, pages)
  ├─ (marketing)/     ── Public landing, pricing, auth pages
  └─ (app)/           ── Authenticated app (wardrobe, outfits, settings)
       middleware.ts  ── Auth gate, rate limiting
       layout.tsx     ── Session provider, query client

components/           ── Reusable UI (shadcn/ui-based, design system)

lib/                  ── Cross-cutting utilities
  ├─ auth/            ── Auth.js config, session helpers
  ├─ validation/      ── Zod schemas (single source of truth)
  └─ utils/           ── Pure helpers

server/               ── Server-only code (NEVER bundled to client)
  ├─ services/        ── Domain services (single-responsibility)
  │   ├─ wardrobe/
  │   ├─ outfits/
  │   ├─ try-on/
  │   ├─ ai/          ── AI abstraction + adapters
  │   ├─ storage/     ── R2 client, presigned URLs
  │   └─ connections/
  ├─ middleware/      ── Auth, rate limit, request ID
  └─ errors/          ── AppError hierarchy, error boundary

prisma/               ── Schema, migrations, seed
  ├─ schema.prisma
  └─ migrations/

tests/                ── Vitest + Playwright
  ├─ unit/            ── Services, utils
  ├─ integration/     ── API routes with test DB
  └─ e2e/             ── User flows
```

## Key Design Decisions

1. **Server-first**: Most data fetching happens in Server Components / Server Actions. Client state is minimal and ephemeral.
2. **Service layer above Prisma**: Business logic in `server/services/*`. Prisma calls never appear in route handlers directly. Makes testing and auditing easier.
3. **AI behind an interface**: No domain code imports a concrete AI provider. Always goes through the interface.
4. **Storage URLs are short-lived and scoped**: No public buckets. Every read requires a fresh signed URL minted server-side after authz check.
5. **Authorization in one place**: A `requireOwnership(resource)` helper is the only path to user-owned data. Banned patterns enforced via lint rules and code review checklist.

## Why these layers

| Layer | Purpose | Why |
|---|---|---|
| `app/` | UI + route entry | Framework convention; lets us use RSC and Server Actions |
| `components/` | Reusable UI | Avoid duplication; design system lives here |
| `lib/` | Cross-cutting | Anything imported by both client and server |
| `server/services/` | Domain logic | Testable without HTTP; centralized authorization |
| `prisma/` | Data | Schema is the contract |
| `tests/` | Verification | Critical for security assertions |

## Data Flow: Adding a Clothing Item

```
Browser                Next.js Server              Postgres          R2
  │                          │                         │               │
  │  POST /api/wardrobe/     │                         │               │
  │  items (multipart)       │                         │               │
  ├─────────────────────────→│                         │               │
  │                          │ Auth.js validates       │               │
  │                          │ session, gets userId    │               │
  │                          │                         │               │
  │                          │ Zod parses form data    │               │
  │                          │ (size, type, fields)    │               │
  │                          │                         │               │
  │                          │ storage.put()           │               │
  │                          ├────────────────────────────────────────→│
  │                          │←────────────────────────────────────────┤
  │                          │ { key, etag }           │               │
  │                          │                         │               │
  │                          │ wardrobe.create({       │               │
  │                          │   userId, ...,          │               │
  │                          │   imageKey: key })       │               │
  │                          ├────────────────────────→│               │
  │                          │←────────────────────────┤               │
  │                          │                         │               │
  │                          │ thumbnail job (queue)   │               │
  │                          │                         │               │
  │  201 Created             │                         │               │
  │←─────────────────────────┤                         │               │
```

## Failure Modes (handled)

- **Auth failure** → 401, no detail leak
- **Authz failure** → 403, identical to "not found" to prevent enumeration
- **Validation failure** → 400 with field-level errors (Zod issues)
- **Storage failure** → rollback DB insert (transactional outbox or compensating delete)
- **AI failure** → return null/empty; never block the user-facing flow
- **Rate limit** → 429 with Retry-After

## Why Next.js Route Handlers + Server Actions (not Express)

- Single TypeScript codebase, one deploy unit
- Server Actions eliminate most API boilerplate for mutations
- Vercel-native scaling, no infra to manage
- Auth.js integrates cleanly with the App Router

Trade-off: We're tied to Next.js's request lifecycle. If we need long-lived connections (WebSockets for try-on progress), we'll add a separate small Node service in a later phase.

## Out of Scope for MVP

- WebSockets / real-time
- Mobile native app
- Public sharing
- Borrowing
- Payment / e-commerce
- Email sending (architecture supports it; MVP uses console log)
