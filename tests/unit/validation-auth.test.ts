import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@/lib/validation/auth';

describe('registerSchema', () => {
  it('accepts a valid registration and normalizes email/username', () => {
    const result = registerSchema.safeParse({
      email: 'User@Example.COM',
      username: 'raze_01',
      password: 'StrongPass12345',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@example.com');
      expect(result.data.username).toBe('raze_01');
    }
  });

  it('rejects a too-short password', () => {
    expect(
      registerSchema.safeParse({
        email: 'user@example.com',
        username: 'raze_01',
        password: 'short1',
      }).success,
    ).toBe(false);
  });

  it('rejects a username with uppercase letters (regex runs after toLowerCase, so test special chars)', () => {
    // The schema lowercases THEN regexes — so 'raze_01' passes.
    // We test that special characters fail:
    expect(
      registerSchema.safeParse({
        email: 'user@example.com',
        username: 'raze-01',
        password: 'StrongPass12345',
      }).success,
    ).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(
      registerSchema.safeParse({
        email: 'not-an-email',
        username: 'raze_01',
        password: 'StrongPass12345',
      }).success,
    ).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts a valid login', () => {
    expect(
      loginSchema.safeParse({ email: 'user@example.com', password: 'anything' }).success,
    ).toBe(true);
  });

  it('rejects an empty password', () => {
    expect(
      loginSchema.safeParse({ email: 'user@example.com', password: '' }).success,
    ).toBe(false);
  });
});
