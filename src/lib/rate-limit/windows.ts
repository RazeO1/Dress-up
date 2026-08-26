export const RATE_WINDOWS = {
  authLoginIp: { windowMs: 15 * 60 * 1000, max: 5 },
  authLoginAccount: { windowMs: 15 * 60 * 1000, max: 10 },
  authRegisterIp: { windowMs: 60 * 60 * 1000, max: 10 },
  apiGeneral: { windowMs: 60 * 1000, max: 60 },
} as const;

export type RateWindow = keyof typeof RATE_WINDOWS;
