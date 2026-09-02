# TAG Landing Page Redesign Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a visually stunning, fashion-editorial inspired landing page that communicates premium value and conveys the TAG wardrobe organization concept through scroll-driven interactions, cinematic animations, and bold typography.

**Architecture:** Complete redesign of the landing page using a 5-section scroll narrative: Hero with shadergradient background and 3D garment tag, Manifesto section with oversized serif typography, How It Works scroll-pinned feature explanation, Categories horizontal scroll gallery, and CTA/Footer. Uses framer-motion for all animations, @shadergradient/react for background gradients, and @react-three/fiber for the 3D garment tag in the hero.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v3, framer-motion, @shadergradient/react, @react-three/fiber, three.js

**Spec:** This document

## Global Constraints

- Visual direction: Full editorial / fashion-mag (break from brutalism, serif display type, large hero imagery, full-bleed sections, smooth fades)
- Loader: Cinematic framer-motion only (no r3f dependency at boot)
- 3D scope: Only in a couple hero sections (Hero + one later section)
- Copy: Bold fashion editorial tone
- Section flow: 1 / Hero (Recommended) = 5 sections
- Must use installed dependencies: @react-three/fiber, three, @shadergradient/react, framer-motion
- Do not use: liquid-logo, liquidglass (not available on npm)
- Keep brutalist identity in app shell (sidebar, buttons, cards) - landing page is magazine cover, app is garment tag
- No deployment - run locally only per user instruction

---

## 1. HERO SECTION

### Purpose
Create a cinematic opening that establishes TAG as a premium wardrobe organization tool through motion, typography, and a floating 3D garment tag.

### Components & Implementation
- **Loader**: Full-screen cream background with "TAG" in serif (Syne 700) fading in letter-by-letter with staggered delay (~1.8s total), then dissolving via clipPath reveal into hero content
- **Background**: `<ShaderGradient>` component showing slow-moving desaturated cream/tangerine gradient wash filling viewport
- **3D Element**: Single garment tag floating slowly, rotating ~15°, casting soft shadow using @react-three/fiber
- **Typography**: 
  - Headline: Serif (Syne 700), massive, split across lines with staggered word reveal on scroll-in
  - Copy: "A wardrobe, in order." (headline) + "Tag every piece. Know what you own. Wear more of it." (sub-line)
- **CTA Buttons**: 
  - Primary: "START FREE →" (acid green #A8FF3E background)
  - Secondary: "LOG IN" (ghost style with black border #1A1A1A)

### Files to Modify/Create
- Create: `src/components/landing/loader.tsx` (cinematic framer-motion loader)
- Modify: `src/components/landing/hero.tsx` (complete rewrite with shadergradient bg + 3D tag + new loader integration)
- Modify: `src/app/globals.css` (add Syne font import and new utilities)

### Data Flow
- No data fetching - all static content and animations
- Loader state managed locally with framer-motion useAnimation hooks

### Error Handling
- Graceful fallback: if shadergradient fails, use solid cream background
- If r3f fails, render 2D SVG tag as fallback

### Testing
- Visual inspection of loader animation sequence
- Verify 3D tag renders and responds to scroll
- Confirm CTA buttons navigate to correct routes
- Test on mobile for touch-friendly hit areas

---

## 2. MANIFESTO SECTION

### Purpose
Deliver a bold, memorable statement that resonates with the target audience's wardrobe struggles.

### Components & Implementation
- **Typography**: Oversized serif (Syne 700) at ~12vw spanning full width
- **Copy**: "You own more than you wear."
- **Animation**: Scroll-driven word-by-word fade-in using framer-motion useScroll and useTransform
- **Background**: Solid cream (#FFF8F0) with no animation for maximum contrast

### Files to Modify/Create
- Create: `src/components/landing/manifesto.tsx`

### Data Flow
- No external data - static copy with scroll-triggered animation

### Error Handling
- Fallback to opacity animation if transform fails
- Ensure text remains readable at all viewport sizes

### Testing
- Verify word-by-word reveal works smoothly on scroll
- Test contrast ratios meet accessibility standards
- Confirm proper scaling on mobile devices

---

## 3. HOW IT WORKS SECTION

### Purpose
Explain the three-step workflow through scroll-pinned visual storytelling that builds understanding as user progresses.

### Components & Implementation
- **Scroll-Pinned Container**: Three steps pinned to viewport as user scrolls through section
- **Steps**: 
  1. UPLOAD - "Snap it. Strip the background." (camera/upload icon)
  2. ORGANIZE - "Sort by category. Tag once." (folder/tag icon)
  3. WEAR MORE - "See what you own. See what you forget." (eye/heart icon)
- **Progress Indicator**: Top bar showing current step progress (01/02/03)
- **Typography**: Clean body text with serif accents for step numbers
- **Animation**: Each step fades in/slides up as it becomes active using useScroll and useTransform

### Files to Modify/Create
- Create: `src/components/landing/how-it-works.tsx`

### Data Flow
- No external data - static workflow explanation

### Error Handling
- If scroll pinning fails, fall back to standard scroll-reveal animation
- Ensure icons have accessible labels

### Testing
- Verify smooth pinning behavior on scroll
- Test step activation at correct scroll positions
- Confirm touch/mouse interactions work on icons
- Validate on various screen sizes

---

## 4. CATEGORIES SECTION

### Purpose
Showcase wardrobe categories in an engaging, interactive horizontal scroll format that invites exploration.

### Components & Implementation
- **Container**: Horizontally scrollable row with drag-to-scroll functionality (framer-motion drag)
- **Category Cards**: Six cards (TOPS, BOTTOMS, DRESSES, OUTERWEAR, SHOES, ACCESSORIES)
- **Card Design**: 
  - Large serif category name (Syne 600)
  - Subtle gradient wash background
  - Minimal padding for compact layout
- **Animation**: On section entry, row slides in from right with staggered card reveals
- **Visual Feedback**: Subtle scale on drag, momentum scrolling

### Files to Modify/Create
- Modify: `src/components/landing/categories.tsx` (rewrite as horizontal scroll gallery)

### Data Flow
- Static category data - could be extracted to constants file if needed later
- No user input beyond drag interaction

### Error Handling
- Fallback to standard scroll if drag fails
- Ensure touch targets are minimum 48x48px
- Provide visual scroll indicators

### Testing
- Verify smooth drag-to-scroll on desktop and mobile
- Test momentum scrolling feels natural
- Confirm all six categories display correctly
- Check accessibility of drag area

---

## 5. CTA + FOOTER SECTION

### Purpose
Convert interest into action with a strong final message and clear call-to-action.

### Components & Implementation
- **Background**: Full-bleed dark section (charcoal #1A1A1A background, cream #FFF8F0 text)
- **Headline**: Serif typography - "Your wardrobe is waiting."
- **Primary CTA**: Single button - "START FREE →" (acid green #A8FF3E)
- **Footer**: 
  - Left: Serif "TAG" logo
  - Right: Small copyright text
- **Animation**: Fade-in on section entry with slight upward motion

### Files to Modify/Create
- Create: `src/components/landing/cta.tsx`
- Modify: `src/app/page.tsx` (reorder sections to match new flow)
- Modify: existing footer component or create new one in this section

### Data Flow
- No external data - static conversion-focused content

### Error Handling
- Ensure CTA button has clear hover/focus states
- Validate link destinations work correctly
- Maintain contrast ratio for readability

### Testing
- Verify CTA navigation to /signup works
- Test footer readability on dark background
- Confirm proper spacing and alignment
- Check mobile tap targets

---

## Global Style Updates

### Typography System
- **Display Headings**: Syne 700 (bold) - used for hero headline, manifesto, section titles
- **Body Text**: IBM Plex Mono 400/500 - used for paragraphs, feature descriptions
- **Labels/Metadata**: Space Mono 400 - used for UI labels, timestamps, small text
- **Font Loading**: Add to `src/app/globals.css` via @import or next/font

### Color Palette (Maintain Existing Brutalist Accents for App Shell)
- **Backgrounds**: 
  - Cream: #FFF8F0 (landing page sections)
  - Charcoal: #1A1A1A (footer/CTA section)
- **Accents**:
  - Acid Green: #A8FF3E (primary buttons, highlights)
  - Tangerine: #FF6B35 (secondary accents)
  - Destructive: #FF3366 (error states)
- **Borders**: #1A1A1A (2px width, 0 radius - brutalist constraint maintained in app shell only)

### Motion Principles
- **Library**: framer-motion only for all animations
- **Scroll Effects**: useScroll + useTransform for scroll-linked animations
- **Reveals**: Prefer clipPath wipes over opacity fades for editorial feel
- **Staggering**: Use animationDelay for cascading reveals
- **Physics**: Use useSpring for natural motion where appropriate

### File Structure Changes
```
src/
├── components/
│   └── landing/
│       ├── loader.tsx          (new - cinematic framer-motion loader)
│       ├── hero.tsx            (modified - shadergradient bg + 3D tag)
│       ├── manifesto.tsx       (new - oversized serif statement)
│       ├── how-it-works.tsx    (new - scroll-pinned 3-step workflow)
│       ├── categories.tsx      (modified - horizontal scroll gallery)
│       └── cta.tsx             (new - final conversion section)
├── app/
│   ├── page.tsx                (modified - reordered sections)
│   └── globals.css             (modified - typography and color updates)
└── lib/
    └── utils.ts                (unchanged)
```

---

## Implementation Notes

### Dependencies to Use
- Already installed: `@react-three/fiber`, `three`, `@types/three`, `@shadergradient/react`, `framer-motion`
- No new dependencies required for this redesign

### Integration with Existing App
- Landing page is standalone - does not affect wardrobe, outfits, try-on, or settings pages
- App shell (sidebar, topnav, layout) retains brutalist design system
- Navigation from landing header links to /login and /signup remains unchanged
- No state management changes needed - all sections are static/motion-only

### Performance Considerations
- Lazy load heavy components if needed (r3f in hero only)
- Optimize shadergradient performance with low complexity gradients
- Ensure framer-motion animations use transform/opacity for GPU acceleration
- Compress any static assets if added later

### Accessibility
- Ensure all motion respects `prefers-reduced-motion` media query
- Provide meaningful alt text for 3D tag and icons
- Maintain sufficient color contrast ratios (>4.5:1 for text)
- Ensure all interactive elements are keyboard accessible
- Use semantic HTML sections and headings

---