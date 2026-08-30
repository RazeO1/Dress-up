# TAG — Brutalist Garment-Tag Wardrobe App

**Spec version:** 1.0
**Date:** 2026-08-30
**Phase:** 1 — Wardrobe Core + Auth + Landing Page

---

## 1. Concept & Vision

TAG is a wardrobe inventory app built around the visual language of **clothing care labels** — stark, uppercase, monospaced, utilitarian. Every UI element borrows from the world of garment tags: care symbols become icons, category labels read like fabric content stamps, and item cards look like they were clipped from a warehouse manifest. The aesthetic is deliberately anti-polish — no gradients, no rounded corners, no soft UI. It should feel like a well-organized closet run by someone who works in logistics.

---

## 2. Design Language

### Aesthetic Direction
**Brutalist garment-tag.** Inspired by care labels, warehouse inventory tags, and shipping labels. Functional over decorative. Every element earns its place.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `background` | `#F2EDE4` | Aged paper — warm off-white, care-label stock |
| `foreground` | `#0A0A0A` | Near-black ink |
| `accent` | `#FFE500` | Hazard yellow — CTA highlights, active states, hover accents |
| `muted` | `#E2DDD4` | Subtle dividers, card fills, inactive tabs |
| `muted-foreground` | `#6B6560` | Secondary labels, hints |
| `destructive` | `#D62828` | Delete actions, errors |
| `border` | `#0A0A0A` | All borders — solid, stark, 1.5px |
| `card` | `#F2EDE4` | Same as background, bordered |

### Typography

| Role | Font | Weight | Treatment |
|---|---|---|---|
| Display / Logo | `Space Mono` | 700 | ALL CAPS, tracked out |
| Headings | `Space Mono` | 700 | Sentence case, normal tracking |
| Body | `IBM Plex Mono` | 400/500 | Normal case, readable at 14px |
| Labels / Tags | `Space Mono` | 400 | ALL CAPS, 11px, letter-spaced |
| Data / Counts | `Space Mono` | 400 | Tabular figures, monospaced numbers |

### Spatial System

- Base unit: `8px`
- Section padding: `64px` vertical, `24px` horizontal (mobile: `32px` / `16px`)
- Card padding: `12px`
- Border radius: **0** (everywhere — no rounded corners)
- Border width: `1.5px` solid `#0A0A0A`
- Grid gap: `16px` (mobile: `12px`)

### Motion Philosophy

Motion is **purposeful and mechanical**, not bouncy or organic.

- Page transitions: fade + slight translate-y (`0 → 1 opacity`, `8px → 0 translateY`), `200ms ease-out`
- Card hover: `border-color` shifts to `#FFE500`, `box-shadow: 4px 4px 0 #0A0A0A` — feels like a stamp landing
- Loader: vertical stamp animation — a care-tag icon stamping down repeatedly
- Staggered grid reveal on load: `100ms` delay between cards, `opacity 0 → 1` + `translateY(8px → 0)`
- No spring physics, no elastic easing — `ease-out` only

### Visual Assets

- **Icons:** Lucide React — `strokeWidth={1.5}`, size `16px` (labels) / `20px` (nav) / `24px` (CTA)
- **No images on landing page** — use CSS geometric shapes, borders, and typography to create visual interest
- **Item photos:** User-uploaded, displayed in care-tag card frames
- **Favicon:** SVG — a clothing tag shape in `#FFE500` on `#0A0A0A` background

---

## 3. Layout & Structure

### Routes

```
/                   → Landing page (public)
/login              → Login page (public)
/signup             → Signup page (public)
/wardrobe           → Wardrobe grid (auth required)
/wardrobe/[id]      → Item detail (sheet/modal)
/settings           → Account settings (auth required)
```

**Auth redirect:** `/wardrobe` redirects unauthenticated users to `/login`. `/` redirects authenticated users to `/wardrobe`.

### Landing Page (`/`)

```
┌──────────────────────────────────────────────────────┐
│  [TAG]                              [LOGIN] [SIGNUP] │
├──────────────────────────────────────────────────────┤
│                                                      │
│  YOUR WARDROBE.                                      │
│  NO EXCUSES.                                         │
│                                                      │
│  Tag every piece. Know what you own.                 │
│  Wear more of it.                                    │
│                                                      │
│  [START FREE →]                                      │
│                                                      │
│  ──────────────────────────────────────────────     │
│                                                      │
│  03 FEATURES                                         │
│                                                      │
│  [UPLOAD]   [ORGANIZE]   [WEAR MORE]                │
│  Clip photo.  Sort by        Track what's           │
│  Auto-crop.   category.     in rotation.            │
│                                                      │
│  ──────────────────────────────────────────────     │
│                                                      │
│  03 CATEGORIES                                       │
│                                                      │
│  TOPS · BOTTOMS · DRESSES · OUTERWEAR ·             │
│  FOOTWEAR · ACCESSORIES · ALL                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

- Full-width sections separated by `1.5px` horizontal rules
- "03 FEATURES" / "03 CATEGORIES" — numbered section labels in `Space Mono` uppercase
- CTA button: solid `#FFE500` background, `#0A0A0A` text, uppercase, no border-radius
- Bottom: `© 2026 TAG. Built for people who actually wear their clothes.`

### Auth Pages (`/login`, `/signup`)

```
┌────────────────────┐
│      [TAG]         │  ← logo centered top
│                    │
│  ─────────────────│
│  LOG IN            │  ← section label
│  ─────────────────│
│                    │
│  EMAIL             │  ← label above input
│  ┌────────────────┐│
│  │                ││
│  └────────────────┘│
│                    │
│  PASSWORD          │
│  ┌────────────────┐│
│  │                ││
│  └────────────────┘│
│                    │
│  [SIGN IN →]       │  ← CTA
│                    │
│  ─────────────────│
│  No account?       │  ← helper text
│  [Create one →]    │
└────────────────────┘
```

- Centered card, max-width `400px`, `border: 1.5px solid`, no border-radius
- Form inputs: full-width, `1.5px border`, no border-radius, uppercase labels
- Error states: red border + error text below input

### Wardrobe Page (`/wardrobe`)

```
┌──────────────────────────────────────────────────────────┐
│  [TAG]                           [+] ADD   [AVATAR ▼]  │
├──────────────┬───────────────────────────────────────────┤
│              │  WARDROBE                    42 items     │
│  ALL (42)    │  ─────────────────────────────────────────  │
│  TOPS (12)   │  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  BOTTOMS(8)  │  │ CATEGORY │  │ CATEGORY │  │CATEGORY│ │
│  DRESSES(6)  │  │          │  │          │  │        │ │
│  OUTERWEAR(3)│  │  [IMG]   │  │  [IMG]   │  │ [IMG]  │ │
│  FOOTWEAR(5) │  │          │  │          │  │        │ │
│  ACCESSORIES │  │ COLOR    │  │ COLOR    │  │ COLOR  │ │
│  (8)         │  │ BRAND    │  │ BRAND    │  │ BRAND  │ │
│              │  └──────────┘  └──────────┘  └────────┘ │
│              │                                           │
│              │  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│              │  │ CATEGORY │  │ CATEGORY │  │CATEGORY│ │
│              │  │   ...    │  │   ...    │  │  ...   │ │
│              │  └──────────┘  └──────────┘  └────────┘ │
└──────────────┴───────────────────────────────────────────┘
```

**Desktop (>768px):** Sidebar (200px fixed) + main content area. Sidebar has category list with item counts. Grid is `auto-fill, minmax(180px, 1fr)`.

**Mobile (<768px):** No sidebar. Category filter becomes horizontal scrollable tabs at top. Grid is `1fr` (1 column) or `repeat(2, 1fr)` depending on screen width.

### Care-Tag Item Card

```
┌─────────────────────┐
│ TOPS                │  ← category label, uppercase, 11px
│                     │
│  ┌───────────────┐  │
│  │               │  │
│  │   [PHOTO]    │  │  ← item photo, object-cover
│  │               │  │
│  └───────────────┘  │
│                     │
│ LINEN SHIRT         │  ← item name, 13px
│ ─────────────────── │
│ ● BLUE  ·  ZARA     │  ← color swatch dot + brand
│ SPRING              │  ← season tag
└─────────────────────┘
```

- All borders: `1.5px solid #0A0A0A`
- Photo aspect ratio: `3:4` (portrait, like clothing on a hanger)
- Hover state: `border-color: #FFE500`, `box-shadow: 4px 4px 0 #FFE500`
- Color swatch: a `10px` filled circle in the item's color

### Add Item Modal / Sheet

Full-screen on mobile. Centered modal (max-width `600px`) on desktop. Contains:

1. **Photo upload zone** — drag & drop or click to upload. Shows preview after selection.
2. **Clipdrop processing** — while auto-crop is running, show loader + "Removing background..."
3. **Metadata form:**
   - NAME (text input, required)
   - CATEGORY (select: TOPS / BOTTOMS / DRESSES / OUTERWEAR / FOOTWEAR / ACCESSORIES)
   - COLOR (color swatch picker — 12 preset swatches + custom hex input)
   - BRAND (text input, optional)
   - SEASON (multi-select: SPRING / SUMMER / FALL / WINTER / ALL-SEASON)
4. **Save button** — "TAG IT →"

### Item Detail Sheet

Slides in from right (desktop) or bottom (mobile). Shows:
- Large photo
- All metadata (editable inline)
- Delete button (with confirmation dialog)

### Settings Page (`/settings`)

```
┌──────────────────────────────────────┐
│  ACCOUNT                             │
│  ──────────────────────────────────  │
│                                      │
│  EMAIL                               │
│  user@example.com                    │
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  [LOG OUT]                          │
│                                      │
│  ──────────────────────────────────  │
│                                      │
│  DANGER ZONE                         │
│  ──────────────────────────────────  │
│  [DELETE ACCOUNT]                    │
└──────────────────────────────────────┘
```

---

## 4. Features & Interactions

### Authentication
- **Login:** Email + password. On success → redirect to `/wardrobe`. On error → show inline error below form.
- **Signup:** Email + password + username. On success → redirect to `/wardrobe`. Email confirmation disabled (per previous setup).
- **Logout:** Clears session, redirects to `/`.

### Wardrobe Browse
- Default view: ALL items, sorted by newest first
- Category filter: clicking a sidebar/tab filters the grid. URL updates (`/wardrobe?category=tops`)
- Empty state: shows an empty care-tag illustration + "Your wardrobe is empty. Tag your first piece."
- Loading state: skeleton cards in grid layout

### Add Item
1. Click "+ ADD" → opens add-item sheet/modal
2. Drag/drop or click upload zone → select image
3. Image sent to `/api/upload` → Clipdrop API call → receives cropped image
4. Preview shows cropped image
5. Fill metadata form (name required, rest optional)
6. Submit → save to Supabase `wardrobe_items` + upload cropped image to Supabase Storage
7. On success → close modal, refetch grid, show success toast
8. On error → show error message

### Edit Item
- Click item card → opens detail sheet
- "Edit" button → fields become editable inline
- Save → PATCH to Supabase
- Cancel → revert changes

### Delete Item
- "Delete" button in detail sheet
- Confirmation dialog: "Remove [ITEM NAME] from your wardrobe? This cannot be undone."
- Confirm → DELETE from Supabase + delete from Storage
- On success → close sheet, refetch grid

### Loader Component
- **Usage:** Wraps page content during initial load and route transitions
- **Appearance:** Centered stamp animation — a care-tag icon scales down repeatedly (`scale: 1 → 0.85 → 1`), `200ms` per cycle, `#FFE500` on `#0A0A0A` background
- **Timing:** Shows immediately on navigation start, hides when data is ready

### Landing Page Interactions
- **CTA click:** Navigates to `/signup`
- **Login/Signup nav links:** Navigate to respective pages
- **"03 FEATURES" section:** Static — no scroll animations (keeps it fast and focused)
- **"03 CATEGORIES" section:** Static category list with uppercase labels

---

## 5. Component Inventory

### `<Loader />`
- **Default:** Stamp animation centered on screen, full-page overlay
- **Inline variant:** Small `24px` icon, used inside buttons during form submission
- **States:** always animating when visible, hidden when not needed

### `<Button variant="accent" />`
- **Default:** `background: #FFE500`, `color: #0A0A0A`, uppercase text, no border-radius
- **Hover:** `background: #0A0A0A`, `color: #FFE500`
- **Disabled:** `background: #E2DDD4`, `color: #6B6560`, `cursor: not-allowed`
- **Loading:** Replaced with `<Loader inline />` + "SAVING..." text

### `<Button variant="ghost" />`
- **Default:** Transparent background, `border: 1.5px solid #0A0A0A`, uppercase text
- **Hover:** `background: #0A0A0A`, `color: #F2EDE4`

### `<Button variant="destructive" />`
- **Default:** `background: #D62828`, `color: #F2EDE4`, uppercase text
- **Hover:** `background: #0A0A0A`, `color: #F2EDE4`

### `<Input />`
- **Default:** `border: 1.5px solid #0A0A0A`, `border-radius: 0`, uppercase label above
- **Focus:** `border-color: #FFE500`, `outline: 2px solid #FFE500` (offset 0)
- **Error:** `border-color: #D62828`

### `<Select />`
- **Default:** Same border treatment as Input, custom dropdown arrow
- **Options:** List styled to match Input

### `<Card />` (Item card)
- **Default:** Bordered box, category label, photo, name, color swatch + brand, season tag
- **Hover:** `border-color: #FFE500`, `box-shadow: 4px 4px 0 #FFE500`, `transform: translate(-2px, -2px)`
- **Loading (skeleton):** Animated shimmer in `#E2DDD4`, same card shape

### `<Sheet />`
- **Desktop:** Slides in from right, `480px` wide
- **Mobile:** Slides up from bottom, full width
- **Overlay:** `background: rgba(10, 10, 10, 0.4)`

### `<Dialog />`
- **Default:** Centered modal, `max-width: 480px`, same border treatment as cards
- **Overlay:** `background: rgba(10, 10, 10, 0.4)`

### `<Badge />`
- **Default:** `border: 1px solid #0A0A0A`, uppercase text, `Space Mono` 11px
- **Category badge:** `background: #0A0A0A`, `color: #F2EDE4`
- **Season badge:** `background: transparent`, `color: #0A0A0A`

### `<Toast />`
- **Success:** `border-left: 4px solid #FFE500`, "Tagged." message
- **Error:** `border-left: 4px solid #D62828`, error message
- **Position:** Bottom-right (desktop), bottom-center (mobile)

### `<Sidebar />` (Desktop wardrobe nav)
- Fixed left, `200px` wide, `border-right: 1.5px solid #0A0A0A`
- Logo at top
- Category list: uppercase, monospaced, item count in muted text
- Active category: `background: #FFE500`, `color: #0A0A0A`
- User avatar + logout at bottom

### `<TopNav />` (Mobile wardrobe nav)
- Fixed top, `border-bottom: 1.5px solid #0A0A0A`
- Logo left, "+ ADD" + avatar right
- Category tabs scroll horizontally below

---

## 6. Technical Approach

### Framework & Tooling
- **Next.js 14** App Router with TypeScript
- **Tailwind CSS v3** with shadcn/ui (initialized with brutalist overrides: `borderRadius: 0`, dark mode via `class`)
- **Framer Motion** for page transitions + card animations
- **Zustand** for UI state (modal open, active category filter)
- **TanStack Query** for server state (wardrobe items, mutations)
- **Zod** for form validation
- **Lucide React** for icons

### Database (Supabase — reuse `wardrobe-app`)

**`profiles` table:**
```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  avatar_url text,
  created_at timestamptz default now()
);
```

**`wardrobe_items` table:**
```sql
create table wardrobe_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  category text not null check (category in ('tops','bottoms','dresses','outerwear','footwear','accessories')),
  color text,
  brand text,
  season text[],
  image_url text,
  thumbnail_url text,
  created_at timestamptz default now()
);
```

**RLS Policies:**
- `profiles`: user can read/write their own row only
- `wardrobe_items`: user can read/write only items where `user_id = auth.uid()`

### Storage
- **Bucket:** `wardrobe-images` (private)
- **Path pattern:** `{user_id}/{item_id}.png`
- **Thumbnails:** Same bucket, `/thumbnails/{user_id}/{item_id}.png` (150px wide)
- **Access:** Signed URLs generated server-side on read; upload via service role key

### API Routes

| Route | Method | Description |
|---|---|---|
| `/api/upload` | POST | Receives image file → Clipdrop API → stores in Supabase Storage → returns image URL |
| `/api/items` | GET | Fetch wardrobe items (filtered by user + optional category) |
| `/api/items` | POST | Create wardrobe item |
| `/api/items/[id]` | PATCH | Update wardrobe item |
| `/api/items/[id]` | DELETE | Delete wardrobe item |
| `/api/user` | GET | Fetch current user profile |
| `/api/user` | PATCH | Update current user profile |

### Clipdrop Integration
- **Endpoint:** `POST https://clipdrop-api.co/v1/remove-background`
- **API key:** Stored in `CLIPDROP_API_KEY` env var (Vercel)
- **Flow:** Upload route receives image → sends to Clipdrop → gets PNG back → uploads to Supabase Storage → returns URL
- **Error handling:** If Clipdrop fails, return original image URL (no crop applied)

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Clipdrop
CLIPDROP_API_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=https://tag-app.vercel.app
```

### Deployment
- **Vercel** — `vercel deploy`
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `CLIPDROP_API_KEY` set in Vercel dashboard
- `SUPABASE_SERVICE_ROLE_KEY` set as server-only env var

---

## 7. Pages & File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, providers, fonts
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Brutalist design tokens + resets
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx          # Auth-required layout (sidebar/nav)
│   │   ├── wardrobe/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── upload/route.ts
│       ├── items/route.ts
│       ├── items/[id]/route.ts
│       └── user/route.ts
├── components/
│   ├── ui/                     # shadcn components (modified brutalist)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── sheet.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   ├── select.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── wardrobe/
│   │   ├── item-card.tsx
│   │   ├── item-grid.tsx
│   │   ├── item-detail-sheet.tsx
│   │   ├── add-item-sheet.tsx
│   │   └── category-filter.tsx
│   ├── layout/
│   │   ├── top-nav.tsx
│   │   ├── sidebar.tsx
│   │   └── loader.tsx
│   └── landing/
│       ├── hero.tsx
│       └── features.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── clipdrop.ts
│   └── utils/cn.ts
├── stores/
│   └── wardrobe.ts             # Zustand store
├── hooks/
│   └── use-wardrobe-items.ts   # TanStack Query hooks
└── types/
    └── index.ts
```

---

## 8. Deliverables Checklist (Phase 1)

- [ ] Next.js scaffold with shadcn/ui + brutalist overrides
- [ ] Supabase schema: `profiles` + `wardrobe_items` + RLS
- [ ] Supabase Storage bucket
- [ ] Landing page (`/`)
- [ ] Login page (`/login`)
- [ ] Signup page (`/signup`)
- [ ] Wardrobe page with category filter (`/wardrobe`)
- [ ] Item grid with care-tag cards
- [ ] Add item sheet with Clipdrop auto-crop
- [ ] Item detail sheet (view / edit)
- [ ] Delete item with confirmation
- [ ] Loader component
- [ ] Auth middleware (protect `/wardrobe`, `/settings`)
- [ ] Toast notifications
- [ ] Mobile responsive layout
- [ ] Vercel deployment
