import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = { title: 'Sign in — Wardrobe' };

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h1 className="font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.02em]">
          Welcome back
        </h1>
        <p className="text-[15px] text-muted">Sign in to your private wardrobe.</p>
      </div>
      <LoginForm />
    </div>
  );
}
