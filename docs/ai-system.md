# AI System

## Goals

- Define a stable interface so we can swap providers (OpenAI, Anthropic, Replicate, a self-hosted model, etc.) without touching domain code
- Never lie about AI capabilities — if a feature isn't available, the UI says so
- Ground AI outputs in the user's actual wardrobe data when relevant
- Make AI failures non-blocking for the user

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                  Domain Services                           │
│  (wardrobe, outfits, try-on)                               │
│                                                            │
│   "Given the user's wardrobe, suggest an outfit"           │
│   "Analyze this clothing photo and suggest metadata"       │
│   "Generate a try-on image for this person + clothing"     │
└─────────────────────────┬──────────────────────────────────┘
                          │ AI service interface
                          ↓
┌────────────────────────────────────────────────────────────┐
│              server/services/ai/                           │
│                                                            │
│  types.ts          — shared types (no provider leakage)   │
│  interface.ts      — AIProvider interface                  │
│  factory.ts        — picks adapter from env                │
│  index.ts          — service object the rest of app uses   │
│                                                            │
│  adapters/                                                  │
│    StubAdapter.ts    — MVP; returns 'not configured'        │
│    OpenAIAdapter.ts  — future                              │
│    ReplicateAdapter.ts — future                            │
│    TryOnAdapter.ts   — future (specialized)                │
└────────────────────────────────────────────────────────────┘
                          │
                          ↓
                 ┌────────────────┐
                 │  External API  │
                 │  (later)       │
                 └────────────────┘
```

## The Interface

```ts
// server/services/ai/interface.ts

export interface AIProvider {
  /** Classify a clothing image and return suggested metadata. */
  analyzeClothingImage(input: {
    imageUrl: string;        // signed URL to the uploaded image
    userHints?: Record<string, string>;
  }): Promise<ClothingAnalysis>;

  /** Suggest outfits based on a prompt and the user's wardrobe. */
  suggestOutfits(input: {
    userId: string;
    prompt: string;
    wardrobe: WardrobeSnapshot;   // serialized from DB, scoped to user
    constraints?: OutfitConstraints;
  }): Promise<OutfitSuggestion[]>;

  /** Generate a virtual try-on image. */
  generateTryOn(input: {
    personImageUrl: string;
    garmentImageUrl: string;
    prompt?: string;
  }): Promise<TryOnResult>;
}

export interface AIProviderMeta {
  name: string;                // "stub" | "openai" | "replicate"
  capabilities: {
    analyzeClothing: boolean;
    suggestOutfits: boolean;
    generateTryOn: boolean;
  };
}
```

## The Stub Adapter (MVP)

The MVP ships with a single adapter: `StubAdapter`. It implements every method of the interface but returns a clear "not configured" result instead of faking a response.

```ts
// server/services/ai/adapters/StubAdapter.ts

export class StubAdapter implements AIProvider {
  readonly meta: AIProviderMeta = {
    name: 'stub',
    capabilities: {
      analyzeClothing: false,
      suggestOutfits: false,
      generateTryOn: false,
    },
  };

  async analyzeClothingImage(): Promise<ClothingAnalysis> {
    throw new AINotConfiguredError('Clothing analysis is not configured. Set AI_PROVIDER.');
  }
  // ... etc
}
```

The UI calls the service, which calls the adapter. The UI gets back either a real result or a typed `AINotConfiguredError` and renders a clear "this feature is not yet available" message.

**No fake results. No mock data presented as real.**

## Capabilities Endpoint

```
GET /api/ai/capabilities  →  { analyzeClothing, suggestOutfits, generateTryOn }
```

The UI fetches this on dashboard load and conditionally renders features. Disabled features are still listed (so users know they exist) but with a "Coming soon" tag.

## Grounding (when real adapters are added)

The `suggestOutfits` method receives the user's wardrobe as a structured snapshot. The prompt template injects ONLY the items that exist. The model is instructed:

- "Only use items from the provided wardrobe"
- "If the user's request cannot be satisfied, say so"
- "Never invent items, brands, or colors not in the input"

A separate `wardrobe` snapshot type is defined; it includes:

```ts
type WardrobeSnapshot = {
  items: Array<{
    id: string;
    name: string;
    category: string;
    color: string;
    style?: string;
    occasion?: string[];
    season?: string[];
  }>;
  totalCount: number;
};
```

The full image is not sent to the model — only metadata. If we later want to send images for visual matching, we'll do it through a vision-capable adapter with explicit user consent per call.

## Cost Controls (future)

- Per-user daily request cap (default: 50 requests/day for stylist, 10 for analysis)
- Per-user monthly cap (configurable; default: 500 stylist requests)
- All AI requests logged with token counts and provider cost
- Caching: identical prompts within 1 hour return the cached result

These are not in MVP (no real adapter = no cost) but the logging is in place.

## Safety

- No prompt is constructed from user-controlled raw text concatenated into a system prompt. All user text is wrapped as a user message.
- The system prompt is fixed and lives in code (audited).
- Model outputs that violate our schema are rejected; we do not pass unstructured output to the DB.
- For try-on: we **never** send a user's try-on reference image to a third party without an explicit per-call consent prompt in the UI. (Architectural — actual consent UI ships when a real try-on adapter is added.)

## Why these choices

| Choice | Why | Alternatives considered |
|---|---|---|
| Interface + adapters | Swappable; testable; clear capability surface | Tight coupling to one provider (fast to start, painful to change) |
| Stub-only in MVP | Honest; sets the right pattern; no fake features | Mock-but-pretend (anti-pattern) |
| Capabilities endpoint | UI never assumes a feature is live | Hardcoded booleans (lie when stubs ship) |
| Snapshot type for wardrobe | Type-safe grounding; no leakage | Send full DB rows (over-sharing) |
| Per-call consent for try-on | Privacy; aligns with product spec | Implicit consent (faster but riskier) |

## Provider Matrix (planned)

| Provider | Analyze | Stylist | Try-on | Notes |
|---|---|---|---|---|
| Stub (MVP) | ❌ | ❌ | ❌ | Always available; returns not-configured |
| OpenAI | ✅ (vision) | ✅ (gpt-4o) | ❌ | Good for analysis + stylist |
| Anthropic | ✅ (vision) | ✅ (claude) | ❌ | Good for stylist reasoning |
| Replicate (IDM-VTON) | ❌ | ❌ | ✅ | Open try-on model |
| Self-hosted (future) | ✅ | ✅ | ✅ | Highest control, highest ops cost |

The interface is designed so any of these can be added without changing the domain services.
