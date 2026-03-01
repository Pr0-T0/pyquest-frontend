"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  const fullText = "Play. Code. Conquer.";
  const [typedText, setTypedText] = useState("");

  // Typing animation
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Properly typed + TS-safe animation
  const fadeUp: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // cubic-bezier (fully valid type)
      },
    },
  };

  return (
    <main className="min-h-screen flex flex-col bg-transparent text-white">
      
      {/* Header */}
      <header className="w-full">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-8">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-indigo-500">Py</span>Quest
          </h1>

          <div className="flex gap-4 text-sm">
            <Link
              href="/auth/login"
              className="px-5 py-2 rounded-lg border border-zinc-700 hover:border-indigo-500 transition"
            >
              Login
            </Link>

            <Link
              href="/auth/sign-up"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition font-medium"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center px-6 py-24">
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-20 items-center">

          {/* Left Side */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              Level Up Your Python Skills.
              <br />
              <span className="text-indigo-500">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
            </h2>

            <p className="text-zinc-400 text-lg max-w-lg">
              Solve real coding challenges. Earn XP. Compete on leaderboards.
              Learn Python by doing — not watching.
            </p>

            <div className="flex gap-6 pt-6">
              <Link
                href="/auth/sign-up"
                className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition text-lg font-semibold shadow-lg shadow-indigo-900/30"
              >
                Start Playing
              </Link>

              <Link
                href="/auth/login"
                className="px-7 py-3 rounded-xl border border-zinc-700 hover:border-indigo-500 transition text-lg"
              >
                I have an account
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Code Preview */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-zinc-900 rounded-2xl p-10 shadow-2xl"
          >
            <div className="text-sm text-zinc-500 mb-6">
              Quest #12: Prime Checker
            </div>

            <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
{`def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True`}
            </pre>

            <div className="mt-8 flex justify-between text-sm">
              <span className="text-green-400">✔ All Tests Passed</span>
              <span className="text-indigo-400">+120 XP</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-32">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-14"
        >
          <div className="bg-zinc-900 rounded-2xl p-10 hover:scale-105 transition duration-300">
            <h3 className="text-xl font-semibold mb-4">Real Challenges</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Practice real-world Python problems with automated test cases.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-10 hover:scale-105 transition duration-300">
            <h3 className="text-xl font-semibold mb-4">XP & Leaderboards</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Earn XP, unlock levels, and compete with other players.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-10 hover:scale-105 transition duration-300">
            <h3 className="text-xl font-semibold mb-4">Timed Quests</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Take on time-limited coding missions and improve under pressure.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center text-xs text-zinc-500">
        Master Python through play.
      </footer>
    </main>
  );
}