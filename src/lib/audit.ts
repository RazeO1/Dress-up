import { db } from './db';
import { Prisma } from '@prisma/client';

export type SecurityEventType =
  | 'auth_login_success'
  | 'auth_login_failure'
  | 'auth_register_success'
  | 'auth_register_failure'
  | 'auth_logout'
  | 'auth_session_expired'
  | 'rate_limit_exceeded'
  | 'cross_user_access_attempt'
  | 'signed_url_minted'
  | 'password_reset_requested';

export interface SecurityEventInput {
  userId?: string | null;
  eventType: SecurityEventType;
  metadata?: Record<string, unknown> | null;
  ip?: string | null;
  userAgent?: string | null;
}

export async function logSecurityEvent(input: SecurityEventInput): Promise<void> {
  try {
    await db.securityEvent.create({
      data: {
        userId: input.userId ?? null,
        eventType: input.eventType,
        metadata: input.metadata
          ? (input.metadata as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[audit] failed to log security event', { eventType: input.eventType, err });
  }
}
