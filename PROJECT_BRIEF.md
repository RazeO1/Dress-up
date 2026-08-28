# Wardrobe — Virtual Wardrobe App

## Vision
A modern, Apple-inspired virtual wardrobe app for individuals, friends, and family. Premium, smooth, zero jank. Think Apple Photos meets Pinterest.

## Core Features
- Authentication (email/password + Google OAuth + Apple OAuth)
- Personal wardrobe collection (upload, categorize, tag)
- Outfit combination builder (drag-and-drop, canvas)
- Virtual try-on MVP (HTML5 Canvas overlay)
- Color experimentation (real-time filters + palettes)
- Family/friend sharing (invite codes, view/save outfits)

## Tech Stack
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
- Animations: Framer Motion
- Drag/Drop: @dnd-kit
- State: Zustand + TanStack Query
- Forms: React Hook Form + Zod
- Backend: Supabase (Postgres, Auth, Storage, Realtime)
- Testing: Playwright
- Deploy: Vercel
- Icons: Lucide React

## Database Tables
- profiles, items, outfits, try_on_snapshots
- family_groups, family_members, outfit_shares

All RLS-protected — users access only their own data.

## Storage Buckets (Private)
- wardrobe-images (full-res clothing)
- wardrobe-thumbnails (400px)
- body-photos (try-on)
- try-on-results (composites)

## Design System
- Light: White + system grays + #007AFF accent
- Dark: Black + dark grays + #0A84FF accent
- Cards: 16px radius, 0 2px 8px shadow
- Buttons: 12px radius, weight 600
- Animations: transforms/opacity only, spring physics
- System font stack

## Implementation Phases
1. ✅ Project Setup
2. ✅ Auth & Database
3. Wardrobe Collection (upload, tag, filter)
4. Outfit Builder (drag-drop canvas, save)
5. Virtual Try-On (overlay positioning, blend modes)
6. Family Sharing (groups, comments)
7. Tests & Deploy
