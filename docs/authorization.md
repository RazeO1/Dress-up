# Authorization

## Goal

Ensure that **no user can read, modify, or delete another user's private resources** — even by manipulating IDs, query parameters, or request bodies.

The principle: **the authenticated identity comes from the server-side session, never from the client.** Every protected operation:

```
Request → identify user (from session) → fetch resource → check ownership/permission → act or 404
```

## The One Rule

**There is exactly one path from a request to a user-owned resource:**

```ts
const userId = await getCurrentUserId();        // 1. From session, server-only
const resource = await wardrobe.findById(id);   // 2. Fetch
assertOwner(resource, userId);                 // 3. Enforce
return resource;                               // 4. Return
```

If any code path does anything different, it's a bug. We enforce this through:

1. **Code patterns** — `assertOwner` is the only ownership check; lint rules ban patterns like `findByIdAndOwner(id, req.query.user_id)`.
2. **Database constraints** — every user-owned row has a non-nullable `user_id` FK; a query that filters by both `id` and `user_id` is a defense-in-depth win.
3. **Tests** — security tests (Section 26 of master spec) verify cross-user access is denied at the route, service, and storage layers.

## What the Client Must NEVER Provide

- `user_id`, `owner_id`, `userId` as a query string, body field, or path parameter that influences data access
- The target user's identity in any way

The client may provide:
- The resource ID (e.g., `clothing_item_id`) — ownership is verified server-side
- Its own session cookie

## Service Layer Pattern

Every service that touches user-owned data exposes methods that take `userId` as the **first argument** and return data scoped to that user. There are no "global" methods.

```ts
// ✅ Correct
class WardrobeService {
  async listItems(userId: string, filters: ItemFilters): Promise<Item[]>
  async getItem(userId: string, itemId: string): Promise<Item>
  async createItem(userId: string, input: CreateItemInput): Promise<Item>
  async updateItem(userId: string, itemId: string, input: UpdateItemInput): Promise<Item>
  async deleteItem(userId: string, itemId: string): Promise<void>
}

// ❌ Forbidden
class WardrobeService {
  async getItem(itemId: string): Promise<Item>  // No userId → no authz
  async listAllItems(): Promise<Item[]>          // No scope
}
```

## The `assertOwner` Helper

```ts
// server/lib/assertOwner.ts
export function assertOwner<T extends { userId: string }>(
  resource: T | null,
  userId: string,
  resourceName: string
): asserts resource is T {
  if (!resource) {
    // Identical to forbidden to prevent enumeration
    throw new ForbiddenError(`${resourceName} not found`);
  }
  if (resource.userId !== userId) {
    // Log the attempt; never reveal that the resource exists
    auditLog.securityEvent('cross_user_access_attempt', { userId, resourceName });
    throw new ForbiddenError(`${resourceName} not found`);
  }
}
```

The error message is identical for "not found" and "not yours" — the response is 404 (or 403 with the same body), so an attacker cannot enumerate which IDs are valid.

## Route Handler Pattern

```ts
// app/api/wardrobe/items/[id]/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = await requireUserId();         // throws 401 if not signed in
  const item = await wardrobe.getItem(userId, params.id);  // service enforces ownership
  if (!item) return new Response('Not found', { status: 404 });
  return Response.json(serializeItem(item));
}
```

## Where the Rule Applies

- `users` (other users' profiles, settings)
- `clothing_items` and `clothing_images`
- `outfits` and `outfit_items`
- `try_on_profiles` and `try_on_profile_images`
- `try_on_generations`
- Stored objects (clothing images, try-on refs, try-on outputs)
- Future: shared items, connections, notifications

## What About Public Resources?

The MVP has **no public user resources**. Every user-owned thing is private. The first time we add a "public outfit" feature, it will be:
- An explicit per-resource visibility flag
- A separate `findPublic` method on the service that filters by `visibility = PUBLIC` AND `userId != blockedByViewer`
- Never returned by `getItem` or `listItems`

## Connection-Based Access (future)

When users A and B are connected, the access model is:

| Action | A's own | B's connected | Strangers |
|---|---|---|---|
| View A's profile | ✅ | public fields only | public fields only |
| View A's wardrobe | ✅ | ❌ by default | ❌ |
| View A's specific shared item | ✅ | ✅ if shared | ❌ |
| Suggest outfit for A | ✅ | ✅ if permission granted | ❌ |

Even between connected users, the default for "view wardrobe" is **deny**. Access is granted by an explicit `shared_items` row (Section 18 of master spec) or by the `connections` table enabling a specific feature.

## IDOR Defense Layers (defense in depth)

1. **App layer** — `assertOwner` in every service method
2. **DB layer** — every query that returns user-owned data includes `WHERE user_id = $userId`
3. **Storage layer** — every signed URL is minted for a specific `key` AND a specific authenticated user
4. **Test layer** — security tests assert cross-user access is denied at every layer

## The Audit Log

A `security_events` table records:

- `cross_user_access_attempt` — when assertOwner triggers
- `permission_denied` — when a permission check fails
- `signed_url_minted` — when a private storage URL is issued (with resource key, userId, requestId)
- `auth_failure` — failed login, expired session

Records are append-only. They feed monitoring and forensic review.

## Why "Not Found" Instead of "Forbidden"

Returning 403 ("forbidden") when the resource exists but isn't yours **tells the attacker the ID is valid**. Returning 404 in both cases ("doesn't exist" and "isn't yours") makes enumeration impossible.

This is a deliberate trade-off: a slightly worse UX for the legitimate user (they don't know if they typed the wrong ID or hit someone else's resource) in exchange for not leaking ID validity.

## Why these choices

| Choice | Why | Alternatives considered |
|---|---|---|
| `userId` first arg | Forces the call site to think about authz | Context-based (less explicit) |
| 404 instead of 403 for cross-user | Prevents enumeration | 403 (more accurate but leaks) |
| DB-layer `WHERE user_id` | Defense in depth | App-only (single point of failure) |
| Audit log on attempts | Forensic value, deterrent | None (silent — easier to attack) |
