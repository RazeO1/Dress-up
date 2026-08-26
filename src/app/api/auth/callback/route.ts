import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validation/auth';
import { logSecurityEvent } from '@/lib/audit';
import { checkRateLimit, recordRateLimitEvent } from '@/lib/rate-limit';

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
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

  const rl = await checkRateLimit({ key: `ip:${ip}`, endpoint: 'authLoginIp' });
  if (!rl.allowed) {
    return errorResponse(429, 'rate_limited', 'Too many attempts. Try again shortly.');
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return errorResponse(400, 'validation_error', 'Invalid JSON body');
  }

  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) {
    return errorResponse(400, 'validation_error', 'Invalid input');
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  await recordRateLimitEvent({ key: `ip:${ip}`, endpoint: 'authLoginIp' });

  if (error || !data.user) {
    await logSecurityEvent({
      eventType: 'auth_login_failure',
      ip,
      userAgent: req.headers.get('user-agent'),
      metadata: { email: parsed.data.email },
    });
    return errorResponse(401, 'invalid_credentials', 'Invalid email or password');
  }

  await logSecurityEvent({
    userId: data.user.id,
    eventType: 'auth_login_success',
    ip,
    userAgent: req.headers.get('user-agent'),
  });

  return NextResponse.json({ user: { id: data.user.id, email: data.user.email } });
}
