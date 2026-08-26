# Security

## Threat Model Summary

The platform handles private data (clothing photos, try-on reference images, outfits) and uses authentication and authorization throughout. The threat model is:

| Adversary | Goal | Capability |
|---|---|---|
| **Anonymous** | Account takeover, data leak | Public network access; no credentials |
| **Authenticated user A** | Access user B's data | Valid session, but not B's |
| **Authenticated user A** | Privilege escalation | Valid session, tries to elevate |
| **Authenticated user A** | Brute-force another account | Rotating IPs |
| **Malicious uploader** | Store malicious files, exploit parsers | Can upload arbitrary bytes within limits |
| **Network observer** | Steal session | Sees TLS traffic |
| **Compromised dependency** | RCE, data exfil | Runs in our process |

## Defenses

### Authentication
- argon2id password hashing
- DB-backed sessions (revocable)
- httpOnly + Secure + SameSite=Lax cookies
- Sliding-window rate limits on auth endpoints
- 30-day rolling session expiry
- Per-account lockout after threshold (architectural)

### Authorization
- `assertOwner` is the only path from request to user-owned resource
- Service methods take `userId` as first argument; no global finders
- 404 (not 403) on cross-user access to prevent enumeration
- Defense in depth: `WHERE user_id = $userId` on every query
- Audit log on every cross-user access attempt

### Input Validation
- Zod schemas on every API entry point
- Same schemas reused on the client (single source of truth)
- File uploads: MIME + magic-byte check, size limit, image-only

### Output Handling
- React's default JSX escaping (no `dangerouslySetInnerHTML` in our code)
- No `eval`, no `Function()` constructor
- Server responses use `JSON.stringify` (no string concatenation)

### Headers (set in middleware)
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Conservative CSP (loosened carefully with documented allowlists)

### CSRF
- Auth.js handles its own CSRF tokens
- Server Actions inherit Next.js same-origin protection
- Custom route handlers that change state require `Origin` header match

### Storage Security
- All buckets private; no public bucket policy
- Object keys include `user_id` for ownership verification
- Signed URLs only; TTL = 5 min
- Signed URL mint asserts requester = key owner

### Rate Limiting (auth + uploads)
- 5 login attempts / 15 min per IP
- 10 login attempts / 15 min per account
- 30 clothing uploads / hour per user
- 100 try-on generations / day per user (when implemented)
- 50 AI stylist requests / day per user (when implemented)

### Secrets Management
- All secrets in env vars; `.env` is git-ignored
- `.env.example` lists required keys with placeholder values
- Vercel environment variables for production
- No secrets in client bundle (verified by build)

### Dependency Hygiene
- `npm audit` in CI
- Dependabot or Renovate for updates
- Pin major versions in `package.json`; minor/patch via lockfile
- Quarterly review of all direct dependencies

### Logging Hygiene
- Never log: passwords, session tokens, signed URLs, API keys
- PII redaction: emails and usernames are logged with a request ID; full PII only in the audit log which is access-controlled
- Stack traces never returned to clients in production

## What We Do NOT Do (yet)

- No WAF in front of the app (Vercel provides basic DDoS protection; Cloudflare can be added in front if needed)
- No bug bounty program (single-team MVP)
- No SOC 2 / GDPR formal program (architecture supports it; formalization later)
- No anomaly detection on login patterns (manual review of auth_failure log for now)

## Security Tests (mandatory)

The following must pass before any feature ships:

1. **Cross-user access denied**:
   - User A registers, adds a clothing item
   - User B registers
   - User B attempts `GET /api/wardrobe/items/<A's item id>` → 404
   - User B attempts `PUT /api/wardrobe/items/<A's item id>` → 404
   - User B attempts `DELETE /api/wardrobe/items/<A's item id>` → 404
   - User B attempts to mint a signed URL for A's image key → rejected
2. **Brute force lockout**: 6 failed logins in 15 min from one IP → 429
3. **Invalid file upload**: a file with `image/jpeg` MIME but PNG magic bytes is rejected at finalize
4. **Oversized upload**: a 12 MB file is rejected at sign
5. **Unauthenticated access**: any protected route returns 401 without a session
6. **Session revocation**: after password reset, old session cookies are rejected
7. **SQL injection attempt**: search input containing `' OR 1=1 --` returns no results and no error leak
8. **XSS attempt**: a clothing item name with `<script>` is stored and rendered as text, not executed

These tests live in `tests/security/` and run in CI.

## Incident Response (lightweight, MVP)

If a security issue is found:
1. Stop the bleed (revert the change, rotate secrets)
2. Identify scope (audit log query)
3. Notify affected users if data was exposed
4. Write a public postmortem (in `docs/postmortems/`)

No formal on-call rotation in MVP.

## Why these choices

| Choice | Why | Alternatives considered |
|---|---|---|
| argon2id | OWASP 2024 recommendation | bcrypt (older), scrypt (fine but argon2id is modern) |
| DB sessions | Revocable immediately | JWT (faster but not revocable) |
| 404 instead of 403 for cross-user | Prevent enumeration | 403 (more accurate) |
| Single `assertOwner` helper | One place to audit; lint enforces | Per-endpoint checks (drift) |
| No secrets in client bundle | Standard hygiene | (no alternative — non-negotiable) |
| CSP enforced | Defense in depth | None (single layer of defense) |
