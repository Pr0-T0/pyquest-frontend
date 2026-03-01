"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PyQuestDashboard() {
  const profile = {
    level: 4,
    xp: 860,
    nextLevelXp: 1000,
    streak: 7,
    coins: 320,
  };

  /* ---------------- SAFE ANIMATIONS ---------------- */

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -35 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  const slideRight = {
    hidden: { opacity: 0, x: 35 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  const pop = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">

      {/* ================= MOBILE ================= */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md space-y-5 md:hidden py-6"
      >
        <motion.div variants={fadeUp}>
          <Card className="p-6 rounded-3xl bg-indigo-500/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold">Python Learning</h2>
            <Link href="/learn" className="block mt-4">
              <Button className="w-full">Continue</Button>
            </Link>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={pop}>
            <Card className="p-4 rounded-2xl bg-amber-400/20 text-center">
              <p className="text-xs opacity-70">🔥 Streak</p>
              <p className="text-lg font-bold">{profile.streak}</p>
            </Card>
          </motion.div>

          <motion.div variants={pop}>
            <Card className="p-4 rounded-2xl bg-yellow-400/20 text-center">
              <p className="text-xs opacity-70">💰 Coins</p>
              <p className="text-lg font-bold">{profile.coins}</p>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={slideLeft}>
          <Card className="p-6 rounded-3xl bg-violet-500/20">
            <h3 className="font-semibold">Exams</h3>
            <div className="flex gap-2 mt-4">
              <Link href="/take-exam" className="flex-1">
                <Button className="w-full">Take</Button>
              </Link>
              <Link href="/create-exam" className="flex-1">
                <Button variant="outline" className="w-full">
                  Create
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={slideRight}>
          <Card className="p-6 rounded-3xl bg-sky-500/20">
            <h3 className="font-semibold">Leaderboard</h3>
            <Link href="/leaderboards" className="block mt-4">
              <Button variant="secondary" className="w-full">
                View Rankings
              </Button>
            </Link>
          </Card>
        </motion.div>
      </motion.div>

      {/* ================= DESKTOP SQUARE ================= */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="hidden md:flex w-full justify-center"
      >
        <div
          className="
            w-full
            max-w-[1100px]
            max-h-[85vh]
            aspect-square
            grid
            grid-cols-4
            grid-rows-4
            gap-6
          "
        >
          {/* LEARNING */}
          <motion.div variants={fadeUp} className="col-span-2 row-span-2">
            <Card className="h-full p-10 rounded-3xl bg-indigo-500/20 flex flex-col justify-between hover:scale-[1.02] transition">
              <div>
                <h2 className="text-3xl font-bold">Python Learning</h2>
                <p className="text-sm opacity-70 mt-2">
                  Continue your quests.
                </p>
              </div>
              <Link href="/learn">
                <Button size="lg">Continue</Button>
              </Link>
            </Card>
          </motion.div>

          {/* XP */}
          <motion.div variants={slideRight} className="col-span-2">
            <Card className="h-full p-6 rounded-3xl bg-zinc-800 text-white flex flex-col justify-center">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs opacity-70">Level</p>
                  <p className="text-xl font-bold">{profile.level}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{profile.xp} XP</p>
                  <p className="text-xs opacity-70">
                    {profile.nextLevelXp - profile.xp} to next
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* EXAMS */}
          <motion.div variants={slideLeft} className="col-span-2">
            <Card className="h-full p-6 rounded-3xl bg-violet-500/20 flex flex-col justify-between hover:scale-[1.02] transition">
              <h3 className="text-lg font-semibold">Exams</h3>
              <div className="flex gap-2 mt-4">
                <Link href="/take-exam" className="flex-1">
                  <Button className="w-full">Take</Button>
                </Link>
                <Link href="/create-exam" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Create
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* LEADERBOARD */}
          <motion.div variants={fadeUp} className="col-span-2">
            <Card className="h-full p-6 rounded-3xl bg-sky-500/20 flex flex-col justify-between hover:scale-[1.02] transition">
              <h3 className="text-lg font-semibold">Leaderboard</h3>
              <Link href="/leaderboards">
                <Button variant="secondary" className="w-full mt-4">
                  View Rankings
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* STREAK */}
          <motion.div variants={pop}>
            <Card className="p-4 rounded-2xl bg-amber-400/20 text-center hover:scale-105 transition">
              <p className="text-xs opacity-70">🔥 Streak</p>
              <p className="text-lg font-bold">{profile.streak}</p>
            </Card>
          </motion.div>

          {/* COINS */}
          <motion.div variants={pop}>
            <Card className="p-4 rounded-2xl bg-yellow-400/20 text-center hover:scale-105 transition">
              <p className="text-xs opacity-70">💰 Coins</p>
              <p className="text-lg font-bold">{profile.coins}</p>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}