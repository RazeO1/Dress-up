import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="bg-bg-elevated rounded-card shadow-sm divide-y divide-border">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Appearance</h3>
            <p className="text-sm text-text-secondary">Toggle light or dark mode</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="p-4">
          <h3 className="font-semibold mb-2">Account</h3>
          <p className="text-sm text-text-secondary">Manage your account settings</p>
        </div>
      </div>
    </div>
  );
}
