# UI / UX System

## Design Principles

1. **Image-first** — clothing is visual; the UI should celebrate it
2. **Calm and minimal** — no busy dashboards, no dense data tables
3. **Mobile-first** — designed for phones, enhanced for desktop
4. **Generous whitespace** — give the wardrobe room to breathe
5. **Consistent system** — every component uses the same tokens

## Visual Language

- **Type**: Inter (UI), with a tighter display weight for headings
- **Color**: Near-neutral palette. One accent. Light + dark mode.
- **Spacing**: 4px base scale (4, 8, 12, 16, 24, 32, 48, 64, 96)
- **Radius**: 8px standard, 16px for cards, 999px for pills
- **Shadows**: subtle, layered (Tailwind defaults + a custom "elevated" token)
- **Motion**: 150ms ease-out for state changes; 250ms for layout

## Component Library

Built on **shadcn/ui** (Radix primitives + Tailwind). We own the code; we can modify any component.

- Button (primary, secondary, ghost, destructive)
- Input, Textarea, Select, Combobox, DatePicker
- Dialog, Sheet, Popover, Tooltip
- Tabs, Accordion, Collapsible
- Card, Badge, Avatar
- Image (with built-in signed-URL fetching + skeleton)
- UploadDropzone (with progress, validation, retry)
- EmptyState
- Toast (Sonner)
- DataTable (TanStack Table; for admin-style views, not primary UX)

Every component is in `components/ui/`. Page-specific composites live in `components/<feature>/`.

## Navigation

```
Public
  /                     Landing
  /login                Sign in
  /register             Sign up
  /forgot-password      Request reset
  /reset-password       With token
  /about, /pricing      Marketing

Authenticated
  /dashboard            Welcome + recent activity
  /wardrobe             All clothing items
  /wardrobe/new         Add a clothing item
  /wardrobe/[id]        Item detail
  /outfits              All outfits
  /outfits/new          Create outfit
  /outfits/[id]         Outfit detail
  /try-on               Try-on profiles + history
  /ai-stylist           AI stylist (disabled in MVP)
  /connections          Friends (placeholder in MVP)
  /settings             Profile, security, danger zone
```

Bottom-bar navigation on mobile, sidebar on desktop. The current section is highlighted.

## Key Screens (MVP)

### Landing
- Hero with a single product image / illustration
- One-line value prop
- "Get started" CTA → /register
- "Sign in" link for returning users

### Register
- Email, username, password (with strength meter)
- "By signing up, you agree..." footer
- Link to login

### Wardrobe (grid)
- Top bar: search input, filter chips (category, season, color), sort dropdown
- Responsive grid: 2 cols mobile, 3 tablet, 4–6 desktop
- Each card: primary image, name, category chip, favorite heart
- Tap a card → item detail
- Floating "+" button → add new item
- Empty state: illustration + "Add your first piece" CTA

### Add Clothing
- Step 1: drop or take a photo
- Step 2: confirm/upload (with progress)
- Step 3: form with smart defaults (most fields optional, can be filled later)
- AI suggestions show inline as editable chips (stub: "AI suggestions will appear here once enabled")
- Save → returns to wardrobe

### Outfit Detail
- Large visual layout: top, bottom, outerwear, footwear, accessories slots
- Tap a slot to choose a clothing item (modal with search)
- Notes field, favorite toggle, tags
- Save / delete actions

### Try-On
- Profile selector (or "create new profile" CTA)
- Garment picker
- Generate button (disabled with tooltip if AI not configured)
- History grid below

## Accessibility

- All interactive elements have visible focus rings (2px, accent color)
- Color contrast meets WCAG AA (4.5:1 for text)
- Images have meaningful `alt` (user-supplied or auto-generated from name)
- Forms have associated labels; errors are announced
- Modals trap focus and restore it on close
- Keyboard nav: Tab/Shift+Tab through everything; Esc closes dialogs
- Skip-to-content link at the top of every page
- Reduced motion: respects `prefers-reduced-motion`

## Responsive Breakpoints

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

Mobile is the primary target. We use Tailwind's mobile-first classes.

## Performance Targets

- LCP < 2.5s on a wardrobe page with 50 items
- INP < 200ms
- CLS < 0.1
- Initial JS payload < 200 KB gzipped (Next.js App Router is well within this)
- Images: lazy-loaded below the fold; explicit `width`/`height` to prevent CLS

## State Management

- **Server state**: TanStack Query (or Next.js `cache`/RSC) for what comes from the API
- **Client state**: Zustand for the rare cases we need it (UI state, multi-step forms)
- **Forms**: react-hook-form + Zod resolver (same Zod schemas as the server)
- **No Redux** — not needed

## Why these choices

| Choice | Why | Alternatives considered |
|---|---|---|
| shadcn/ui | Own the code; Radix handles a11y | MUI (heavier), Chakra (similar but less control) |
| Tailwind | Speed + consistency | CSS Modules (more files), Emotion (runtime cost) |
| TanStack Query | De facto standard for server state in React | SWR (fine, less featureful) |
| Zustand | Tiny, no boilerplate | Jotai (atom model, fine), Redux (overkill) |
| Mobile-first | Most usage will be mobile; desktop is enhanced | Desktop-first (less common today) |
