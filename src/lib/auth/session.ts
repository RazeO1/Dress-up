import 'server-only';
import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { UnauthorizedError } from '@/lib/errors';

export interface CurrentUser {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  imageKey: string | null;
}

/**
 * The ONE function that derives the authenticated user from the request.
 * Always call this; never trust a userId from the client.
 *
 * Cached per request via React's `cache` so multiple components don't
 * hit Supabase + Prisma repeatedly.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new UnauthorizedError();
  }

  const profile = await db.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      imageKey: true,
    },
  });

  if (!profile) {
    throw new UnauthorizedError('Session is no longer valid');
  }

  return profile as CurrentUser;
});

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
