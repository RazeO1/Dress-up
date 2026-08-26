# Authentication

## Goals

- Strong, standard, audited authentication
- Sessions that survive page reloads but can be revoked server-side
- Defense against brute force, credential stuffing, and session hijacking
- Clean integration with our authorization layer (next doc)

## Stack

- **Auth.js v5 (NextAuth)** with Credentials provider
- **Database sessions** (stored in Postgres, not JWT) so we can revoke immediately
- **argon2id** for password hashing (via `argon2` npm package)
- **httpOnly, Secure, SameSite=Lax** session cookies
- **Middleware-based rate limiting** for login and registration endpoints

## User Model

Each user is a row in `users` with a unique `email` and `username`. The `password_hash` column holds an argon2id-encoded string. We never store plaintext passwords, recovery codes, or password hints.

Auth.js's Prisma adapter adds the standard `accounts`, `sessions`, and `verification_tokens` tables. We use them as-is.

## Registration

```
POST /api/auth/register
  { email, username, password, displayName? }
```

Steps:
1. Validate input with Zod (email format, username regex `/^[a-z0-9_]{3,20}$/`, password ≥ 12 chars + complexity check)
2. Normalize email (lowercase, trim)
3. Check uniqueness for email and username — return generic "could not register" on conflict (prevents enumeration)
4. Hash password with argon2id (memory: 19 MiB, iterations: 2, parallelism: 1 — OWASP 2024 recommended baseline)
5. Insert user (transaction with uniqueness check)
6. Issue email verification token (stored in `verification_tokens`) — **email sending is stubbed in MVP (logged to console)**
7. Return 201 with no body (user must log in to receive a session)

## Login

```
POST /api/auth/callback/credentials
  { email, password }
```

Steps:
1. Rate limit: 5 attempts per IP per 15 min, 10 per account per 15 min (sliding window in `rate_limit_events`)
2. Look up user by email
3. Verify password with argon2 verify (constant-time)
4. On failure: increment counter, return generic "invalid credentials" (no enumeration)
5. On success: clear failure counter, create DB session, set session cookie
6. Return user object to the client (no sensitive fields)

## Session

- 30-day rolling expiry; refreshed on each request that finds a valid session
- Cookie name: `__Host-auth.session` (the `__Host-` prefix forces Secure + path=/ + no Domain)
- Cookie flags: `HttpOnly; Secure; SameSite=Lax; Path=/`
- Session token is 32 random bytes base64url; stored hashed (sha256) in DB
- Logout deletes the DB session row AND clears the cookie (single-source-of-truth)

## Logout

```
POST /api/auth/signout
```

Deletes the session row, clears the cookie. Idempotent (works even if the session is already gone).

## Password Reset (architecture, email is stubbed in MVP)

```
POST /api/auth/forgot-password   { email }
POST /api/auth/reset-password    { token, newPassword }
```

- `forgot-password` always returns 200 (no enumeration) and, if the email exists, creates a `verification_tokens` row with a 1-hour token
- `reset-password` consumes the token (single-use), updates the password hash, and revokes all existing sessions for that user
- The new password is hashed and stored; old sessions are invalidated

## Email Verification (architecture, email is stubbed in MVP)

- Verification token created at registration
- Unverified users can log in but see a "verify your email" banner
- A user without verification can use the app with reduced permissions (no AI, no try-on) until verified
- `verification_tokens` table is the source of truth; tokens are 32 bytes, single-use, 24h expiry

## Middleware (Next.js middleware)

Runs on every request to non-public routes. Responsibilities:

1. Resolve session from cookie (Auth.js)
2. Attach `userId` to request context
3. If route requires auth and no session → 302 to `/login?from=...`
4. Rate-limit per-IP for auth endpoints
5. Add a request ID and security headers

## Security Headers (set in middleware)

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; img-src 'self' https://<r2-public-host> data:; ...
```

CSP is conservative in MVP; we'll loosen `img-src` to include the R2 public host (or a CDN in front of it) only if needed. Private images are never served from a public bucket — they use signed URLs from a private bucket.

## Brute-Force Protection

- Sliding window in `rate_limit_events` table
- IP-based limit on `/api/auth/*` endpoints (5 / 15 min)
- Account-based limit (10 / 15 min) — different bucket, prevents attacker rotating IPs
- After 20 total failures, the account is locked for 1 hour; unlock by email link (architectural stub)

## CSRF

Auth.js v5 has built-in CSRF protection for credential callbacks. Server Actions are protected by Next.js's same-origin policy. For our custom route handlers, we either:
- Use Server Actions (recommended for mutations)
- Or require `Origin` header to match a configured value for state-changing `POST`s

## Threat Model

| Threat | Mitigation |
|---|---|
| Credential stuffing | Rate limit + (future) breached-password check |
| Brute force | Sliding-window rate limit + lockout |
| Session hijacking | httpOnly + Secure cookie, session token hashed at rest |
| Session fixation | New session ID on login |
| Password DB leak | argon2id; per-user salt |
| Email enumeration | Identical response time/format for valid/invalid |
| Phishing | Standard Auth.js UI; no custom domain tricks |
| Replay of reset token | Single-use, hashed at rest, short TTL |
| Open redirect on `?from=` | Allow only same-origin paths |

## What we explicitly do NOT do

- No JWT sessions (cannot revoke; bigger blast radius on cookie theft)
- No "remember me" checkbox that extends session indefinitely (the rolling 30-day expiry is the max)
- No password hints or security questions
- No social login in MVP (can be added in a later phase)
- No custom password rules beyond length + complexity (NIST 800-63B)

## Why these choices

| Choice | Why | Alternatives considered |
|---|---|---|
| Auth.js v5 | Mature, audited, App Router-native | Clerk (externalizes user table), Lucia (more code), custom (too much risk) |
| DB sessions | Revocable; smaller blast radius | JWT (faster but not revocable) |
| argon2id | OWASP-recommended; memory-hard | bcrypt (older, GPU-friendly), scrypt (fine, but argon2id is the modern pick) |
| Sliding-window rate limit in DB | Simple, correct | Redis (extra infra for MVP) |
| `__Host-` cookie prefix | Browser-enforced cookie hardening | Standard cookie name (weaker) |
