import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-text-secondary mb-6">Page not found</p>
      <Link href="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
