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

  const isIp = opts.key.startsWith('ip:');
  const keyValue = isIp ? opts.key.slice(3) : null;

  const whereClause = isIp
    ? { endpoint: opts.endpoint, ip: keyValue, createdAt: { gte: since } }
    : { endpoint: opts.endpoint, userId: opts.key.startsWith('user:') ? opts.key.slice(5) : null, createdAt: { gte: since } };

  const used = await db.rateLimitEvent.count({ where: whereClause });
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
