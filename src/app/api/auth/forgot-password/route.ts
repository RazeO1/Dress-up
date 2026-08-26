import { NextResponse, type NextRequest } from 'next/server';
import { forgotPasswordSchema } from '@/lib/validation/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logSecurityEvent } from '@/lib/audit';

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '0.0.0.0'
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip = getIp(req);
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const parsed = forgotPasswordSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: true });
  }

  const supabase = await createSupabaseServerClient();
  // Always return 200 to prevent email enumeration. Supabase sends a recovery email
  // if the user exists. In dev without SMTP configured, no email is actually sent.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${new URL('/reset-password', req.url).origin}/reset-password`,
  });

  await logSecurityEvent({
    eventType: 'password_reset_requested',
    ip,
    metadata: { email: parsed.data.email },
  });

  return NextResponse.json({ ok: true });
}
