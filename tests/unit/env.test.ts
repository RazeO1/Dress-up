import { describe, it, expect } from 'vitest';

describe('env loader', () => {
  it('parses without throwing', async () => {
    const { env } = await import('@/env');
    expect(env.NODE_ENV).toBeTruthy();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeTruthy();
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeTruthy();
    expect(env.SUPABASE_SERVICE_ROLE_KEY).toBeTruthy();
  });
});
