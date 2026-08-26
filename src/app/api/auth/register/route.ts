import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { registerSchema } from '@/lib/validation/auth';
import { logSecurityEvent } from '@/lib/audit';
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

  // Reserve username/email in our app table first to surface conflict quickly
  const existing = await db.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { id: true },
  });

  if (existing) {
    await logSecurityEvent({
      eventType: 'auth_register_failure',
      ip,
      metadata: { reason: 'conflict' },
    });
    return errorResponse(409, 'conflict', 'That email or username is already taken.');
  }

  // Create the Supabase auth user
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, displayName: displayName ?? null } },
  });

  if (error || !data.user) {
    await logSecurityEvent({
      eventType: 'auth_register_failure',
      ip,
      metadata: { reason: 'supabase_error', message: error?.message ?? 'unknown' },
    });
    return errorResponse(400, 'registration_failed', 'Could not create your account. Please try again.');
  }

  // Create the app profile row
  await db.user.create({
    data: {
      id: data.user.id,
      email,
      username,
      displayName: displayName ?? null,
    },
  });

  await logSecurityEvent({
    userId: data.user.id,
    eventType: 'auth_register_success',
    ip,
    userAgent: req.headers.get('user-agent'),
  });

  return new NextResponse(null, { status: 201 });
}
