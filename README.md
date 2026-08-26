# Online Wardrobe Platform

A production-quality online wardrobe where every person has their own independent account and private wardrobe.

> Every person is an independent user. Every user owns their own private wardrobe. Connections between users are optional and permission-based.

## Status

**Phase 0 — Architecture** (awaiting review)

The application code has not been written yet. See `docs/` for the design.

## Documentation

- [Product Specification](docs/product-spec.md)
- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [Authentication](docs/authentication.md)
- [Authorization](docs/authorization.md)
- [Storage](docs/storage.md)
- [AI System](docs/ai-system.md)
- [Virtual Try-On](docs/virtual-try-on.md)
- [UI / UX System](docs/ui-system.md)
- [Security](docs/security.md)
- [API Reference](docs/api.md)
- [Testing](docs/testing.md)
- [Roadmap](docs/roadmap.md)

## Tech Stack (proposed)

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui |
| Backend | Next.js Route Handlers + Server Actions |
| Database | PostgreSQL (Neon) + Prisma |
| Auth | Auth.js v5 (Credentials + DB sessions) + argon2id |
| Storage | Cloudflare R2 (S3-compatible, private) + signed URLs |
| AI | Internal `services/ai/` interface; Stub adapter in MVP |
| Validation | Zod (client + server) |
| Testing | Vitest + Playwright |
| Deployment | Vercel (app) + Neon (DB) + R2 (storage) |

## Getting Started (once Phase 1 is implemented)

```bash
# Install
npm install

# Set up environment
cp .env.example .env
# Fill in DATABASE_URL, AUTH_SECRET, R2_*

# Set up database
npx prisma migrate dev

# Run
npm run dev
```

## Contributing

This is a private project. The roadmap in `docs/roadmap.md` is the source of truth for what's being built.

## License

Proprietary. All rights reserved.
