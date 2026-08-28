"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary">
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-text-secondary mb-6">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
