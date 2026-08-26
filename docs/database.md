# Database Design

## Stack

- **PostgreSQL 16** on Neon (serverless, branches for preview environments)
- **Prisma ORM** with migrations and generated types
- **Migrations** checked into version control; never auto-applied in production

## Conventions

- All tables have `id` (cuid2), `created_at`, `updated_at`
- All FKs cascade on delete from the owner
- All user-owned rows have `user_id` indexed
- Enums stored as Postgres enums (Prisma-native)
- Soft delete (`deleted_at`) only for items that may need recovery; not for sessions

## Core Entities (MVP)

### users
```sql
id              text PK        -- cuid2
email           text UNIQUE NOT NULL
email_verified  timestamptz
username        text UNIQUE NOT NULL
display_name    text
password_hash   text NOT NULL         -- argon2id
image_key       text                  -- R2 object key for avatar
bio             text
created_at      timestamptz NOT NULL
updated_at      timestamptz NOT NULL
deleted_at      timestamptz
```

Indexes: `email` (unique), `username` (unique), `deleted_at` (partial, where null)

### accounts / sessions / verification_tokens
Provided by Auth.js (NextAuth v5) Prisma adapter. Standard schema, unchanged.

### clothing_items
```sql
id                  text PK
user_id             text FK → users(id) ON DELETE CASCADE
name                text NOT NULL
category            text NOT NULL        -- extensible enum
subcategory         text
brand               text
primary_color       text
secondary_colors    text[]               -- Postgres array
size                text
material            text
pattern             text
style               text
occasion            text[]
season              text[]
description         text
purchase_date       date
purchase_price      numeric(10,2)
condition           text                 -- new | like_new | good | worn | damaged
favorite            boolean DEFAULT false
usage_count         integer DEFAULT 0
last_worn_at        timestamptz
ai_suggested        jsonb                -- raw AI suggestions, editable
created_at          timestamptz
updated_at          timestamptz
deleted_at          timestamptz
```

Indexes:
- `(user_id, category)` for filter
- `(user_id, favorite)` for "favorites" view
- `(user_id, last_worn_at DESC)` for "recently worn"
- GIN on `tags`, `occasion`, `season` for filtering
- `to_tsvector('english', name || ' ' || coalesce(description,''))` for full-text search

### clothing_images
```sql
id              text PK
clothing_item_id text FK → clothing_items(id) ON DELETE CASCADE
storage_key     text NOT NULL       -- R2 object key
content_type    text NOT NULL
width           integer
height          integer
bytes           integer
is_primary      boolean DEFAULT false
sort_order      integer DEFAULT 0
created_at      timestamptz
```

Rule: at least one row per clothing item; `is_primary` is unique per item via partial index.

### outfit_items (join table)
```sql
id              text PK
outfit_id       text FK → outfits(id) ON DELETE CASCADE
clothing_item_id text FK → clothing_items(id) ON DELETE RESTRICT
slot            text NOT NULL       -- top | bottom | outerwear | footwear | accessory
sort_order      integer
created_at      timestamptz
```

UNIQUE `(outfit_id, slot, clothing_item_id)` — same item can be in different slots, but not duplicated in the same slot.

### try_on_profiles
```sql
id              text PK
user_id         text FK → users(id) ON DELETE CASCADE
label           text NOT NULL        -- "Front", "Side", etc.
is_default      boolean DEFAULT false
created_at      timestamptz
updated_at      timestamptz
```

### try_on_profile_images
```sql
id                  text PK
try_on_profile_id   text FK → try_on_profiles(id) ON DELETE CASCADE
storage_key         text NOT NULL
content_type        text NOT NULL
width               integer
height              integer
bytes               integer
created_at          timestamptz
```

### try_on_generations
```sql
id                  text PK
user_id             text FK → users(id) ON DELETE CASCADE
try_on_profile_id   text FK → try_on_profiles(id) ON DELETE SET NULL
input_storage_key   text NOT NULL
output_storage_key  text
clothing_item_ids   text[]               -- references to clothing_items
outfit_id           text FK → outfits(id) ON DELETE SET NULL
status              text NOT NULL         -- pending | running | succeeded | failed
provider            text                  -- e.g. "replicate:idm-vton"
error_message       text
created_at          timestamptz
completed_at        timestamptz
```

### connections
```sql
id              text PK
requester_id    text FK → users(id) ON DELETE CASCADE
addressee_id    text FK → users(id) ON DELETE CASCADE
status          text NOT NULL         -- pending | accepted | declined | blocked
created_at      timestamptz
responded_at    timestamptz
UNIQUE (requester_id, addressee_id)
CHECK (requester_id <> addressee_id)
```

### shared_items (future, not in MVP schema but defined for reference)
```sql
id              text PK
owner_id        text FK → users(id) ON DELETE CASCADE
resource_type   text NOT NULL         -- clothing_item | outfit
resource_id     text NOT NULL
shared_with_id  text FK → users(id) ON DELETE CASCADE
permission      text NOT NULL         -- view | suggest | borrow
created_at      timestamptz
```

### rate_limit_events
```sql
id              bigserial PK
user_id         text
ip              inet
endpoint        text
created_at      timestamptz DEFAULT now()
```

INDEX `(ip, endpoint, created_at)`, `(user_id, endpoint, created_at)` for sliding window counts.

## Ownership Rule (enforced in app + DB)

**Every user-owned row has `user_id` as a non-nullable FK with `ON DELETE CASCADE`.** No row exists in a "shared" or "anonymous" state.

There is no concept of `owner_id` separate from `user_id`. There is no `family_id`. The schema cannot represent shared accounts.

## Migration Strategy

- One migration per logical change
- Migrations are reviewed for: index additions, data backfills, constraint additions
- Backfills run as separate migrations from constraint additions (so failed backfills don't lock the table)
- Every migration has a corresponding down or documented irreversibility

## Why these choices

| Choice | Why | Alternatives considered |
|---|---|---|
| cuid2 IDs | URL-safe, unguessable (mitigates IDOR enumeration), no sequence contention | UUID v4 (similar), bigint (leaks count) |
| `user_id` on every row | Defense in depth — even if app authz is buggy, DB enforces isolation | Row-level security (added later) |
| `deleted_at` for soft delete | Recovery from accidental deletion | Hard delete (simpler but unforgiving) |
| jsonb for `ai_suggested` | Schema for AI output is fluid; structured fields are for confirmed user data | Separate table (premature normalization) |
| Postgres enums for `category` | Type safety; can be extended via migration | TEXT + CHECK (less safe), separate lookup table (overkill) |
| GIN indexes on arrays | Fast filtering by tag/season/occasion | Many-to-many tables (more joins, slower) |
