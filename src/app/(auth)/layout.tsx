export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFF8F0]">
      <header className="border-b-2 border-[#1A1A1A]">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <a href="/" className="font-display text-2xl font-bold tracking-tight text-[#1A1A1A]">
            TAG
          </a>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">{children}</main>
    </div>
  )
}
