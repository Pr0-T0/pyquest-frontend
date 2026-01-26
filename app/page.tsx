import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="w-full flex justify-center border-b">
        <div className="w-full max-w-6xl flex items-center justify-between p-6">
          <h1 className="text-xl font-bold">PyQuest</h1>

          <div className="flex gap-4 text-sm">
            <Link href="/auth/login" className="px-4 py-2 rounded bg-primary text-primary-foreground">
              Login
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-4 py-2 rounded bg-primary text-primary-foreground"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            Learn Python the fun way.
          </h2>

          <p className="text-muted-foreground text-lg">
            Level up your Python skills through challenges, quests, and real
            code — not boring lectures.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="px-6 py-3 rounded-md bg-primary text-primary-foreground text-lg"
            >
              Start Playing
            </Link>

            <Link
              href="/auth/login"
              className="px-6 py-3 rounded-md border text-lg"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground">
        -- add some tagline --
      </footer>
    </main>
  );
}
