"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      router.push(user ? "/dashboard" : "/login");
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="skeleton w-12 h-12 rounded-full" />
    </div>
  );
}
