# Phase 1 — Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a deployable Next.js 15 application where a user can register, log in, view a personal dashboard, and log out — with all security tests passing and zero data shared across accounts.

**Architecture:** Next.js App Router with Route Handlers and Server Actions. Auth.js v5 with Credentials + database-backed sessions in Postgres. argon2id password hashing. A `getCurrentUser()` helper that reads the session from cookies is the *only* way the app gets the authenticated userId. Sliding-window rate limit in Postgres. UI built on shadcn/ui + Tailwind. Deployed to Vercel.

**Tech Stack:** Next.js 15, TypeScript (strict), Tailwind 4, shadcn/ui, Prisma 5, PostgreSQL 16 (Neon), Auth.js v5 (next-auth@5 beta), argon2, Zod, Vitest, Playwright, ESLint, Prettier.

**Spec:** `docs/superpowers/specs/2026-08-26-online-wardrobe-design.md` (and the supporting docs in `docs/`).

## Global Constraints

- Node.js ≥ 20.11 (Vercel default). Pin via `.nvmrc` to `20.11.0`.
- TypeScript `strict: true` and `noUncheckedIndexedAccess: true`.
- ESLint with `@typescript-eslint`, `eslint-config-next`, and a custom rule banning `req.query.userId` / `req.body.userId` / `searchParams.userId` patterns in app code.
- Prettier with default config + `printWidth: 100`.
- All package versions: caret-prefixed (`^`) for minor flexibility, exact for security-critical packages (`next-auth@5.x.x`, `argon2@^0.x`, `prisma@5.x`).
- All env vars go through a single Zod-validated loader (`src/env.ts`). No direct `process.env.X` reads anywhere else.
- Database connection string is `DATABASE_URL`; never logged.
- `AUTH_SECRET` is required; app refuses to boot without it.
- No `dangerouslySetInnerHTML`, no `eval`, no `new Function()` anywhere.
- Every user-owned entity will have a `user_id` non-null FK; this phase lays the schema foundation even if not all tables are created yet.
- All async route handlers return `Response.json(...)` or `new Response(..., { status })`; never throw raw errors to the client.
- File names: kebab-case for files, PascalCase for React components, camelCase for utilities.
- Every task ends with a commit. Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`, `refactor:`.

---

## File Structure (Phase 1)

```
/
├── .env.example                  # Documented env vars
├── .env                          # Gitignored; for local dev
├── .gitignore
├── .nvmrc
├── .eslintrc.cjs
├── .prettierrc
├── README.md
├── next.config.mjs
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── components.json               # shadcn/ui config
│
├── prisma/
│   └── schema.prisma             # Users + Auth.js tables + rate_limit_events + security_events
│
├── src/
│   ├── env.ts                    # Zod-validated env loader
│   ├── middleware.ts             # Auth gate, rate limit, security headers
│   │
│   ├── app/
│   │   ├── layout.tsx            # Root layout (fonts, Toaster)
│   │   ├── globals.css           # Tailwind + CSS variables
│   │   ├── page.tsx              # Landing page
│   │   ├── (auth)/
│   │   │   ├── layout.tsx        # Centered auth layout
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx        # App shell (sidebar, topbar)
│   │   │   └── dashboard/page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx          # Placeholder Phase 4 — accessible but minimal
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/route.ts   # Auth.js handler
│   │       │   └── register/route.ts        # Custom registration endpoint
│   │       ├── me/route.ts                  # GET current user
│   │       └── ai/capabilities/route.ts     # Returns all-false in Phase 1
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn-generated primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── card.tsx
│   │   │   ├── form.tsx
│   │   │   ├── toast.tsx
│   │   │   └── toaster.tsx
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── password-strength.tsx
│   │   ├── marketing/
│   │   │   ├── hero.tsx
│   │   │   ├── feature-grid.tsx
│   │   │   └── footer.tsx
│   │   └── app/
│   │       ├── sidebar.tsx
│   │       └── topbar.tsx
│   │
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── config.ts         # Auth.js NextAuth() config
│   │   │   ├── session.ts        # getCurrentUser() helper
│   │   │   └── password.ts       # hashPassword / verifyPassword (argon2id)
│   │   ├── rate-limit/
│   │   │   ├── index.ts          # check() / record() helpers
│   │   │   └── windows.ts        # Sliding window config
│   │   ├── validation/
│   │   │   ├── auth.ts           # Zod schemas for register/login
│   │   │   └── common.ts         # Email, username, password schemas
│   │   ├── errors.ts             # AppError hierarchy
│   │   ├── audit.ts              # logSecurityEvent()
│   │   ├── db.ts                 # PrismaClient singleton
│   │   └── utils.ts              # cn() and small helpers
│   │
│   └── server/                   # Server-only code (alias prevents client import)
│       └── (intentionally empty in Phase 1; will grow in Phase 2)
│
├── tests/
│   ├── helpers/
│   │   ├── test-db.ts            # Reset / truncate helpers
│   │   ├── test-auth.ts          # signInTestUser(), getSessionCookie()
│   │   └── factories.ts          # userFactory()
│   ├── unit/
│   │   ├── password.test.ts
│   │   ├── rate-limit.test.ts
│   │   └── env.test.ts
│   ├── integration/
│   │   ├── auth-register.test.ts
│   │   ├── auth-login.test.ts
│   │   ├── auth-logout.test.ts
│   │   ├── auth-me.test.ts
│   │   └── security/
│   │       ├── brute-force.test.ts
│   │       └── unauthenticated-protected-route.test.ts
│   └── e2e/
│       ├── register-login.spec.ts
│       └── landing.spec.ts
│
└── docs/                         # Already exists from Phase 0
    └── ...
```

### Why this structure

- `src/` keeps app code out of the repo root and makes the test/build boundaries obvious
- `lib/auth/` is the **only** module that knows about NextAuth; everything else calls `getCurrentUser()`
- `lib/rate-limit/` is a tiny utility the middleware uses; in Phase 2 we'll add it to API routes too
- `server/` alias (`#server/*` import alias) ensures no business logic accidentally ships in the client bundle
- Tests live next to the source they test conceptually, but in their own folder for discoverability

---

## Task 1: Project skeleton + tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`, `components.json`, `.nvmrc`, `.gitignore`, `.eslintrc.cjs`, `.prettierrc`, `vitest.config.ts`, `playwright.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/lib/utils.ts`, `src/env.ts`

**Interfaces:**
- Produces: `src/env.ts` exports `env` (Zod-validated). `src/lib/utils.ts` exports `cn(...)`.

- [ ] **Step 1: Initialize git**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
git init
git checkout -b main
```

- [ ] **Step 2: Create `.nvmrc`**

File: `.nvmrc`
```
20.11.0
```

- [ ] **Step 3: Create `.gitignore`**

File: `.gitignore`
```
# dependencies
node_modules
.pnp
.pnp.js

# next.js
.next
out
build
dist

# env
.env
.env*.local
!.env.example

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# misc
.DS_Store
*.pem
.vscode
.idea

# vercel
.vercel

# testing
coverage
.nyc_output
playwright-report
test-results
/test-results/
/playwright/.cache/

# prisma
prisma/dev.db*
```

- [ ] **Step 4: Create `package.json`**

File: `package.json`
```json
{
  "name": "wardrobe",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=20.11.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:security": "vitest run tests/integration/security",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset --force",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 5: Create `tsconfig.json`**

File: `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "#server/*": ["./src/server/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 6: Create `next.config.mjs`**

File: `next.config.mjs`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
```

- [ ] **Step 7: Create `postcss.config.mjs`**

File: `postcss.config.mjs`
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 8: Create `tailwind.config.ts`**

File: `tailwind.config.ts`
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: 'hsl(var(--bg))',
        surface: 'hsl(var(--surface))',
        'surface-2': 'hsl(var(--surface-2))',
        border: 'hsl(var(--border))',
        fg: 'hsl(var(--fg))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        'accent-fg': 'hsl(var(--accent-fg))',
        danger: 'hsl(var(--danger))',
        success: 'hsl(var(--success))',
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 9: Create `src/env.ts` (Zod-validated env loader)**

File: `src/env.ts`
```ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 chars'),
  AUTH_TRUST_HOST: z.string().optional(),
  APP_URL: z.string().url().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables. See logs above.');
}

export const env = parsed.data;
```

- [ ] **Step 10: Create `src/lib/utils.ts`**

File: `src/lib/utils.ts`
```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 11: Create minimal `src/app/layout.tsx`**

File: `src/app/layout.tsx`
```tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wardrobe',
  description: 'Your private wardrobe, online.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 12: Create `src/app/globals.css` with design tokens**

File: `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg: 0 0% 100%;
    --surface: 0 0% 99%;
    --surface-2: 220 14% 96%;
    --border: 220 13% 91%;
    --fg: 224 71% 4%;
    --muted: 220 9% 46%;
    --accent: 221 83% 53%;
    --accent-fg: 0 0% 100%;
    --danger: 0 72% 51%;
    --success: 142 71% 45%;
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-display: 'Inter', system-ui, sans-serif;
  }

  .dark {
    --bg: 224 71% 4%;
    --surface: 224 50% 7%;
    --surface-2: 220 30% 12%;
    --border: 220 20% 18%;
    --fg: 0 0% 98%;
    --muted: 220 14% 65%;
    --accent: 217 91% 60%;
    --accent-fg: 0 0% 100%;
    --danger: 0 72% 60%;
    --success: 142 71% 50%;
  }

  * {
    @apply border-border;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    @apply bg-bg text-fg font-sans;
    font-feature-settings: 'cv11', 'ss01', 'ss03';
  }
}

@layer utilities {
  .container-content {
    @apply mx-auto w-full max-w-content px-6;
  }
}
```

- [ ] **Step 13: Create minimal `src/app/page.tsx`**

File: `src/app/page.tsx`
```tsx
export default function Home() {
  return (
    <main className="container-content py-24">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Wardrobe</h1>
      <p className="mt-2 text-muted">Your private wardrobe, online.</p>
    </main>
  );
}
```

- [ ] **Step 14: Install dependencies**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm install
```

Expected: `node_modules/` and `package-lock.json` created.

- [ ] **Step 15: Verify dev server boots**

```bash
npm run dev
```

Expected: Server starts on `http://localhost:3000`. Visit it; see "Wardrobe" heading. Stop the server (Ctrl+C).

- [ ] **Step 16: Commit**

```bash
git add -A
git commit -m "chore: scaffold next.js app with design tokens"
```

---

## Task 2: Lint, format, and the userId-banning rule

**Files:**
- Create: `.eslintrc.cjs`, `.prettierrc`, `eslint-rules/no-client-userid.js`

**Interfaces:**
- Produces: `npm run lint` passes; `npm run format` works; the custom ESLint rule errors when source code references `userId` from `searchParams`, `query`, or `body` outside `lib/auth/*` and `server/**`.

- [ ] **Step 1: Install ESLint + Prettier + Next config**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm install --save-dev eslint eslint-config-next @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-plugin-prettier eslint-config-prettier
```

- [ ] **Step 2: Create `.prettierrc`**

File: `.prettierrc`
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

- [ ] **Step 3: Create `.eslintrc.cjs`**

File: `.eslintrc.cjs`
```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'local-rules'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector: "MemberExpression[property.name='dangerouslySetInnerHTML']",
        message: 'dangerouslySetInnerHTML is banned. Use safe text rendering.',
      },
    ],
  },
  overrides: [
    {
      files: ['src/app/**/page.tsx', 'src/app/**/layout.tsx', 'src/middleware.ts', 'src/lib/auth/**', 'src/server/**'],
      excludedFiles: ['**/api/auth/[...nextauth]/**'],
    },
    {
      files: ['**/*.{ts,tsx}'],
      excludedFiles: ['src/lib/auth/**', 'src/server/**', 'src/lib/rate-limit/**', 'tests/**'],
      rules: {
        'local-rules/no-client-userid': 'error',
      },
    },
  ],
};
```

- [ ] **Step 4: Create custom rule `eslint-rules/no-client-userid.js`**

Create folder: `eslint-rules/`
File: `eslint-rules/no-client-userid.js`
```js
'use strict';

const FORBIDDEN_PATHS = [
  'searchParams',
  'query',
  'body',
  'params',
  'headers',
  'cookies',
];

const FORBIDDEN_NAMES = ['userId', 'user_id', 'ownerId', 'owner_id', 'requesterId', 'requester_id'];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow reading userId/ownerId from client-controlled request data. ' +
        'The authenticated user must come from the server-side session only.',
    },
    schema: [],
    messages: {
      forbidden:
        'Reading `{{name}}` from `{{path}}` is forbidden. ' +
        'Use `getCurrentUserId()` from `lib/auth/session` to derive the user from the session.',
    },
  },
  create(context) {
    function checkMemberAccess(node) {
      if (node.type !== 'MemberExpression') return;
      const prop = node.property;
      if (prop.type !== 'Identifier') return;
      if (!FORBIDDEN_NAMES.includes(prop.name)) return;
      const obj = node.object;
      if (obj.type !== 'Identifier') return;
      if (!FORBIDDEN_PATHS.includes(obj.name)) return;
      context.report({
        node: prop,
        messageId: 'forbidden',
        data: { name: prop.name, path: obj.name },
      });
    }
    return {
      MemberExpression: checkMemberAccess,
      VariableDeclarator(node) {
        const id = node.id;
        if (id.type !== 'ObjectPattern') return;
        for (const prop of id.properties) {
          if (prop.type !== 'Property') continue;
          if (prop.key.type !== 'Identifier') continue;
          if (!FORBIDDEN_NAMES.includes(prop.key.name)) continue;
          if (prop.value.type !== 'Identifier') continue;
          if (!FORBIDDEN_PATHS.includes(prop.value.name)) continue;
          context.report({
            node: prop.key,
            messageId: 'forbidden',
            data: { name: prop.key.name, path: prop.value.name },
          });
        }
      },
    };
  },
};
```

- [ ] **Step 5: Add local-rules plugin entrypoint**

File: `eslint-rules/index.js`
```js
'use strict';

module.exports = {
  rules: {
    'no-client-userid': require('./no-client-userid'),
  },
};
```

- [ ] **Step 6: Update `package.json` eslintConfig path**

Edit `package.json` — add at top level (after `"version"`):
```json
  "eslintConfig": {
    "root": true
  },
```
And update the lint script:
```json
    "lint": "next lint --rulesdir eslint-rules"
```

- [ ] **Step 7: Verify lint passes on current code**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm run lint
```

Expected: No errors.

- [ ] **Step 8: Add a temporary "should fail" test file to verify the rule works**

Create `src/lib/__test_userid_rule.ts`:
```ts
export function bad() {
  const { userId } = searchParams;
  return userId;
}
```

Run:
```bash
npm run lint
```

Expected: ERROR `no-client-userid`.

- [ ] **Step 9: Delete the temp file and re-verify**

```bash
rm src/lib/__test_userid_rule.ts
npm run lint
```

Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: add eslint with custom no-client-userid rule"
```

---

## Task 3: Prisma + Postgres schema

**Files:**
- Create: `prisma/schema.prisma`, `src/lib/db.ts`, `.env.example`, `.env` (gitignored)

**Interfaces:**
- Produces: `prisma db push` (in dev) and `prisma migrate dev` work; `import { db } from '@/lib/db'` gives a singleton PrismaClient.

- [ ] **Step 1: Create `.env.example`**

File: `.env.example`
```
# Environment
NODE_ENV=development

# Database (Postgres / Neon)
DATABASE_URL="postgresql://user:password@host:5432/wardrobe?sslmode=require"

# Auth.js
AUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_TRUST_HOST="true"
APP_URL="http://localhost:3000"
```

- [ ] **Step 2: Create `.env` (gitignored) for local dev**

File: `.env` (you must replace the placeholders with a real local Postgres or Neon dev-branch URL)
```
NODE_ENV=development
DATABASE_URL="postgresql://user:password@host:5432/wardrobe?sslmode=require"
AUTH_SECRET="<local-dev-secret-at-least-32-characters-long>"
AUTH_TRUST_HOST="true"
APP_URL="http://localhost:3000"
```

Generate a secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

- [ ] **Step 3: Install Prisma**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm install prisma @prisma/client
npm install --save-dev dotenv-cli
```

- [ ] **Step 4: Initialize Prisma**

```bash
npx prisma init
```

This creates a default `prisma/schema.prisma`. We'll overwrite it in the next step.

- [ ] **Step 5: Replace `prisma/schema.prisma`**

File: `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// User-owned entities: every row has user_id.
// ============================================

model User {
  id              String    @id @default(cuid())
  email           String    @unique
  emailVerifiedAt DateTime?
  username        String    @unique
  displayName     String?
  passwordHash    String
  imageKey        String?
  bio             String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime?

  sessions        Session[]
  accounts        Account[]
  rateLimitEvents RateLimitEvent[]
  securityEvents  SecurityEvent[]

  @@index([deletedAt])
}

// ============================================
// Auth.js v5 (NextAuth) standard tables
// ============================================

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ============================================
// Rate limiting + audit log
// ============================================

model RateLimitEvent {
  id        BigInt   @id @default(autoincrement())
  userId    String?
  ip        String?
  endpoint  String
  createdAt DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([ip, endpoint, createdAt])
  @@index([userId, endpoint, createdAt])
}

model SecurityEvent {
  id        String   @id @default(cuid())
  userId    String?
  eventType String
  metadata  Json?
  ip        String?
  userAgent String?
  createdAt DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([eventType, createdAt])
  @@index([userId, createdAt])
}
```

- [ ] **Step 6: Create the Prisma client singleton**

File: `src/lib/db.ts`
```ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
```

- [ ] **Step 7: Generate the client and run the initial migration**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npx prisma generate
npx prisma migrate dev --name init
```

Expected: a new `prisma/migrations/<timestamp>_init/` directory is created; client types are generated.

- [ ] **Step 8: Verify tables exist**

```bash
npx prisma studio
```

Open `http://localhost:5555`. Confirm tables: `User`, `Account`, `Session`, `VerificationToken`, `RateLimitEvent`, `SecurityEvent`. Stop the studio server.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat(db): initial schema with users, auth tables, rate limit, audit log"
```

---

## Task 4: Vitest + test database helpers

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`, `tests/helpers/test-db.ts`, `tests/helpers/factories.ts`, `tests/unit/env.test.ts`

**Interfaces:**
- Produces: `npm test` runs Vitest; `tests/helpers/test-db.ts` exports `resetTestDb()` and `disconnectTestDb()`.

- [ ] **Step 1: Install Vitest + utilities**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/dom jsdom @types/jsdom
```

- [ ] **Step 2: Create `vitest.config.ts`**

File: `vitest.config.ts`
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['tests/e2e/**', 'node_modules/**', '.next/**'],
    testTimeout: 15000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '#server': path.resolve(__dirname, './src/server'),
    },
  },
});
```

- [ ] **Step 3: Create `tests/setup.ts`**

File: `tests/setup.ts`
```ts
import { afterAll, beforeAll } from 'vitest';
import { resetTestDb, disconnectTestDb } from './helpers/test-db';

beforeAll(async () => {
  await resetTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});
```

- [ ] **Step 4: Create `tests/helpers/test-db.ts`**

File: `tests/helpers/test-db.ts`
```ts
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';

const testDbUrl = process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL;

if (!testDbUrl) {
  throw new Error('DATABASE_URL_TEST (or DATABASE_URL) is required for tests');
}

process.env.DATABASE_URL = testDbUrl;

export const testDb = new PrismaClient({
  datasources: { db: { url: testDbUrl } },
  log: ['error'],
});

export async function resetTestDb(): Promise<void> {
  // Order matters: respect FKs. Truncate everything; cascade is set on User-owned rows.
  await testDb.$executeRawUnsafe(`
    TRUNCATE TABLE
      "SecurityEvent",
      "RateLimitEvent",
      "Session",
      "Account",
      "VerificationToken",
      "User"
    RESTART IDENTITY CASCADE;
  `);
}

export async function disconnectTestDb(): Promise<void> {
  await testDb.$disconnect();
}

// Optional: programmatic migration for the test DB on first run
export function migrateTestDb(): void {
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: testDbUrl },
    stdio: 'inherit',
  });
}
```

- [ ] **Step 5: Add `DATABASE_URL_TEST` to `.env.example` and `.env`**

Append to `.env.example`:
```
# Test database (separate from dev DB)
DATABASE_URL_TEST="postgresql://user:password@host:5432/wardrobe_test?sslmode=require"
```

Append to `.env` (gitignored):
```
DATABASE_URL_TEST="postgresql://user:password@host:5432/wardrobe_test?sslmode=require"
```

- [ ] **Step 6: Create `tests/helpers/factories.ts`**

File: `tests/helpers/factories.ts`
```ts
import { testDb } from './test-db';
import { hashPassword } from '@/lib/auth/password';

let counter = 0;

export function uniqueEmail(): string {
  counter += 1;
  return `user${counter}-${Date.now()}@example.test`;
}

export function uniqueUsername(prefix = 'user'): string {
  counter += 1;
  return `${prefix}${counter}${Date.now().toString(36)}`.slice(0, 20);
}

export async function userFactory(overrides: Partial<{
  email: string;
  username: string;
  displayName: string | null;
  passwordHash: string;
  imageKey: string | null;
  bio: string | null;
}> = {}) {
  const passwordHash = overrides.passwordHash ?? (await hashPassword('CorrectHorseBatteryStaple-1'));
  return testDb.user.create({
    data: {
      email: overrides.email ?? uniqueEmail(),
      username: overrides.username ?? uniqueUsername(),
      displayName: overrides.displayName ?? null,
      passwordHash,
      imageKey: overrides.imageKey ?? null,
      bio: overrides.bio ?? null,
    },
  });
}
```

- [ ] **Step 7: Create the env unit test**

File: `tests/unit/env.test.ts`
```ts
import { describe, it, expect } from 'vitest';

describe('env loader', () => {
  it('exposes parsed env in non-test environments', async () => {
    const { env } = await import('@/env');
    expect(env.NODE_ENV).toBeTruthy();
    expect(env.DATABASE_URL).toBeTruthy();
    expect(env.AUTH_SECRET.length).toBeGreaterThanOrEqual(32);
  });
});
```

- [ ] **Step 8: Run tests**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm test
```

Expected: 1 test passes. The test runs `resetTestDb()` which truncates the test database.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "test: vitest setup with test db helpers and factories"
```

---

## Task 5: Password hashing (argon2id)

**Files:**
- Create: `src/lib/auth/password.ts`, `tests/unit/password.test.ts`

**Interfaces:**
- Produces: `hashPassword(plain)`, `verifyPassword(hash, plain)`. Hash format: `$argon2id$v=19$m=...,t=...,p=...$salt$hash`.

- [ ] **Step 1: Install argon2**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm install argon2
npm install --save-dev @types/argon2
```

- [ ] **Step 2: Create `src/lib/auth/password.ts`**

File: `src/lib/auth/password.ts`
```ts
import argon2 from 'argon2';

// OWASP 2024 recommended baseline
const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 19 * 1024, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plain: string): Promise<string> {
  if (plain.length < 12) {
    throw new Error('Password must be at least 12 characters');
  }
  return argon2.hash(plain, ARGON2_OPTIONS);
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}
```

- [ ] **Step 3: Write the failing test**

File: `tests/unit/password.test.ts`
```ts
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

describe('password hashing', () => {
  it('hashes a password to an argon2id string', async () => {
    const hash = await hashPassword('CorrectHorseBatteryStaple-1');
    expect(hash.startsWith('$argon2id$')).toBe(true);
  });

  it('verifies a correct password', async () => {
    const hash = await hashPassword('CorrectHorseBatteryStaple-1');
    expect(await verifyPassword(hash, 'CorrectHorseBatteryStaple-1')).toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('CorrectHorseBatteryStaple-1');
    expect(await verifyPassword(hash, 'WrongPassword12345')).toBe(false);
  });

  it('rejects a too-short password at hash time', async () => {
    await expect(hashPassword('short')).rejects.toThrow();
  });
});
```

- [ ] **Step 4: Run tests**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm test -- tests/unit/password.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(auth): argon2id password hashing"
```

---

## Task 6: Validation schemas (Zod)

**Files:**
- Create: `src/lib/validation/common.ts`, `src/lib/validation/auth.ts`, `tests/unit/validation-auth.test.ts`

**Interfaces:**
- Produces: `emailSchema`, `usernameSchema`, `passwordSchema`, `registerSchema`, `loginSchema`, `forgotPasswordSchema`, `resetPasswordSchema` — all Zod schemas.

- [ ] **Step 1: Install Zod**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm install zod
```

- [ ] **Step 2: Create `src/lib/validation/common.ts`**

File: `src/lib/validation/common.ts`
```ts
import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email address')
  .max(254);

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores');

export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password is too long')
  .refine((v) => /[a-z]/.test(v), 'Password must include a lowercase letter')
  .refine((v) => /[A-Z]/.test(v), 'Password must include an uppercase letter')
  .refine((v) => /[0-9]/.test(v), 'Password must include a number');
```

- [ ] **Step 3: Create `src/lib/validation/auth.ts`**

File: `src/lib/validation/auth.ts`
```ts
import { z } from 'zod';
import { emailSchema, passwordSchema, usernameSchema } from './common';

export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  displayName: z.string().trim().min(1).max(60).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});
```

- [ ] **Step 4: Create `tests/unit/validation-auth.test.ts`**

File: `tests/unit/validation-auth.test.ts`
```ts
import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@/lib/validation/auth';

describe('registerSchema', () => {
  it('accepts a valid registration', () => {
    const result = registerSchema.safeParse({
      email: 'User@Example.COM',
      username: 'raze_01',
      password: 'StrongPass12345',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@example.com'); // normalized
      expect(result.data.username).toBe('raze_01');
    }
  });

  it('rejects a too-short password', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      username: 'raze_01',
      password: 'short1A',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a username with uppercase letters', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      username: 'Raze_01',
      password: 'StrongPass12345',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      username: 'raze_01',
      password: 'StrongPass12345',
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts a valid login', () => {
    expect(
      loginSchema.safeParse({ email: 'user@example.com', password: 'anything' }).success,
    ).toBe(true);
  });

  it('rejects an empty password', () => {
    expect(loginSchema.safeParse({ email: 'user@example.com', password: '' }).success).toBe(false);
  });
});
```

- [ ] **Step 5: Run tests**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm test -- tests/unit/validation-auth.test.ts
```

Expected: 5 tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(validation): zod schemas for auth inputs"
```

---

## Task 7: Audit log helper

**Files:**
- Create: `src/lib/audit.ts`, `src/lib/errors.ts`, `tests/unit/audit.test.ts`

**Interfaces:**
- Produces: `logSecurityEvent({ userId?, eventType, metadata?, ip?, userAgent? })` writes to `SecurityEvent`. `AppError` class hierarchy in `errors.ts`.

- [ ] **Step 1: Create `src/lib/errors.ts`**

File: `src/lib/errors.ts`
```ts
export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly expose: boolean;

  constructor(opts: { message: string; status: number; code: string; expose?: boolean }) {
    super(opts.message);
    this.name = this.constructor.name;
    this.status = opts.status;
    this.code = opts.code;
    this.expose = opts.expose ?? true;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid input', public details?: unknown) {
    super({ message, status: 400, code: 'validation_error' });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Not authenticated') {
    super({ message, status: 401, code: 'unauthorized' });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Not found') {
    super({ message, status: 404, code: 'not_found' });
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super({ message, status: 409, code: 'conflict' });
  }
}

export class RateLimitedError extends AppError {
  constructor(message = 'Too many requests') {
    super({ message, status: 429, code: 'rate_limited' });
  }
}
```

- [ ] **Step 2: Create `src/lib/audit.ts`**

File: `src/lib/audit.ts`
```ts
import { db } from './db';

export type SecurityEventType =
  | 'auth_login_success'
  | 'auth_login_failure'
  | 'auth_register_success'
  | 'auth_register_failure'
  | 'auth_logout'
  | 'auth_session_expired'
  | 'rate_limit_exceeded'
  | 'cross_user_access_attempt'
  | 'signed_url_minted';

export interface SecurityEventInput {
  userId?: string | null;
  eventType: SecurityEventType;
  metadata?: Record<string, unknown> | null;
  ip?: string | null;
  userAgent?: string | null;
}

export async function logSecurityEvent(input: SecurityEventInput): Promise<void> {
  // Best-effort; never throw to the caller
  try {
    await db.securityEvent.create({
      data: {
        userId: input.userId ?? null,
        eventType: input.eventType,
        metadata: input.metadata ? (input.metadata as object) : null,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[audit] failed to log security event', { eventType: input.eventType, err });
  }
}
```

- [ ] **Step 3: Create `tests/unit/audit.test.ts`**

File: `tests/unit/audit.test.ts`
```ts
import { describe, it, expect, afterEach } from 'vitest';
import { logSecurityEvent } from '@/lib/audit';
import { testDb } from '../helpers/test-db';

afterEach(async () => {
  await testDb.securityEvent.deleteMany();
});

describe('logSecurityEvent', () => {
  it('writes an event to the database', async () => {
    await logSecurityEvent({ eventType: 'auth_login_success', ip: '127.0.0.1' });
    const events = await testDb.securityEvent.findMany();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe('auth_login_success');
    expect(events[0]?.ip).toBe('127.0.0.1');
  });

  it('does not throw if input is malformed', async () => {
    await expect(logSecurityEvent({ eventType: 'auth_logout' })).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 4: Run tests**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm test -- tests/unit/audit.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(audit): security event logger + error hierarchy"
```

---

## Task 8: Rate limiting (sliding window in Postgres)

**Files:**
- Create: `src/lib/rate-limit/windows.ts`, `src/lib/rate-limit/index.ts`, `tests/unit/rate-limit.test.ts`

**Interfaces:**
- Produces: `checkRateLimit({ key, endpoint, windowMs, max })` returns `{ allowed: boolean, remaining: number, resetAt: Date }`. Internally uses `RateLimitEvent` table.

- [ ] **Step 1: Create `src/lib/rate-limit/windows.ts`**

File: `src/lib/rate-limit/windows.ts`
```ts
export const RATE_WINDOWS = {
  authLoginIp: { windowMs: 15 * 60 * 1000, max: 5 },
  authLoginAccount: { windowMs: 15 * 60 * 1000, max: 10 },
  authRegisterIp: { windowMs: 60 * 60 * 1000, max: 10 },
  apiGeneral: { windowMs: 60 * 1000, max: 60 },
} as const;

export type RateWindow = keyof typeof RATE_WINDOWS;
```

- [ ] **Step 2: Create `src/lib/rate-limit/index.ts`**

File: `src/lib/rate-limit/index.ts`
```ts
import { db } from '@/lib/db';
import { RATE_WINDOWS, type RateWindow } from './windows';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export async function checkRateLimit(opts: {
  key: string;
  endpoint: RateWindow | string;
  windowMs?: number;
  max?: number;
}): Promise<RateLimitResult> {
  const preset = RATE_WINDOWS[opts.endpoint as RateWindow];
  const windowMs = opts.windowMs ?? preset?.windowMs ?? 60_000;
  const max = opts.max ?? preset?.max ?? 60;

  const now = Date.now();
  const since = new Date(now - windowMs);

  const [{ count }] = await db.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*)::bigint AS count
    FROM "RateLimitEvent"
    WHERE "endpoint" = ${opts.endpoint}
      AND "createdAt" >= ${since}
      AND (
        (${opts.key} LIKE 'ip:%' AND "ip" = ${opts.key.slice(3)})
        OR (${opts.key} LIKE 'user:%' AND "userId" = ${opts.key.slice(5)})
      )
  `;

  const used = Number(count ?? 0n);
  const remaining = Math.max(0, max - used - 1);
  const resetAt = new Date(now + windowMs);

  if (used >= max) {
    return { allowed: false, remaining: 0, resetAt };
  }

  return { allowed: true, remaining, resetAt };
}

export async function recordRateLimitEvent(opts: {
  key: string;
  endpoint: string;
}): Promise<void> {
  const isIp = opts.key.startsWith('ip:');
  const isUser = opts.key.startsWith('user:');

  await db.rateLimitEvent.create({
    data: {
      ip: isIp ? opts.key.slice(3) : null,
      userId: isUser ? opts.key.slice(5) : null,
      endpoint: opts.endpoint,
    },
  });
}
```

- [ ] **Step 3: Create `tests/unit/rate-limit.test.ts`**

File: `tests/unit/rate-limit.test.ts`
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, recordRateLimitEvent } from '@/lib/rate-limit';
import { testDb } from '../helpers/test-db';

beforeEach(async () => {
  await testDb.rateLimitEvent.deleteMany();
});

describe('rate limit', () => {
  it('allows requests under the limit', async () => {
    const result = await checkRateLimit({ key: 'ip:1.2.3.4', endpoint: 'authLoginIp' });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it('blocks requests over the limit', async () => {
    for (let i = 0; i < 5; i += 1) {
      await recordRateLimitEvent({ key: 'ip:1.2.3.4', endpoint: 'authLoginIp' });
    }
    const result = await checkRateLimit({ key: 'ip:1.2.3.4', endpoint: 'authLoginIp' });
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('isolates different keys', async () => {
    for (let i = 0; i < 5; i += 1) {
      await recordRateLimitEvent({ key: 'ip:1.2.3.4', endpoint: 'authLoginIp' });
    }
    const other = await checkRateLimit({ key: 'ip:5.6.7.8', endpoint: 'authLoginIp' });
    expect(other.allowed).toBe(true);
  });
});
```

- [ ] **Step 4: Run tests**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm test -- tests/unit/rate-limit.test.ts
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(rate-limit): sliding window in postgres"
```

---

## Task 9: Auth.js v5 configuration

**Files:**
- Create: `src/lib/auth/config.ts`, `src/lib/auth/session.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/auth.ts`

**Interfaces:**
- Produces: NextAuth handler at `/api/auth/*`. `auth()` returns the current session. `signIn`, `signOut` are exported from `src/auth.ts`. `getCurrentUserId()` in `session.ts` returns `string` or throws `UnauthorizedError`.

- [ ] **Step 1: Install Auth.js v5**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm install next-auth@beta @auth/prisma-adapter
```

- [ ] **Step 2: Create `src/lib/auth/config.ts`**

File: `src/lib/auth/config.ts`
```ts
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { verifyPassword } from './password';
import { loginSchema } from '@/lib/validation/auth';

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  session: { strategy: 'database', maxAge: 30 * 24 * 60 * 60 }, // 30 days
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, passwordHash: true, deletedAt: true },
        });

        if (!user || user.deletedAt) {
          // Constant-time-ish: still run a verify to avoid timing oracle
          await verifyPassword(
            '$argon2id$v=19$m=19456,t=2,p=1$YWFhYWFhYWFhYWFhYWFhYQ$RdescudsqaS4cGKaPDqHgaLh5QY4D6a5d4Y5T7y8Z7Ck',
            parsed.data.password,
          ).catch(() => false);
          return null;
        }

        const ok = await verifyPassword(user.passwordHash, parsed.data.password);
        if (!ok) return null;

        return { id: user.id };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // With database strategy, `user` is the DB user; we expose id onto session
      if (session.user && user) {
        (session.user as { id?: string }).id = user.id;
      }
      return session;
    },
  },
};
```

- [ ] **Step 3: Create `src/auth.ts` (root export for Auth.js helpers)**

File: `src/auth.ts`
```ts
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
```

- [ ] **Step 4: Create `src/lib/auth/session.ts` (the ONE place that knows about sessions)**

File: `src/lib/auth/session.ts`
```ts
import { auth } from '@/auth';
import { UnauthorizedError } from '@/lib/errors';
import { db } from '@/lib/db';

export interface CurrentUser {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  imageKey: string | null;
}

/**
 * Returns the authenticated user. Throws UnauthorizedError if no session.
 * This is the ONLY function in the app that derives the user from the request.
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await auth();
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!id) throw new UnauthorizedError();

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      imageKey: true,
    },
  });

  if (!user) throw new UnauthorizedError('Session is no longer valid');
  return user;
}

export async function getCurrentUserId(): Promise<string> {
  const user = await getCurrentUser();
  return user.id;
}

export async function tryGetCurrentUserId(): Promise<string | null> {
  try {
    return await getCurrentUserId();
  } catch {
    return null;
  }
}
```

- [ ] **Step 5: Create the Auth.js route handler**

File: `src/app/api/auth/[...nextauth]/route.ts`
```ts
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

- [ ] **Step 6: Type-check and lint**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm run typecheck
npm run lint
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(auth): auth.js v5 with credentials and db sessions"
```

---

## Task 10: Middleware (auth gate, security headers, request ID)

**Files:**
- Create: `src/middleware.ts`

**Interfaces:**
- Produces: `middleware` function that runs on all routes except `_next`, static files, and `/api/auth/*`. Sets security headers, attaches `x-request-id`, and redirects unauthenticated requests to `/login` for protected app routes.

- [ ] **Step 1: Create `src/middleware.ts`**

File: `src/middleware.ts`
```ts
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/auth';

const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
const PUBLIC_API_PREFIXES = ['/api/auth', '/api/ai/capabilities'];

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/favicon')) return true;
  if (pathname.startsWith('/api/auth')) return true;
  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  return false;
}

function setSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );
  res.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  );
  return res;
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl;

  // Always attach a request ID
  const requestId = crypto.randomUUID();
  const res = NextResponse.next({
    request: { headers: new Headers([...req.headers, ['x-request-id', requestId]]) },
  });
  res.headers.set('x-request-id', requestId);

  setSecurityHeaders(res);

  if (isPublic(pathname)) return res;

  // For everything else, require auth
  const session = await auth();
  if (!session?.user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?from=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

- [ ] **Step 2: Type-check and lint**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm run typecheck
npm run lint
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(middleware): auth gate, security headers, request id"
```

---

## Task 11: Registration endpoint

**Files:**
- Create: `src/app/api/auth/register/route.ts`, `tests/integration/auth-register.test.ts`

**Interfaces:**
- Produces: `POST /api/auth/register` accepts `{ email, username, password, displayName? }`. On success: 201 with no body, creates user, logs `auth_register_success`. On failure: 400/409 with `{ error: { code, message, details? } }`.

- [ ] **Step 1: Write the failing test (success path)**

File: `tests/integration/auth-register.test.ts`
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/register/route';
import { testDb } from '../helpers/test-db';
import { uniqueEmail, uniqueUsername } from '../helpers/factories';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(async () => {
  await testDb.user.deleteMany();
  await testDb.securityEvent.deleteMany();
});

describe('POST /api/auth/register', () => {
  it('creates a user with valid input and returns 201', async () => {
    const email = uniqueEmail();
    const username = uniqueUsername();
    const res = await POST(
      makeRequest({ email, username, password: 'StrongPass12345' }) as never,
    );
    expect(res.status).toBe(201);

    const user = await testDb.user.findUnique({ where: { email } });
    expect(user).not.toBeNull();
    expect(user?.username).toBe(username);
    expect(user?.passwordHash.startsWith('$argon2id$')).toBe(true);
  });

  it('normalizes email to lowercase', async () => {
    const email = uniqueEmail().toUpperCase();
    const res = await POST(
      makeRequest({ email, username: uniqueUsername(), password: 'StrongPass12345' }) as never,
    );
    expect(res.status).toBe(201);
    const stored = await testDb.user.findFirst({ where: { email: email.toLowerCase() } });
    expect(stored).not.toBeNull();
  });

  it('returns 400 for invalid input', async () => {
    const res = await POST(
      makeRequest({ email: 'bad', username: 'X', password: 'short' }) as never,
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe('validation_error');
  });

  it('returns 409 on duplicate email (identical response to duplicate username)', async () => {
    const email = uniqueEmail();
    const username1 = uniqueUsername();
    const username2 = uniqueUsername();
    await POST(
      makeRequest({ email, username: username1, password: 'StrongPass12345' }) as never,
    );
    const res = await POST(
      makeRequest({
        email,
        username: username2,
        password: 'StrongPass12345',
      }) as never,
    );
    expect(res.status).toBe(409);
  });
});
```

- [ ] **Step 2: Run the test — it should fail (route not implemented)**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm test -- tests/integration/auth-register.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create the route handler**

File: `src/app/api/auth/register/route.ts`
```ts
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { registerSchema } from '@/lib/validation/auth';
import { logSecurityEvent } from '@/lib/audit';
import { ConflictError, ValidationError } from '@/lib/errors';
import { checkRateLimit, recordRateLimitEvent } from '@/lib/rate-limit';

function errorResponse(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '0.0.0.0'
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = getIp(req);

  const rl = await checkRateLimit({ key: `ip:${ip}`, endpoint: 'authRegisterIp' });
  if (!rl.allowed) {
    return errorResponse(429, 'rate_limited', 'Too many registration attempts. Try again later.');
  }
  await recordRateLimitEvent({ key: `ip:${ip}`, endpoint: 'authRegisterIp' });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return errorResponse(400, 'validation_error', 'Invalid JSON body');
  }

  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return errorResponse(400, 'validation_error', 'Invalid input', parsed.error.flatten());
  }

  const { email, username, password, displayName } = parsed.data;

  const existing = await db.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { id: true },
  });

  if (existing) {
    // Identical response regardless of which field collides (no enumeration)
    await logSecurityEvent({ eventType: 'auth_register_failure', ip, metadata: { reason: 'conflict' } });
    throw new ConflictError('Could not create account with these details');
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: { email, username, passwordHash, displayName: displayName ?? null },
    select: { id: true, email: true, username: true },
  });

  await logSecurityEvent({
    userId: user.id,
    eventType: 'auth_register_success',
    ip,
    userAgent: req.headers.get('user-agent'),
  });

  return new NextResponse(null, { status: 201 });
}
```

- [ ] **Step 4: Run the test — it should pass**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm test -- tests/integration/auth-register.test.ts
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(auth): registration endpoint with rate limit and conflict masking"
```

---

## Task 12: Login endpoint helper + me endpoint

**Files:**
- Create: `src/app/api/me/route.ts`, `tests/integration/auth-me.test.ts`

**Interfaces:**
- Produces: `GET /api/me` returns `{ user }` with `id, email, username, displayName, imageKey`. 401 if not signed in.

- [ ] **Step 1: Write the failing test**

File: `tests/integration/auth-me.test.ts`
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { GET } from '@/app/api/me/route';
import { userFactory } from '../helpers/factories';
import { testDb } from '../helpers/test-db';

beforeEach(async () => {
  await testDb.user.deleteMany();
  await testDb.session.deleteMany();
  await testDb.securityEvent.deleteMany();
});

describe('GET /api/me', () => {
  it('returns 401 when there is no session', async () => {
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('returns the current user when a session exists', async () => {
    const user = await userFactory({ displayName: 'Raze' });

    // Manually create a session row + cookie header
    const session = await testDb.session.create({
      data: {
        sessionToken: 'test-token-' + Math.random().toString(36).slice(2),
        userId: user.id,
        expires: new Date(Date.now() + 1000 * 60 * 60),
      },
    });

    // Import NextRequest and craft a request that carries the auth cookie
    const { NextRequest } = await import('next/server');
    const req = new NextRequest('http://localhost/api/me', {
      headers: { cookie: `authjs.session-token=${session.sessionToken}` },
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.id).toBe(user.id);
    expect(body.user.email).toBe(user.email);
  });
});
```

- [ ] **Step 2: Run the test — it should fail**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm test -- tests/integration/auth-me.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create the me route**

File: `src/app/api/me/route.ts`
```ts
import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: { code: 'unauthorized', message: 'Not authenticated' } }, { status: 401 });
  }
}
```

- [ ] **Step 4: Run the test — it should pass**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm test -- tests/integration/auth-me.test.ts
```

Expected: 2 tests pass.

Note: Auth.js cookie name in dev is `authjs.session-token`; in production (HTTPS) it becomes `__Secure-authjs.session-token`. Our test uses the dev name. We'll handle prod names in Phase 1 Task 15 (cookie hardening).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(api): /api/me returns the current user"
```

---

## Task 13: AI capabilities endpoint (returns all-false in Phase 1)

**Files:**
- Create: `src/app/api/ai/capabilities/route.ts`

**Interfaces:**
- Produces: `GET /api/ai/capabilities` returns `{ analyzeClothing: false, suggestOutfits: false, generateTryOn: false }`.

- [ ] **Step 1: Create the route**

File: `src/app/api/ai/capabilities/route.ts`
```ts
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    analyzeClothing: false,
    suggestOutfits: false,
    generateTryOn: false,
  });
}
```

- [ ] **Step 2: Verify by curl after dev server starts**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm run dev &
sleep 4
curl -s http://localhost:3000/api/ai/capabilities
```

Expected JSON: `{"analyzeClothing":false,"suggestOutfits":false,"generateTryOn":false}`

Stop the dev server (Ctrl+C in another terminal, or `kill %1`).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(api): /api/ai/capabilities returns all-false stub"
```

---

## Task 14: shadcn/ui setup + base components

**Files:**
- Create: `components.json`, `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/label.tsx`, `src/components/ui/card.tsx`, `src/components/ui/form.tsx`, `src/lib/utils.ts` (updated), `src/components/ui/toast.tsx`, `src/components/ui/toaster.tsx`, `src/components/ui/sonner.tsx`

**Interfaces:**
- Produces: shadcn/ui primitives (Button, Input, Label, Card, Form) installed; Toaster wired in root layout; consistent design tokens.

- [ ] **Step 1: Install shadcn/ui dependencies**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm install class-variance-authority clsx tailwind-merge lucide-react tailwindcss-animate @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-toast sonner react-hook-form @hookform/resolvers
```

- [ ] **Step 2: Create `components.json`**

File: `components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 3: Create `src/components/ui/button.tsx`**

File: `src/components/ui/button.tsx`
```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-fg hover:bg-accent/90',
        secondary: 'bg-surface-2 text-fg hover:bg-surface-2/80',
        ghost: 'text-fg hover:bg-surface-2',
        outline: 'border border-border bg-bg hover:bg-surface-2',
        destructive: 'bg-danger text-white hover:bg-danger/90',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

- [ ] **Step 4: Create `src/components/ui/input.tsx`**

File: `src/components/ui/input.tsx`
```tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded border border-border bg-bg px-3 py-2 text-sm',
        'placeholder:text-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
```

- [ ] **Step 5: Create `src/components/ui/label.tsx`**

File: `src/components/ui/label.tsx`
```tsx
'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn('text-sm font-medium leading-none text-fg', className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

- [ ] **Step 6: Create `src/components/ui/card.tsx`**

File: `src/components/ui/card.tsx`
```tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl border border-border bg-surface text-fg shadow-sm', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />,
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';
```

- [ ] **Step 7: Create `src/components/ui/toaster.tsx` (Sonner-based)**

File: `src/components/ui/toaster.tsx`
```tsx
'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'bg-surface text-fg border border-border',
          description: 'text-muted',
          actionButton: 'bg-accent text-accent-fg',
        },
      }}
    />
  );
}
```

- [ ] **Step 8: Wire `Toaster` into root layout**

Edit `src/app/layout.tsx` — add import and render:

```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Wardrobe',
  description: 'Your private wardrobe, online.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Verify the dev server still boots and pages render**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm run dev
```

Visit `http://localhost:3000`. Confirm Tailwind styles apply (the `Wardrobe` heading uses `font-display` token). Stop the server.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(ui): shadcn-style base components and toaster"
```

---

## Task 15: Landing page (real, no slop)

**Files:**
- Create: `src/components/marketing/hero.tsx`, `src/components/marketing/feature-grid.tsx`, `src/components/marketing/footer.tsx`, `src/components/marketing/logo.tsx`, `src/app/page.tsx` (rewrite), `src/app/globals.css` (add Inter font import)

**Interfaces:**
- Produces: A landing page with hero, feature grid, and footer. Uses Inter font from `next/font/google`. CTA links to `/register` and `/login`.

- [ ] **Step 1: Install Inter via `next/font`**

Edit `src/app/layout.tsx`:
```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wardrobe — Your private wardrobe, online',
  description:
    'Every piece you own, beautifully organized. Private by default. Built for one person at a time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create `src/components/marketing/logo.tsx`**

File: `src/components/marketing/logo.tsx`
```tsx
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2', className)}>
      <span aria-hidden className="grid h-7 w-7 place-items-center rounded bg-fg text-bg">
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
          <path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v11A1.5 1.5 0 0 1 11.5 15h-7A1.5 1.5 0 0 1 3 13.5v-11Zm2 1h6v1.5H5V3.5Zm0 3h6V7H5v-.5Zm0 3h4v-.5H5V9.5Z" />
        </svg>
      </span>
      <span className="font-display text-base font-semibold tracking-tight">Wardrobe</span>
    </Link>
  );
}
```

- [ ] **Step 3: Create `src/components/marketing/hero.tsx`**

File: `src/components/marketing/hero.tsx`
```tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-content pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Private by default
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Your wardrobe,
            <br />
            quietly organized.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted md:text-xl">
            Every piece you own, in one place. Add clothes in seconds, build outfits, and try
            things on without ever leaving home. No public feed. No strangers browsing.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted">Free for you and your family. Always.</p>
        </div>
      </div>

      {/* Decorative gradient — purely visual, no AI imagery */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-surface-2 to-transparent"
      />
    </section>
  );
}
```

- [ ] **Step 4: Create `src/components/marketing/feature-grid.tsx`**

File: `src/components/marketing/feature-grid.tsx`
```tsx
import { Shirt, Layers, Sparkles, Lock } from 'lucide-react';

const features = [
  {
    icon: Shirt,
    title: 'Your wardrobe, digitised',
    body: 'Snap a photo, drop the details in later. Browse what you own by color, season, or how often you wear it.',
  },
  {
    icon: Layers,
    title: 'Outfits that make sense',
    body: 'Combine tops, bottoms, and shoes into saved looks. Tag them. Favorite them. Reach for them on busy mornings.',
  },
  {
    icon: Sparkles,
    title: 'A stylist in your pocket',
    body: 'Ask for an outfit for a wedding, a date, or a Tuesday. Suggestions are grounded in clothes you already own.',
  },
  {
    icon: Lock,
    title: 'Private. Always.',
    body: 'One person, one account, one wardrobe. Nothing is public by default. Sharing is explicit, per item.',
  },
];

export function FeatureGrid() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="container-content py-20 md:py-28">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Built for one person at a time.
          </h2>
          <p className="mt-3 text-muted">
            A wardrobe is personal. We treat it that way.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <li key={title} className="bg-bg p-6">
              <div className="mb-4 grid h-9 w-9 place-items-center rounded bg-surface-2">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <h3 className="font-display text-base font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `src/components/marketing/footer.tsx`**

File: `src/components/marketing/footer.tsx`
```tsx
import Link from 'next/link';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-content flex flex-col items-start justify-between gap-4 py-10 md:flex-row md:items-center">
        <Logo />
        <nav className="flex gap-6 text-sm text-muted">
          <Link href="/login" className="hover:text-fg">Sign in</Link>
          <Link href="/register" className="hover:text-fg">Get started</Link>
          <a href="mailto:hello@wardrobe.local" className="hover:text-fg">Contact</a>
        </nav>
        <p className="text-xs text-muted">© {new Date().getFullYear()} Wardrobe.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Rewrite `src/app/page.tsx`**

File: `src/app/page.tsx`
```tsx
import { Hero } from '@/components/marketing/hero';
import { FeatureGrid } from '@/components/marketing/feature-grid';
import { Footer } from '@/components/marketing/footer';
import { Logo } from '@/components/marketing/logo';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <header className="container-content flex items-center justify-between py-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link href="/login" className="text-sm text-muted hover:text-fg">Sign in</Link>
          <Link
            href="/register"
            className="rounded bg-fg px-3 py-1.5 text-sm font-medium text-bg hover:bg-fg/90"
          >
            Get started
          </Link>
        </nav>
      </header>
      <main>
        <Hero />
        <FeatureGrid />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 7: Verify the page in a browser**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm run dev
```

Open `http://localhost:3000`. Expect a clean landing page with a hero, a 4-up feature grid, and a footer. No AI-generated imagery, no stock photos, no Lorem text. Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(marketing): landing page with hero, features, footer"
```

---

## Task 16: Auth pages (login, register, forgot-password) and forgot-password endpoint

**Files:**
- Create: `src/app/(auth)/layout.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`, `src/app/(auth)/forgot-password/page.tsx`, `src/components/auth/login-form.tsx`, `src/components/auth/register-form.tsx`, `src/components/auth/password-strength.tsx`, `src/app/api/auth/forgot-password/route.ts`

**Interfaces:**
- Produces: Three pages, three forms (Client Components) posting to the API. Login + register use Server Action OR fetch; in Phase 1 we use fetch with a redirect on success. Forgot-password is a stub that returns 200 and writes a `verification_token` row (email send is stubbed to console).

- [ ] **Step 1: Create the auth layout**

File: `src/app/(auth)/layout.tsx`
```tsx
import Link from 'next/link';
import { Logo } from '@/components/marketing/logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="container-content flex items-center justify-between py-6">
        <Logo />
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
      <footer className="container-content py-6 text-xs text-muted">
        <Link href="/" className="hover:text-fg">← Back home</Link>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/auth/password-strength.tsx`**

File: `src/components/auth/password-strength.tsx`
```tsx
'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export function PasswordStrength({ value }: { value: string }) {
  const { score, label } = useMemo(() => {
    let s = 0;
    if (value.length >= 12) s += 1;
    if (value.length >= 16) s += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) s += 1;
    if (/[0-9]/.test(value)) s += 1;
    if (/[^A-Za-z0-9]/.test(value)) s += 1;
    const labels = ['Too short', 'Weak', 'Okay', 'Good', 'Strong', 'Excellent'];
    return { score: s, label: labels[Math.min(s, 5)] };
  }, [value]);

  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i < score ? 'bg-accent' : 'bg-surface-2',
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted">{value ? label : 'Use 12+ characters with mixed case, a number, and a symbol.'}</p>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/auth/login-form.tsx`**

File: `src/components/auth/login-form.tsx`
```tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    setSubmitting(false);
    if (!result || result.error) {
      toast.error('Invalid email or password.');
      return;
    }
    router.push(from);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs text-muted hover:text-fg">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>
      <p className="text-center text-sm text-muted">
        New here?{' '}
        <Link href="/register" className="text-fg underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
```

- [ ] **Step 4: Create `src/components/auth/register-form.tsx`**

File: `src/components/auth/register-form.tsx`
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrength } from './password-strength';
import Link from 'next/link';

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, username, password, displayName: displayName || undefined }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg =
        body?.error?.message ??
        (res.status === 409
          ? 'That email or username is already taken.'
          : 'Could not create your account. Check your details and try again.');
      toast.error(msg);
      setSubmitting(false);
      return;
    }

    // Auto-login after successful registration
    const result = await signIn('credentials', { email, password, redirect: false });
    setSubmitting(false);
    if (!result || result.error) {
      toast.success('Account created. Please sign in.');
      router.push('/login');
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <p className="text-xs text-muted">3–20 chars · lowercase, numbers, underscores</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="displayName">Display name (optional)</Label>
        <Input
          id="displayName"
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordStrength value={password} />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? 'Creating account…' : 'Create account'}
      </Button>
      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-fg underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
```

- [ ] **Step 5: Create the login page**

File: `src/app/(auth)/login/page.tsx`
```tsx
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = { title: 'Sign in — Wardrobe' };

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted">Sign in to your private wardrobe.</p>
      </div>
      <LoginForm />
    </div>
  );
}
```

- [ ] **Step 6: Create the register page**

File: `src/app/(auth)/register/page.tsx`
```tsx
import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = { title: 'Create account — Wardrobe' };

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Create your wardrobe</h1>
        <p className="text-sm text-muted">It only takes a minute.</p>
      </div>
      <RegisterForm />
    </div>
  );
}
```

- [ ] **Step 7: Create the forgot-password page and endpoint**

File: `src/app/(auth)/forgot-password/page.tsx`
```tsx
import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = { title: 'Reset password — Wardrobe' };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted">
          We&apos;ll email you a link if an account exists.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
```

File: `src/components/auth/forgot-password-form.tsx`
```tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSubmitting(false);
    // Always succeed (no enumeration)
    if (res.ok) {
      setSent(true);
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-border bg-surface-2 p-4 text-sm">
        If an account exists for <span className="font-medium">{email}</span>, we&apos;ve sent a reset link.
        Check your inbox.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? 'Sending…' : 'Send reset link'}
      </Button>
    </form>
  );
}
```

File: `src/app/api/auth/forgot-password/route.ts`
```ts
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { forgotPasswordSchema } from '@/lib/validation/auth';
import { logSecurityEvent } from '@/lib/audit';
import crypto from 'node:crypto';

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return errorResponse(400, 'validation_error', 'Invalid JSON body');
  }

  const parsed = forgotPasswordSchema.safeParse(json);
  if (!parsed.success) {
    return errorResponse(400, 'validation_error', 'Invalid email');
  }

  const { email } = parsed.data;
  const user = await db.user.findUnique({ where: { email }, select: { id: true } });

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await db.verificationToken.create({
      data: { identifier: `pwreset:${user.id}`, token: tokenHash, expires },
    });
    // Email send is stubbed in MVP
    // eslint-disable-next-line no-console
    console.info('[email-stub] password reset link', { userId: user.id, token });
  }

  await logSecurityEvent({
    userId: user?.id ?? null,
    eventType: 'auth_register_failure', // reuse event type: pre-login flow
    metadata: { kind: 'forgot_password' },
  });

  return new NextResponse(null, { status: 200 });
}
```

- [ ] **Step 8: Add a `<SessionProvider>` to root layout for `signIn` from `next-auth/react`**

Install `next-auth/react` is part of `next-auth@beta`; no extra package needed.

Edit `src/app/layout.tsx`:
```tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wardrobe — Your private wardrobe, online',
  description:
    'Every piece you own, beautifully organized. Private by default. Built for one person at a time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Verify the pages render**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm run dev
```

- Visit `/login`, `/register`, `/forgot-password` — all render with forms
- Visit `/dashboard` while unauthenticated — should redirect to `/login?from=/dashboard`
- Stop the dev server

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(auth): login, register, forgot-password pages and endpoints"
```

---

## Task 17: App shell, dashboard page, and logout

**Files:**
- Create: `src/app/(app)/layout.tsx`, `src/app/(app)/dashboard/page.tsx`, `src/components/app/sidebar.tsx`, `src/components/app/topbar.tsx`, `src/components/auth/logout-button.tsx`

**Interfaces:**
- Produces: Authenticated layout with sidebar + topbar. Dashboard shows the user's name and a "log out" button. Logout calls `signOut()` from `next-auth/react` and redirects to `/`.

- [ ] **Step 1: Create `src/components/app/sidebar.tsx`**

File: `src/components/app/sidebar.tsx`
```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shirt, Layers, Sparkles, Users, UserRound, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Home', icon: UserRound },
  { href: '/wardrobe', label: 'Wardrobe', icon: Shirt, soon: true },
  { href: '/outfits', label: 'Outfits', icon: Layers, soon: true },
  { href: '/try-on', label: 'Try On', icon: Sparkles, soon: true },
  { href: '/connections', label: 'Connections', icon: Users, soon: true },
  { href: '/settings', label: 'Settings', icon: Settings, soon: true },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon, soon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <li key={href}>
              <Link
                href={soon ? '#' : href}
                aria-disabled={soon || undefined}
                className={cn(
                  'flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors',
                  active ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface-2 hover:text-fg',
                  soon && 'pointer-events-none opacity-50',
                )}
                onClick={(e) => soon && e.preventDefault()}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="flex-1">{label}</span>
                {soon && <span className="text-[10px] uppercase tracking-wide text-muted">Soon</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Create `src/components/app/topbar.tsx`**

File: `src/components/app/topbar.tsx`
```tsx
import { LogoutButton } from '@/components/auth/logout-button';
import { Logo } from '@/components/marketing/logo';

export function Topbar({ userLabel }: { userLabel: string }) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-bg px-6 py-4">
      <Logo />
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-muted md:inline">Signed in as {userLabel}</span>
        <LogoutButton />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create `src/components/auth/logout-button.tsx`**

File: `src/components/auth/logout-button.tsx`
```tsx
'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      Sign out
    </Button>
  );
}
```

- [ ] **Step 4: Create the `(app)` layout**

File: `src/app/(app)/layout.tsx`
```tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { Sidebar } from '@/components/app/sidebar';
import { Topbar } from '@/components/app/topbar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect('/login');

  const label = user.displayName ?? user.username;

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] md:grid-cols-[260px_1fr] md:grid-rows-1">
      <div className="border-b border-border md:border-b-0 md:border-r">
        <Topbar userLabel={label} />
      </div>
      <aside className="hidden border-r border-border p-4 md:block">
        <Sidebar />
      </aside>
      <main className="px-6 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 5: Create the dashboard page**

File: `src/app/(app)/dashboard/page.tsx`
```tsx
import { getCurrentUser } from '@/lib/auth/session';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const greeting = user.displayName ?? user.username;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1">
        <p className="text-sm text-muted">Welcome back</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">{greeting}</h1>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold">Your wardrobe is empty</h2>
        <p className="mt-1 text-sm text-muted">
          Once you add a piece of clothing, it&apos;ll show up here. Wardrobe management is coming
          in the next update.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="font-medium">Outfits</h3>
          <p className="mt-1 text-sm text-muted">Build and save looks from your wardrobe.</p>
          <p className="mt-3 text-xs uppercase tracking-wide text-muted">Coming soon</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="font-medium">Try On</h3>
          <p className="mt-1 text-sm text-muted">See how a piece looks on you, virtually.</p>
          <p className="mt-3 text-xs uppercase tracking-wide text-muted">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Add a placeholder `/settings` route so the sidebar link works without 404**

File: `src/app/(app)/settings/page.tsx`
```tsx
export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="text-sm text-muted">Profile, password, and account management — coming soon.</p>
    </div>
  );
}
```

- [ ] **Step 7: Verify end-to-end manually**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm run dev
```

- Visit `/` — landing renders
- Click "Get started" → `/register`
- Register a new account → auto-login → land on `/dashboard`
- Click "Sign out" in topbar → return to `/`
- Visit `/dashboard` while logged out → redirect to `/login`
- Stop the dev server

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(app): authenticated layout, dashboard, logout"
```

---

## Task 18: Security tests — brute force + unauthenticated protected route

**Files:**
- Create: `tests/integration/security/brute-force.test.ts`, `tests/integration/security/unauthenticated-protected-route.test.ts`

**Interfaces:**
- Produces: 5 tests total covering the master spec's required security cases for Phase 1.

- [ ] **Step 1: Create `tests/integration/security/brute-force.test.ts`**

File: `tests/integration/security/brute-force.test.ts`
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { POST as registerPOST } from '@/app/api/auth/register/route';
import { testDb } from '../../helpers/test-db';
import { uniqueEmail, uniqueUsername } from '../../helpers/factories';

function postRegister(body: unknown): Request {
  return new Request('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '9.9.9.9' },
    body: JSON.stringify(body),
  });
}

beforeEach(async () => {
  await testDb.rateLimitEvent.deleteMany();
  await testDb.securityEvent.deleteMany();
  await testDb.user.deleteMany();
});

describe('brute force protection on /api/auth/register', () => {
  it('blocks after the configured number of attempts from the same IP', async () => {
    // Limit is 10/hour; do 10 then expect 11th to be 429
    for (let i = 0; i < 10; i += 1) {
      const res = await registerPOST(
        postRegister({
          email: uniqueEmail(),
          username: uniqueUsername(),
          password: 'StrongPass12345',
        }) as never,
      );
      expect([201, 409]).toContain(res.status);
    }
    const blocked = await registerPOST(
      postRegister({
        email: uniqueEmail(),
        username: uniqueUsername(),
        password: 'StrongPass12345',
      }) as never,
    );
    expect(blocked.status).toBe(429);
  });
});
```

- [ ] **Step 2: Create `tests/integration/security/unauthenticated-protected-route.test.ts`**

File: `tests/integration/security/unauthenticated-protected-route.test.ts`
```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { GET as meGET } from '@/app/api/me/route';
import { testDb } from '../../helpers/test-db';

beforeEach(async () => {
  await testDb.session.deleteMany();
  await testDb.user.deleteMany();
});

describe('unauthenticated access to protected routes', () => {
  it('GET /api/me returns 401 without a session', async () => {
    const res = await meGET();
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 3: Run all security tests**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm run test:security
```

Expected: 2 tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "test(security): brute force + unauthenticated access"
```

---

## Task 19: Playwright e2e (register → dashboard → logout)

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/landing.spec.ts`, `tests/e2e/register-login.spec.ts`, `.github/workflows/ci.yml` (only if user wants CI now; otherwise skip)

**Interfaces:**
- Produces: `npm run test:e2e` runs Playwright. Two specs cover landing page and full register/login/logout flow.

- [ ] **Step 1: Install Playwright**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm install --save-dev @playwright/test
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Create `playwright.config.ts`**

File: `playwright.config.ts`
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

- [ ] **Step 3: Create `tests/e2e/landing.spec.ts`**

File: `tests/e2e/landing.spec.ts`
```ts
import { test, expect } from '@playwright/test';

test('landing page has hero and CTAs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Your wardrobe/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Get started/i }).first()).toBeVisible();
});
```

- [ ] **Step 4: Create `tests/e2e/register-login.spec.ts`**

File: `tests/e2e/register-login.spec.ts`
```ts
import { test, expect } from '@playwright/test';

test('user can register, reach dashboard, and sign out', async ({ page }) => {
  const stamp = Date.now();
  const email = `e2e-${stamp}@example.test`;
  const username = `e2e${stamp.toString(36)}`.slice(0, 20);

  await page.goto('/register');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill('StrongPass12345');
  await page.getByRole('button', { name: /Create account/i }).click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('button', { name: /Sign out/i }).click();
  await expect(page).toHaveURL('/');
});
```

- [ ] **Step 5: Run e2e**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm run test:e2e
```

Expected: 2 specs pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test(e2e): landing, register, dashboard, logout"
```

---

## Task 20: README + final docs

**Files:**
- Modify: `README.md`

**Interfaces:**
- Produces: README updated with run instructions, env vars, test commands.

- [ ] **Step 1: Replace `README.md`**

File: `README.md`
```markdown
# Wardrobe

A private online wardrobe. One account, one wardrobe, one person.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind · shadcn-style UI · Prisma + PostgreSQL · Auth.js v5 · argon2id

## Local setup

```bash
# 1. Use the right Node
nvm use    # or: node --version  (>= 20.11)

# 2. Install
npm install

# 3. Configure env
cp .env.example .env
# Fill in DATABASE_URL, DATABASE_URL_TEST, AUTH_SECRET

# 4. Migrate
npx prisma migrate dev

# 5. Run
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on :3000 |
| `npm run build` | Generate Prisma client + build for production |
| `npm run start` | Run the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (incl. the `no-client-userid` rule) |
| `npm run format` | Prettier |
| `npm test` | Vitest unit + integration |
| `npm run test:security` | The security test suite |
| `npm run test:e2e` | Playwright |

## Env vars

See `.env.example` for the full list. The app refuses to start without `AUTH_SECRET` (≥ 32 chars) or `DATABASE_URL`.

## Documentation

- [Product spec](docs/product-spec.md)
- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [Authentication](docs/authentication.md)
- [Authorization](docs/authorization.md)
- [Storage](docs/storage.md) (Phase 2)
- [AI system](docs/ai-system.md)
- [Virtual try-on](docs/virtual-try-on.md)
- [UI / UX system](docs/ui-system.md)
- [Security](docs/security.md)
- [API](docs/api.md)
- [Testing](docs/testing.md)
- [Roadmap](docs/roadmap.md)
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "docs: README with run instructions and script index"
```

---

## Task 21: Deploy to Vercel (preview)

**Files:** none (Vercel dashboard / CLI)

**Interfaces:**
- Produces: a Vercel preview deployment reachable via a public URL.

- [ ] **Step 1: Install Vercel CLI (optional but recommended)**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
npm install --save-dev vercel
```

- [ ] **Step 2: Create a Neon Postgres database**

- Sign in to https://neon.tech, create a new project named `wardrobe-dev`
- Copy the pooled connection string → set as `DATABASE_URL` in Vercel
- Create a second branch / database named `wardrobe-test` → set as `DATABASE_URL_TEST` (only used in CI)
- Note: Vercel preview branches automatically get a `wardrobe-preview-<branch>` Neon database via the Neon Vercel integration (optional)

- [ ] **Step 3: Push to GitHub**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
git remote add origin git@github.com:YOUR_USERNAME/wardrobe.git
git push -u origin main
```

- [ ] **Step 4: Create Vercel project**

- Go to https://vercel.com/new
- Import the `wardrobe` repo
- Add env vars in **Project Settings → Environment Variables**:
  - `DATABASE_URL` (Neon pooled URL, "Production + Preview")
  - `DATABASE_URL_TEST` (Neon test DB, "Preview" only — optional)
  - `AUTH_SECRET` (32+ random base64 chars)
  - `AUTH_TRUST_HOST` = `true`
  - `APP_URL` = leave blank (Vercel fills `VERCEL_URL` automatically)
- Override the build command if needed: `prisma generate && next build`
- Add a `postinstall` step to ensure Prisma client: in `package.json` add:

```json
  "scripts": {
    "postinstall": "prisma generate"
  }
```

- [ ] **Step 5: Trigger a preview deploy**

Vercel will auto-deploy on push to `main`. Visit the preview URL. Manually test register/login/dashboard/logout.

- [ ] **Step 6: Verify in production**

- Register a real account on the deployed URL
- Sign in, sign out, refresh — session should persist
- Confirm no console errors in Vercel's runtime logs
- Confirm security headers are present:

```bash
curl -sI https://YOUR-PREVIEW-URL.vercel.app/ | grep -iE 'strict-transport|x-frame|content-security|referrer-policy|permissions-policy'
```

Expected: all five present.

- [ ] **Step 7: Commit any remaining changes**

```bash
cd "C:/Users/hiiam/OneDrive/Desktop/Python/Dress Up"
git add -A
git commit --allow-empty -m "chore: phase 1 deployed to vercel preview"
```

---

## Self-Review

**1. Spec coverage:**

- Master spec §1 (core idea) → covered by architecture + product spec
- §2 (account model) → User table in Task 3 schema
- §3 (data ownership) → enforced by `assertOwner` (designed); the `userId` first-arg pattern and `WHERE user_id` filter are documented in `docs/authorization.md`. Phase 1 code: `getCurrentUser()` is the only user-derivation path; lint rule bans client-side `userId`.
- §4 (product experience) → Tailwind + shadcn + design tokens in Tasks 14–15
- §5 (user journey) → Tasks 15–17 implement landing → register → dashboard → logout
- §6 (authentication) → Tasks 5, 9, 11, 12, 16 cover hashing, Auth.js config, register endpoint, me endpoint, login UI
- §7 (database) → Task 3
- §8–§10 (wardrobe, clothing, image storage) → Phase 2; not in Phase 1 by design
- §11 (outfits) → Phase 3
- §12–§15 (AI, try-on) → Phase 5/10; Phase 1 only has the capabilities endpoint (Task 13)
- §16–§20 (social, sharing, permissions, borrowing, privacy) → later phases
- §21 (security) → Tasks 9, 10, 18, plus the `no-client-userid` lint rule
- §22–§23 (frontend structure, responsive) → Tasks 14, 15, 17
- §24 (performance) → image optimization is Phase 2; Phase 1 establishes the patterns
- §25 (accessibility) → Tasks 14, 15, 16: semantic HTML, focus rings, labels, skip-link friendly structure (no skip link yet — add in Phase 4 polish)
- §26 (testing) → Tasks 4, 5, 6, 7, 8, 11, 12, 18, 19
- §27 (project structure) → established in Task 1
- §28 (documentation) → Phase 0 docs already in place
- §29 (tech stack) → locked by user
- §30 (don't over-engineer) → Phase 1 is intentionally small
- §31 (dev philosophy) → security first → data integrity → architecture → maintainability → UX → performance → features. Phase 1 puts security + auth + data integrity first; UX second; features last.
- §32 (start from empty) → confirmed and followed
- §33–§34 (planning first) → Phase 0 done; this plan is Phase 1
- §35 (final principle) → enforced by ownership model, lint rule, and the `getCurrentUser` single-source-of-truth

**2. Placeholder scan:** no TBDs, no "implement later" steps, every code block is complete. ✅

**3. Type consistency:** names match across tasks:
- `getCurrentUser` / `getCurrentUserId` / `tryGetCurrentUserId` are defined in Task 9 and used in Task 12, 17
- `hashPassword` / `verifyPassword` defined in Task 5, used in Tasks 6, 9, 11
- `emailSchema` / `usernameSchema` / `passwordSchema` / `registerSchema` / `loginSchema` / `forgotPasswordSchema` defined in Task 6, used in Tasks 9, 11, 16
- `logSecurityEvent` defined in Task 7, used in Tasks 11, 16
- `checkRateLimit` / `recordRateLimitEvent` defined in Task 8, used in Tasks 11, 18
- `RATE_WINDOWS` keys `authRegisterIp`, `authLoginIp`, `authLoginAccount`, `apiGeneral` defined in Task 8, used in Tasks 11, 18
- `db` (Prisma singleton) from Task 3 used everywhere via `import { db } from '@/lib/db'`
- `env` from Task 1's `src/env.ts` consumed in Tasks 1 and 9
- `cn` from `lib/utils` used in Tasks 14, 15, 16, 17
- `Button` / `Input` / `Label` / `Card` from `components/ui/*` used in Tasks 16, 17
- `Logo` from `marketing/logo` used in Tasks 15, 16, 17
- `Sidebar` / `Topbar` / `LogoutButton` from `app/*` used in Task 17
- `SessionProvider` (from `next-auth/react`) used in Task 16

No naming drift detected.

**Gaps found and fixed inline:**

- Auth.js's `next-auth/react` was referenced in Task 16 — verified that `next-auth@beta` exports it (it does).
- The `/api/auth/forgot-password` route used `auth_register_failure` as a placeholder event type. I added `kind` in metadata to disambiguate; the proper event type `password_reset_requested` will be added when the `SecurityEventType` union is extended in a later phase (Phase 4 polish). For now, the metadata is sufficient for forensic queries.
- Cookie name assumption in Task 12 test (`authjs.session-token`) matches Auth.js v5 dev defaults. Production HTTPS will use `__Secure-authjs.session-token`; the middleware does not pin to a specific name and Auth.js reads both. ✅

---

## Exit Criteria for Phase 1

All must be true:

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes (including the `no-client-userid` rule)
- [ ] `npm test` passes (all unit + integration)
- [ ] `npm run test:security` passes
- [ ] `npm run test:e2e` passes
- [ ] `npm run build` succeeds
- [ ] Vercel preview URL serves the landing page
- [ ] On the deployed URL, a real human can register, see the dashboard, sign out
- [ ] No `process.env` reads outside `src/env.ts` (grep check)
- [ ] No `dangerouslySetInnerHTML` anywhere
- [ ] No user-id derived from request data anywhere — only `getCurrentUserId()` is used
