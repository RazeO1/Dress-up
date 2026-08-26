import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = { title: 'Create account — Wardrobe' };

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h1 className="font-display text-[32px] font-semibold leading-[1.1] tracking-[-0.02em]">
          Create your wardrobe
        </h1>
        <p className="text-[15px] text-muted">It only takes a minute.</p>
      </div>
      <RegisterForm />
    </div>
  );
}
