# TAG — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A fully functional wardrobe web app with landing page, auth, wardrobe CRUD, and Clipdrop auto-crop — deployed to Vercel.

**Architecture:** Next.js 14 App Router with server components for data fetching and client components for interactivity. Supabase for auth + database + storage. Clipdrop API for background removal. shadcn/ui primitives overridden with brutalist design tokens (zero radius, 2px borders, Sour Candy palette).

**Tech Stack:** Next.js 14, TypeScript, Tailwind v3, shadcn/ui, Framer Motion, Zustand, TanStack Query, Zod, Supabase, Lucide React

**Spec:** `docs/superpowers/specs/2026-08-30-tag-wardrobe-app-design.md`

---

## Global Constraints

| Constraint | Value |
|---|---|
| Border radius | **0** everywhere |
| Border width | **2px** solid `#1A1A1A` |
| Primary accent | `#A8FF3E` (acid green) |
| Secondary accent | `#FF6B35` (tangerine) |
| Background | `#FFF8F0` (warm off-white) |
| Destructive | `#FF3366` (hot pink-red) |
| Display font | `Syne` 700 |
| Body font | `IBM Plex Mono` 400/500 |
| Labels font | `Space Mono` 400 |
| Supabase project ref | `iuugpgnleuynxzrcvtxt` |
| Existing table | `public.items` (use as-is, do NOT recreate) |
| Existing profiles table | `public.profiles` (use as-is) |
| Storage bucket | `wardrobe-images` (create if missing) |
| Clipdrop endpoint | `https://clipdrop-api.co/v1/remove-background` |

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, providers
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind + design tokens
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx          # Protected layout (sidebar + nav)
│   │   ├── wardrobe/page.tsx   # Main wardrobe grid
│   │   └── settings/page.tsx   # Account settings
│   └── api/
│       ├── upload/route.ts     # POST: upload image → Clipdrop → Supabase Storage
│       ├── items/route.ts      # GET all / POST create
│       ├── items/[id]/route.ts # PATCH / DELETE
│       └── user/route.ts       # GET / PATCH profile
├── components/
│   ├── ui/                     # shadcn components (brutalist overrides)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   ├── label.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   ├── wardrobe/
│   │   ├── item-card.tsx
│   │   ├── item-grid.tsx
│   │   ├── add-item-sheet.tsx
│   │   ├── item-detail-sheet.tsx
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
│   └── wardrobe.ts             # Zustand: activeCategory, sheetOpen, etc.
├── hooks/
│   ├── use-wardrobe-items.ts  # TanStack Query: fetch/mutate items
│   └── use-user.ts             # TanStack Query: fetch current user
└── types/
    └── index.ts                # Item, Category, Season types
```

---

## Task 1: Scaffold Next.js + shadcn/ui + Brutalist Overrides

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `src/lib/utils/cn.ts`
- Create: `.env.local`, `.env.example`
- Create: `public/favicon.svg`
- Modify: `components.json` (shadcn config)

**Notes:**
- Initialize with `npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-git`
- After scaffolding, run `npx shadcn@latest init -d` to add shadcn/ui
- Run `npx shadcn@latest add button input card badge select sheet dialog label skeleton toast tabs separator avatar dropdown-menu`
- Brutalist overrides applied AFTER shadcn init — modify `globals.css` design tokens, override button/input/card border-radius to 0, set border-width to 2px
- Fonts: `Syne` + `IBM Plex Mono` + `Space Mono` via `next/font/google`
- `components.json` Tailwind baseColor: `neutral` (neutral gray base, then override with custom CSS vars)

**Steps:**
- [ ] **Step 1: Scaffold Next.js 14**
  Run: `cd "C:\Users\hiiam\OneDrive\Desktop\Python\Dress Up" && npx create-next-app@latest . -y --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
  Note: `--no-git` is not needed since `.git` already exists. Use `-y` for non-interactive mode.
  Expected: Next.js project created, `package.json`, `tsconfig.json`, etc. exist
  
- [ ] **Step 2: Install additional deps**
  Run: `npm install @supabase/ssr @supabase/supabase-js @tanstack/react-query zustand framer-motion zod react-hook-form @hookform/resolvers lucide-react`
  Expected: packages added to package.json
  
- [ ] **Step 3: Initialize shadcn/ui**
  Run: `npx shadcn@latest init -d`
  - Use `neutral` as base color
  - CSS variables: yes
  - Path aliases: `@/*`
  
- [ ] **Step 4: Add shadcn components**
  Run: `npx shadcn@latest add button input card badge select sheet dialog label skeleton toast tabs separator avatar dropdown-menu table`
  Expected: All components in `src/components/ui/`
  
- [ ] **Step 5: Configure fonts in `src/app/layout.tsx`**
  - `Syne` (weight 700) for display/headings
  - `IBM Plex Mono` (400, 500) for body
  - `Space Mono` (400) for labels/data
  - Apply `variable` class to `<html>` tag
  
- [ ] **Step 6: Apply brutalist overrides to `src/app/globals.css`**
  - Override shadcn CSS variables with Sour Candy palette
  - Set `--radius: 0` in CSS
  - Add custom Tailwind colors: `acid`, `tangerine`, `cream`
  
- [ ] **Step 7: Override shadcn button/input/card border-radius**
  - Edit `src/components/ui/button.tsx`: remove `rounded-lg` / add `rounded-none` to all variants
  - Edit `src/components/ui/input.tsx`: add `rounded-none`
  - Edit `src/components/ui/card.tsx`: add `rounded-none`
  - Edit `src/components/ui/badge.tsx`: add `rounded-none`
  - Edit `src/components/ui/sheet.tsx`: add `rounded-none` to sheet content
  - Edit `src/components/ui/dialog.tsx`: add `rounded-none`
  
- [ ] **Step 8: Create `src/lib/utils/cn.ts`**
  ```typescript
  import { type ClassValue, clsx } from "clsx"
  import { twMerge } from "tailwind-merge"
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }
  ```

- [ ] **Step 9: Create SVG favicon**
  - Clothing tag shape, `#A8FF3E` on `#1A1A1A` background
  
- [ ] **Step 10: Create `.env.local` and `.env.example`**
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://iuugpgnleuynxzrcvtxt.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
  CLIPDROP_API_KEY=<your-clipdrop-key>
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```
  
- [ ] **Step 11: Verify app boots**
  Run: `npm run dev` → open http://localhost:3000
  Expected: Next.js app loads with brutalist CSS applied (no rounded corners, custom fonts)
  
- [ ] **Step 12: Commit**
  ```bash
  git add -A && git commit -m "chore: scaffold Next.js 14 + shadcn/ui + brutalist overrides"
  ```

---

## Task 2: Supabase Client + Server + Middleware + RLS Policies

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `src/middleware.ts` (Next.js)
- Create: `src/types/index.ts`
- Modify: `.env.local` (fill in real keys — prompt user)

**Notes:**
- `client.ts`: browser Supabase client using `@supabase/ssr` createBrowserClient
- `server.ts`: server components client using `@supabase/ssr` createServerClient with cookie adapter
- `middleware.ts`: handles auth session refresh and route protection
- `middleware.ts` (root): protects `/wardrobe`, `/settings` — redirects unauthenticated to `/login`, authenticated on `/` to `/wardrobe`
- Use existing `public.items` and `public.profiles` tables (do NOT recreate)
- Add RLS policies if not present: items table needs user can only read/write their own items

**Steps:**
- [ ] **Step 1: Create `src/types/index.ts`**
  ```typescript
  export type Category = 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'footwear' | 'accessories'
  export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all-season'
  
  export interface WardrobeItem {
    id: string
    user_id: string
    name: string
    category: Category
    color: string | null
    color_hex: string | null
    pattern: string | null
    season: Season[]
    occasion: string[]
    image_url: string
    thumbnail_url: string | null
    metadata: Record<string, unknown>
    created_at: string
    updated_at: string
  }
  
  export interface Profile {
    id: string
    full_name: string | null
    avatar_url: string | null
    created_at: string
    updated_at: string
  }
  ```

- [ ] **Step 2: Create `src/lib/supabase/client.ts`**
  ```typescript
  import { createBrowserClient } from '@supabase/ssr'
  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  ```

- [ ] **Step 3: Create `src/lib/supabase/server.ts`**
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'
  export async function createClient() {
    const cookieStore = await cookies()
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )
  }
  ```

- [ ] **Step 4: Create `src/lib/supabase/middleware.ts`**
  ```typescript
  import { createServerClient } from '@supabase/ssr'
  import { NextResponse, type NextRequest } from 'next/server'
  export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: { user } } = await supabase.auth.getUser()
    const { pathname } = request.nextUrl
    if (!user && pathname.startsWith('/wardrobe')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (user && (pathname === '/login' || pathname === '/signup' || pathname === '/')) {
      return NextResponse.redirect(new URL('/wardrobe', request.url))
    }
    return supabaseResponse
  }
  ```

- [ ] **Step 5: Create `src/middleware.ts`**
  ```typescript
  import { type NextRequest } from 'next/server'
  import { updateSession } from '@/lib/supabase/middleware'
  export async function middleware(request: NextRequest) {
    return await updateSession(request)
  }
  export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
  }
  ```

- [ ] **Step 6: Verify RLS policies on `items` table**
  Run via MCP `execute_sql`:
  ```sql
  SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
  FROM pg_policies WHERE tablename = 'items';
  ```
  Expected: SELECT/INSERT/UPDATE/DELETE policies exist with `user_id = auth.uid()` predicate
  If missing policies: create them via `execute_sql`
  
- [ ] **Step 7: Create storage bucket**
  Run via MCP `execute_sql`:
  ```sql
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('wardrobe-images', 'wardrobe-images', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO NOTHING;
  ```
  Then add storage policies:
  ```sql
  CREATE POLICY "users_upload_own_images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'wardrobe-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  CREATE POLICY "users_read_own_images" ON storage.objects
    FOR SELECT USING (bucket_id = 'wardrobe-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  CREATE POLICY "users_delete_own_images" ON storage.objects
    FOR DELETE USING (bucket_id = 'wardrobe-images' AND auth.uid()::text = (storage.foldername(name))[1]);
  ```

- [ ] **Step 8: Prompt for env vars**
  Ask user for their Supabase anon key and Clipdrop API key to fill `.env.local`

- [ ] **Step 9: Commit**
  ```bash
  git add -A && git commit -m "feat: add Supabase client, server, middleware, RLS policies, storage bucket"
  ```

---

## Task 3: Auth Pages (Login + Signup)

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/signup/page.tsx`
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/components/auth/auth-form.tsx` (shared form component)

**Notes:**
- Use shadcn `Card` + `Input` + `Button` with brutalist overrides
- Login: email + password fields, "SIGN IN" CTA
- Signup: email + password + full_name fields, "CREATE ACCOUNT" CTA
- Form validation with Zod + react-hook-form
- On success → redirect to `/wardrobe` via Next.js router
- On error → inline error message below form (NOT toast)
- Centered card, max-width 420px, no border-radius, 2px border
- Shared `AuthForm` component handles both with a `mode` prop: `'login' | 'signup'`

**Steps:**
- [ ] **Step 1: Create `src/components/auth/auth-form.tsx`**
  - Shared component with `mode: 'login' | 'signup'`
  - Zod schema: email (valid email), password (min 6), full_name (min 2, only on signup)
  - react-hook-form with @hookform/resolvers
  - On submit: `supabase.auth.signInWithPassword` or `supabase.auth.signUp`
  - Loading state on button during auth
  - Error state: show message from Supabase error
  - Success: redirect to `/wardrobe`

- [ ] **Step 2: Create `src/app/(auth)/layout.tsx`**
  - Simple layout, no sidebar/nav
  - Centered content

- [ ] **Step 3: Create `src/app/(auth)/login/page.tsx`**
  - Page with `<AuthForm mode="login" />`
  - Link to signup below form

- [ ] **Step 4: Create `src/app/(auth)/signup/page.tsx`**
  - Page with `<AuthForm mode="signup" />`
  - Link to login below form

- [ ] **Step 5: Test login/signup flow**
  Run: `npm run dev` → open http://localhost:3000/login
  Expected: Form renders with brutalist styling. Test login with existing user.

- [ ] **Step 6: Commit**
  ```bash
  git add -A && git commit -m "feat: add login and signup pages"
  ```

---

## Task 4: Landing Page

**Files:**
- Create: `src/components/landing/hero.tsx`
- Create: `src/components/landing/features.tsx`
- Modify: `src/app/page.tsx`

**Notes:**
- Landing page is the root `/` — must be public (middleware already handles redirect for authenticated users to `/wardrobe`)
- Design: full-width sections, 2px horizontal rules, uppercase section labels
- Hero: bold display text, tagline, CTA button to `/signup`
- Features section: 3 feature blocks (UPLOAD, ORGANIZE, WEAR MORE)
- Categories section: list of categories in uppercase
- Footer: copyright + tagline
- NO images — use CSS shapes, borders, and typography
- The `<Loader />` component is NOT used on landing (it's for app pages)

**Steps:**
- [ ] **Step 1: Create `src/components/landing/hero.tsx`**
  - Large "TAG" logo wordmark in `Syne` 700
  - Tagline text: "YOUR WARDROBE. NO EXCUSES." + sub-text
  - "START FREE →" button (accent variant) linking to `/signup`
  - Decorative CSS elements: a few borders, geometric lines (no images)
  - Responsive: stacked on mobile, side-by-side hint on desktop

- [ ] **Step 2: Create `src/components/landing/features.tsx`**
  - "03 FEATURES" section label (uppercase, muted)
  - 3-column grid (1 column on mobile)
  - Feature blocks: UPLOAD (camera icon), ORGANIZE (filter icon), WEAR MORE (heart icon)
  - Each block: uppercase label, short description

- [ ] **Step 3: Create `src/components/landing/categories.tsx`**
  - "03 CATEGORIES" section label
  - List: TOPS · BOTTOMS · DRESSES · OUTERWEAR · FOOTWEAR · ACCESSORIES
  - Dotted separator between items

- [ ] **Step 4: Modify `src/app/page.tsx`**
  ```typescript
  import { Hero } from '@/components/landing/hero'
  import { Features } from '@/components/landing/features'
  import { Categories } from '@/components/landing/categories'
  export default function HomePage() {
    return (
      <main>
        <Hero />
        <Features />
        <Categories />
      </main>
    )
  }
  ```

- [ ] **Step 5: Test landing page**
  Open http://localhost:3000 — verify brutalist styling, no rounded corners, fonts loading

- [ ] **Step 6: Commit**
  ```bash
  git add -A && git commit -m "feat: add landing page with hero, features, categories"
  ```

---

## Task 5: Loader + Zustand Store + TanStack Query Hooks

**Files:**
- Create: `src/components/layout/loader.tsx`
- Create: `src/stores/wardrobe.ts`
- Create: `src/hooks/use-wardrobe-items.ts`
- Create: `src/hooks/use-user.ts`
- Create: `src/components/providers.tsx`

**Notes:**
- `Loader`: stamp animation — care-tag SVG icon scales down repeatedly (`scale: 1 → 0.85 → 1`), 300ms cycle, acid green on charcoal. Use CSS keyframes, not Framer Motion (simpler, no extra dep). Two variants: `full` (overlay, centered) and `inline` (small, 24px).
- Zustand store: `activeCategory`, `addItemSheetOpen`, `detailItemId`, `detailSheetOpen`, toast state
- `Providers` component wraps the app with `QueryClientProvider` and `ZustandStoreProvider`
- TanStack Query hooks: `useWardrobeItems(category?)`, `useCreateItem()`, `useUpdateItem()`, `useDeleteItem()`

**Steps:**
- [ ] **Step 1: Create `src/stores/wardrobe.ts`**
  ```typescript
  import { create } from 'zustand'
  import type { Category } from '@/types'
  interface WardrobeStore {
    activeCategory: Category | 'all'
    setActiveCategory: (cat: Category | 'all') => void
    addItemSheetOpen: boolean
    setAddItemSheetOpen: (open: boolean) => void
    detailItemId: string | null
    setDetailItemId: (id: string | null) => void
    detailSheetOpen: boolean
    setDetailSheetOpen: (open: boolean) => void
    toasts: Array<{ id: string; message: string; type: 'success' | 'error' }>
    addToast: (message: string, type: 'success' | 'error') => void
    removeToast: (id: string) => void
  }
  export const useWardrobeStore = create<WardrobeStore>((set) => ({
    activeCategory: 'all',
    setActiveCategory: (cat) => set({ activeCategory: cat }),
    addItemSheetOpen: false,
    setAddItemSheetOpen: (open) => set({ addItemSheetOpen: open }),
    detailItemId: null,
    setDetailItemId: (id) => set({ detailItemId: id }),
    detailSheetOpen: false,
    setDetailSheetOpen: (open) => set({ detailSheetOpen: open }),
    toasts: [],
    addToast: (message, type) => set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, type }]
    })),
    removeToast: (id) => set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    })),
  }))
  ```

- [ ] **Step 2: Create `src/hooks/use-wardrobe-items.ts`**
  - `useWardrobeItems(category?)` → `useQuery` fetching from `/api/items?category=...`
  - `useCreateItem()` → `useMutation` POST to `/api/items`
  - `useUpdateItem(id)` → `useMutation` PATCH to `/api/items/[id]`
  - `useDeleteItem(id)` → `useMutation` DELETE `/api/items/[id]`
  - All invalidate `['items']` query on success

- [ ] **Step 3: Create `src/hooks/use-user.ts`**
  - `useUser()` → `useQuery` fetching from `/api/user`
  - Returns user profile + auth session

- [ ] **Step 4: Create `src/components/providers.tsx`**
  ```typescript
  'use client'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  import { useState } from 'react'
  export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
      defaultOptions: { queries: { staleTime: 60 * 1000 } }
    }))
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
  ```

- [ ] **Step 5: Create `src/components/layout/loader.tsx`**
  ```typescript
  // src/components/layout/loader.tsx
  // Full-page overlay variant: centered, 100vh
  // Inline variant: 24px, used in buttons
  // CSS keyframe: tag-stamp — scale 1 → 0.85 → 1
  // Colors: acid green (#A8FF3E) on charcoal (#1A1A1A)
  ```

- [ ] **Step 6: Wrap app in Providers**
  - Edit `src/app/layout.tsx` to import and use `<Providers>`

- [ ] **Step 7: Test loader renders**
  Navigate between pages — loader should show during transitions

- [ ] **Step 8: Commit**
  ```bash
  git add -A && git commit -m "feat: add loader, Zustand store, TanStack Query hooks, providers"
  ```

---

## Task 6: API Routes (Upload + Items CRUD + User)

**Files:**
- Create: `src/app/api/upload/route.ts`
- Create: `src/app/api/items/route.ts`
- Create: `src/app/api/items/[id]/route.ts`
- Create: `src/app/api/user/route.ts`
- Create: `src/lib/clipdrop.ts`

**Notes:**
- All API routes are server-side (no client Supabase key exposure)
- Upload: receives image → sends to Clipdrop → uploads to Supabase Storage → returns URL
- Items: standard CRUD with Supabase service role for storage operations
- User: profile read/write
- Zod validation on all inputs

**Steps:**
- [ ] **Step 1: Create `src/lib/clipdrop.ts`**
  ```typescript
  export async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
    const response = await fetch('https://clipdrop-api.co/v1/remove-background', {
      method: 'POST',
      headers: { 'x-api-key': process.env.CLIPDROP_API_KEY! },
      body: imageBuffer,
    })
    if (!response.ok) throw new Error('Clipdrop failed')
    return Buffer.from(await response.arrayBuffer())
  }
  ```

- [ ] **Step 2: Create `src/app/api/upload/route.ts`**
  - POST handler
  - Parse `multipart/form-data` image
  - Send to Clipdrop via `removeBackground()`
  - Upload to Supabase Storage: `wardrobe-images/{userId}/{uuid}.png`
  - Return `{ imageUrl: string, thumbnailUrl: string }`

- [ ] **Step 3: Create `src/app/api/items/route.ts`**
  - GET: fetch all items for current user (from `auth.uid()` from session), optional `?category=` filter
  - POST: create new item, validates with Zod, inserts into `items` table

- [ ] **Step 4: Create `src/app/api/items/[id]/route.ts`**
  - PATCH: update item (owner check via RLS)
  - DELETE: delete item + delete from Supabase Storage

- [ ] **Step 5: Create `src/app/api/user/route.ts`**
  - GET: fetch profile from `profiles` table
  - PATCH: update `full_name` / `avatar_url`

- [ ] **Step 6: Test API routes**
  Run: `npm run dev` and test with curl or Postman:
  - POST `/api/upload` with image → should return URL
  - GET `/api/items` → should return items array

- [ ] **Step 7: Commit**
  ```bash
  git add -A && git commit -m "feat: add API routes for upload, items CRUD, user profile"
  ```

---

## Task 7: Protected Layout + Sidebar + TopNav

**Files:**
- Create: `src/app/(main)/layout.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/top-nav.tsx`

**Notes:**
- `(main)` route group is protected by middleware — unauthenticated redirects to `/login`
- Desktop: fixed sidebar (200px) + main content area
- Mobile: top nav + horizontal category tabs below nav
- User avatar + logout in sidebar footer (desktop) and nav (mobile)
- Sign out: `supabase.auth.signOut()` → redirect to `/`

**Steps:**
- [ ] **Step 1: Create `src/components/layout/sidebar.tsx`**
  - Logo at top: "TAG" wordmark
  - Category list: ALL, TOPS, BOTTOMS, DRESSES, OUTERWEAR, FOOTWEAR, ACCESSORIES
  - Each item: uppercase label + item count (fetched, shown in muted text)
  - Active state: acid green background
  - User avatar + "LOG OUT" at bottom
  - Border-right: 2px solid #1A1A1A

- [ ] **Step 2: Create `src/components/layout/top-nav.tsx`**
  - Fixed top bar, border-bottom: 2px solid #1A1A1A
  - Logo left, "+ ADD" button + avatar right
  - Category tabs scroll horizontally below nav (mobile only)

- [ ] **Step 3: Create `src/app/(main)/layout.tsx`**
  - Fetch user session server-side
  - If no session, redirect to `/login`
  - Render: sidebar (desktop) + main content
  - Mobile: top nav + tab bar only

- [ ] **Step 4: Test protected routes**
  Open http://localhost:3000/wardrobe while logged out → should redirect to /login
  Log in → should land on /wardrobe with sidebar

- [ ] **Step 5: Commit**
  ```bash
  git add -A && git commit -m "feat: add protected layout, sidebar, top-nav"
  ```

---

## Task 8: Wardrobe Page + Item Grid + Item Card

**Files:**
- Create: `src/app/(main)/wardrobe/page.tsx`
- Create: `src/components/wardrobe/item-card.tsx`
- Create: `src/components/wardrobe/item-grid.tsx`

**Notes:**
- Wardrobe page fetches items via `useWardrobeItems(activeCategory)`
- Grid: `auto-fill, minmax(180px, 1fr)` on desktop; `repeat(2, 1fr)` on mobile
- Item cards: care-tag design per spec — category label top, photo, name, color swatch + brand
- Color swatch: 10px circle filled with item's `color_hex`
- Skeleton loading state: shimmer cards in grid
- Empty state: care-tag illustration + "Your wardrobe is empty. Tag your first piece." + CTA button
- Click card → opens item detail sheet

**Steps:**
- [ ] **Step 1: Create `src/components/wardrobe/item-card.tsx`**
  - Care-tag card: category label (uppercase, 11px), photo (3:4 aspect), name, color swatch + brand, season badge
  - 2px border, no radius, hover: border-color → #A8FF3E, box-shadow: 4px 4px 0 #A8FF3E
  - Click handler: opens detail sheet via store
  - Skeleton variant for loading state

- [ ] **Step 2: Create `src/components/wardrobe/item-grid.tsx`**
  - Renders list of `ItemCard` components
  - Handles empty state
  - Handles loading state (skeleton cards)
  - Responsive grid

- [ ] **Step 3: Create `src/app/(main)/wardrobe/page.tsx`**
  - Server component that passes session to client
  - Client component uses `useWardrobeItems(activeCategory)`
  - Top: "WARDROBE" heading + item count
  - Grid below

- [ ] **Step 4: Connect category filter to sidebar/tabs**
  - Clicking sidebar item or tab updates `activeCategory` in Zustand store
  - URL updates: `?category=tops` (for shareability)

- [ ] **Step 5: Test wardrobe page**
  Open http://localhost:3000/wardrobe — should show grid or empty state

- [ ] **Step 6: Commit**
  ```bash
  git add -A && git commit -m "feat: add wardrobe page with item grid and care-tag cards"
  ```

---

## Task 9: Add Item Sheet + Upload Flow

**Files:**
- Create: `src/components/wardrobe/add-item-sheet.tsx`
- Modify: `src/components/layout/sidebar.tsx` (connect "+ ADD" button)
- Modify: `src/components/layout/top-nav.tsx` (connect "+ ADD" button)

**Notes:**
- Opens via Zustand `addItemSheetOpen`
- Step 1: Upload zone — drag/drop or click, accepts image files
- Step 2: Clipdrop processing — shows loader "Removing background..." while API call runs
- Step 3: Preview cropped image
- Step 4: Metadata form — name (required), category (select), color (color picker + preset swatches), brand (optional), season (multi-select)
- Submit → POST to `/api/items` → close sheet → show success toast
- Form validation with Zod

**Steps:**
- [ ] **Step 1: Create `src/components/wardrobe/add-item-sheet.tsx`**
  - Use shadcn `Sheet` component
  - Photo upload zone with drag/drop (use native `<input type="file">`)
  - Clipdrop call via `/api/upload` route
  - Zod form with react-hook-form
  - Categories: TOPS, BOTTOMS, DRESSES, OUTERWEAR, FOOTWEAR, ACCESSORIES
  - Color: 12 preset swatches + custom hex input
  - Season: SPRING, SUMMER, FALL, WINTER, ALL-SEASON (multi-select, rendered as toggle buttons)
  - "TAG IT →" submit button

- [ ] **Step 2: Connect "+ ADD" button**
  - Sidebar (desktop) and TopNav (mobile) both have "+ ADD" button
  - On click: `setAddItemSheetOpen(true)`

- [ ] **Step 3: Test add item flow**
  Open wardrobe → click "+ ADD" → upload photo → fill form → submit → item appears in grid

- [ ] **Step 4: Commit**
  ```bash
  git add -A && git commit -m "feat: add item creation sheet with Clipdrop auto-crop"
  ```

---

## Task 10: Item Detail Sheet (View / Edit / Delete)

**Files:**
- Create: `src/components/wardrobe/item-detail-sheet.tsx`
- Modify: `src/components/wardrobe/item-card.tsx` (connect click)

**Notes:**
- Opens via Zustand `detailItemId` + `detailSheetOpen`
- View mode: shows all item data (large photo, all metadata)
- Edit mode: fields become editable inline, "SAVE CHANGES" button
- Delete: "DELETE" button → opens AlertDialog confirmation → DELETE on confirm
- On delete success: close sheet, remove from grid, show toast

**Steps:**
- [ ] **Step 1: Create `src/components/wardrobe/item-detail-sheet.tsx`**
  - Use shadcn `Sheet`
  - Fetch single item by `detailItemId`
  - View/edit toggle state
  - Edit form: same fields as add form (Zod, react-hook-form)
  - Save: PATCH `/api/items/[id]`
  - Delete: DELETE `/api/items/[id]` with AlertDialog confirmation

- [ ] **Step 2: Connect item card click**
  - `ItemCard` onClick: `setDetailItemId(item.id)` + `setDetailSheetOpen(true)`

- [ ] **Step 3: Test detail sheet**
  Click item card → sheet opens → view/edit/delete all work

- [ ] **Step 4: Commit**
  ```bash
  git add -A && git commit -m "feat: add item detail sheet with view/edit/delete"
  ```

---

## Task 11: Toast Notifications + Settings Page

**Files:**
- Create: `src/components/ui/toast.tsx` + `use-toast.ts` + `toaster.tsx` (shadcn toast setup)
- Create: `src/app/(main)/settings/page.tsx`
- Modify: `src/app/(main)/layout.tsx` (add Toaster)

**Notes:**
- Use shadcn toast (already added in Task 1) — configure to use custom brutalist styling
- Toasts: success ("Tagged." in acid green), error (pink-red)
- Settings page: shows user email + full_name, logout button, delete account (danger zone)

**Steps:**
- [ ] **Step 1: Set up shadcn toast properly**
  - Run: `npx shadcn@latest add toast` (if not already done)
  - Configure `src/app/layout.tsx` to use `Toaster`
  - Override toast styling: no border-radius, 2px left border, custom colors

- [ ] **Step 2: Create `src/app/(main)/settings/page.tsx`**
  - Show user email (from session)
  - Full name (editable, PATCH to `/api/user`)
  - "LOG OUT" button
  - "DELETE ACCOUNT" in danger zone (with confirmation)

- [ ] **Step 3: Add Toaster to main layout**
  - `src/app/(main)/layout.tsx` → render `<Toaster />` at the bottom

- [ ] **Step 4: Test toasts**
  Add an item → success toast should appear. Trigger an error → error toast should appear.

- [ ] **Step 5: Commit**
  ```bash
  git add -A && git commit -m "feat: add toast notifications and settings page"
  ```

---

## Task 12: Deploy to Vercel

**Files:**
- Create: `vercel.json` (if needed)
- Modify: `.env.local` → ensure all vars are in `.env.example`

**Notes:**
- Run `vercel` in the project directory
- Set environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `CLIPDROP_API_KEY`
  - `NEXT_PUBLIC_APP_URL`

**Steps:**
- [ ] **Step 1: Push code to GitHub**
  ```bash
  git remote add origin <github-url>
  git push -u origin main
  ```

- [ ] **Step 2: Deploy via Vercel CLI or GitHub integration**
  Run: `vercel` in project directory, or connect GitHub repo in Vercel dashboard

- [ ] **Step 3: Set environment variables in Vercel dashboard**
  Add all 5 env vars listed above

- [ ] **Step 4: Verify deployed app**
  Open Vercel deployment URL → landing page → signup → wardrobe

- [ ] **Step 5: Final commit**
  ```bash
  git add -A && git commit -m "chore: ready for Vercel deployment"
  ```

---

## Spec Coverage Checklist

| Spec Requirement | Task |
|---|---|
| Landing page | Task 4 |
| Login + Signup | Task 3 |
| Auth middleware (protect routes) | Task 2 |
| Wardrobe grid | Task 8 |
| Care-tag item cards | Task 8 |
| Category filter | Task 7 + Task 8 |
| Add item (photo + Clipdrop) | Task 9 |
| Item detail (view/edit/delete) | Task 10 |
| Loader component | Task 5 |
| Toast notifications | Task 11 |
| Mobile responsive | All tasks (built in) |
| Vercel deployment | Task 12 |
| Sour Candy palette | Task 1 |
| Brutalist design (zero radius, 2px borders) | Task 1 |
| Syne + IBM Plex Mono + Space Mono | Task 1 |

---

## Type Consistency Check

| Type | Defined in | Used in |
|---|---|---|
| `Category` | `types/index.ts` | `stores/wardrobe.ts`, `hooks/use-wardrobe-items.ts`, `add-item-sheet.tsx`, `item-detail-sheet.tsx`, `sidebar.tsx` |
| `WardrobeItem` | `types/index.ts` | All wardrobe components, API routes |
| `Profile` | `types/index.ts` | `use-user.ts`, settings page |
| `createClient()` | `lib/supabase/client.ts` | All client-side Supabase usage |
| `createClient()` (async) | `lib/supabase/server.ts` | Server components, API routes |
| `useWardrobeStore` | `stores/wardrobe.ts` | All wardrobe UI components |
