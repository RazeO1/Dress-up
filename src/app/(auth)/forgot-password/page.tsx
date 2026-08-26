import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = { title: 'Reset password — Wardrobe' };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h1 className="font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.02em]">
          Reset your password
        </h1>
        <p className="text-[15px] text-muted">
          We&apos;ll email you a link if an account exists.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
