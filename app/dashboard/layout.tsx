import Link from "next/link";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserMenu } from "@/components/userMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* HEADER */}
      <header className="w-full border-b">
        <div className="max-w-6xl mx-auto h-16 px-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-tight"
          >
            PyQuest
          </Link>

          <div className="flex items-center gap-4">
            {/* <nav className="hidden md:flex gap-4 text-sm">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/learn" className="hover:underline">
                Learn
              </Link>
              <Link href="/leaderboards" className="hover:underline">
                Leaderboards
              </Link>
              <Link href="/exams" className="hover:underline">
                Exams
              </Link>
            </nav> */}

            <Suspense fallback={null}>
              <UserMenu />
            </Suspense>

            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {children}
      </section>
    </main>
  );
}
