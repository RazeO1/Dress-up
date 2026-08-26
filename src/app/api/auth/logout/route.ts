import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { logSecurityEvent } from '@/lib/audit';
import { tryGetCurrentUserId } from '@/lib/auth/session';

export async function POST(): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const userId = await tryGetCurrentUserId();
  await supabase.auth.signOut();
  if (userId) {
    await logSecurityEvent({ userId, eventType: 'auth_logout' });
  }
  return NextResponse.json({ ok: true });
}
