"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { UserMenu } from "@/components/userMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-transparent">
      
      {/* HEADER */}
      <header className="w-full">
        <div className="max-w-6xl mx-auto h-20 px-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tight"
          >
            <span className="text-indigo-500">Py</span>Quest
          </Link>

          <div className="flex items-center gap-5">
            <Suspense fallback={null}>
              <UserMenu />
            </Suspense>

            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        {children}
      </section>
    </main>
  );
}