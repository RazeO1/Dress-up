# Testing Strategy

## Goals

1. **Security is verifiable** — the cross-user access tests are non-negotiable
2. **Domain logic is correct** — services behave as specified
3. **UI flows work** — happy paths are covered by e2e
4. **Tests are fast enough to run on every change** — under 5 minutes for the full suite

## Layers

```
tests/
├── unit/                    — Pure functions, services, utils
│   ├── wardrobe.test.ts
│   ├── outfit.test.ts
│   ├── ai-stub.test.ts
│   └── assertOwner.test.ts
├── integration/             — API routes with a real test DB
│   ├── auth.test.ts
│   ├── wardrobe.test.ts
│   ├── outfits.test.ts
│   ├── upload.test.ts
│   └── security/
│       ├── cross-user-wardrobe.test.ts
│       ├── cross-user-outfit.test.ts
│       ├── cross-user-try-on.test.ts
│       ├── cross-user-storage.test.ts
│       ├── brute-force.test.ts
│       └── oversized-upload.test.ts
├── e2e/                     — Playwright; user flows in a real browser
│   ├── register-login.spec.ts
│   ├── add-clothing.spec.ts
│   ├── create-outfit.spec.ts
│   └── view-wardrobe.spec.ts
└── helpers/
    ├── testDb.ts            — DB reset, factory functions
    ├── testAuth.ts          — Sign in as a test user, get session
    └── factories.ts         — Build users, items, outfits
```

## Tools

- **Vitest** for unit and integration (faster than Jest, ESM-native)
- **Playwright** for e2e
- **Supertest** (or fetch in Vitest) for HTTP assertions in integration
- **Prisma** connected to a dedicated test database (Neon branch per PR or local Postgres in CI)

## Required Test Coverage (per master spec Section 26)

### Authentication
- ✅ Registration succeeds with valid input
- ✅ Registration rejects invalid email / weak password / taken username
- ✅ Login succeeds with correct credentials
- ✅ Login fails with wrong password (no enumeration)
- ✅ Logout invalidates the session
- ✅ Protected route returns 401 without session
- ✅ Brute force protection triggers after threshold

### Authorization (the critical ones)
- ✅ User A cannot read User B's wardrobe
- ✅ User A cannot read User B's clothing item
- ✅ User A cannot update User B's clothing item
- ✅ User A cannot delete User B's clothing item
- ✅ User A cannot read User B's outfit
- ✅ User A cannot read User B's try-on profile
- ✅ User A cannot read User B's try-on generation
- ✅ User A cannot mint a signed URL for User B's image
- ✅ User A cannot list all users (no global finders)

### Wardrobe
- ✅ Create item
- ✅ Read item
- ✅ Update item
- ✅ Delete item
- ✅ Search returns expected items
- ✅ Filter by category
- ✅ Pagination is correct

### Outfits
- ✅ Create
- ✅ Update
- ✅ Delete
- ✅ Ownership enforced (same as wardrobe)

### Storage
- ✅ Upload succeeds for valid image
- ✅ Upload rejects invalid file (wrong MIME, no magic bytes)
- ✅ Upload rejects oversized file
- ✅ Signed URL expires after TTL
- ✅ Cross-user signed URL mint is rejected

## Test Data

- **Factories** generate unique emails/usernames per test (no shared state)
- **Test DB** is reset between test files (`prisma migrate reset` or truncate)
- **Test users** are clearly named (`test-user-${nanoid()}@example.com`) and never used in dev/prod

## CI

- Run on every PR
- Required checks: lint, typecheck, unit, integration, e2e (smoke)
- Security tests are a separate required check
- Coverage thresholds: 80% lines on `server/services/**` (not enforced by default, but tracked)

## What's NOT tested

- Visual regression (added later if needed)
- Load testing (added in a later phase; rough targets documented in `architecture.md`)
- Third-party AI providers (mocked at the adapter boundary)
- Email sending (stubbed)

## Why these choices

| Choice | Why | Alternatives considered |
|---|---|---|
| Vitest over Jest | Faster; native ESM/TS | Jest (slower, more config) |
| Playwright over Cypress | Better cross-browser; first-class TS | Cypress (good but heavier) |
| Test DB per run, not per test | Pragmatic; fast enough | Per-test transactions (complex with parallel) |
| Security tests in their own folder | High signal; easy to point to | Mixed in (harder to find) |
