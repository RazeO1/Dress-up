"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trash2, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser({
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.full_name || "",
      });
      setName(user.user_metadata?.full_name || "");

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) {
        setName(profile.full_name);
      }
    });
  }, [router]);

  const handleSaveName = async () => {
    if (!user) return;
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ full_name: name, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    await supabase.auth.updateUser({ data: { full_name: name } });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!confirm("This will permanently delete your account. Are you sure?")) return;
    // Note: requires service role; in production use a deletion API
    const supabase = createClient();
    await supabase.from("items").delete().eq("user_id", user.id);
    await supabase.from("outfits").delete().eq("user_id", user.id);
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Profile */}
      <Card className="p-6 mb-4">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <User size={18} />
          Profile
        </h2>
        <div className="space-y-3">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div>
            <label className="text-sm font-medium text-text-secondary mb-1.5 block px-1">Email</label>
            <p className="px-4 py-3 bg-bg-secondary rounded-input text-text-secondary">{user?.email}</p>
          </div>
          <Button onClick={handleSaveName} disabled={!name || name === user?.name}>
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-4 mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold">Appearance</h3>
          <p className="text-sm text-text-secondary">Toggle light or dark mode</p>
        </div>
        <ThemeToggle />
      </Card>

      {/* Logout */}
      <Card className="p-4 mb-4">
        <Button variant="secondary" onClick={handleLogout} fullWidth>
          <LogOut size={18} className="mr-2" />
          Log Out
        </Button>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border border-red-500/20">
        <h2 className="font-bold text-red-500 mb-2">Danger Zone</h2>
        <p className="text-sm text-text-secondary mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="danger" onClick={handleDeleteAccount}>
          <Trash2 size={18} className="mr-2" />
          Delete Account
        </Button>
      </Card>
    </div>
  );
}
