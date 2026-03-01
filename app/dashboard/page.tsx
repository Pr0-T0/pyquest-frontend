"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function PyQuestDashboard() {
  const [profile, setProfile] = useState<{
    level: number;
    xp: number;
    streak: number;
    coins: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const NEXT_LEVEL_XP = 1000;

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("level, xp, streak, coins")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        Loading dashboard...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        Profile not found.
      </div>
    );
  }

  /* ---------- ANIMATIONS ---------- */

  const heroAnim = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const slideRight = {
    hidden: { opacity: 0, x: 40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const pop = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  const rotatePop = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    show: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">

      <motion.div
        initial="hidden"
        animate="show"
        className="w-full max-w-[1250px] h-full px-6"
      >
        <div className="h-full aspect-square mx-auto grid grid-cols-4 grid-rows-4 gap-5">

          {/* HERO */}
          <motion.div
            variants={heroAnim}
            className="col-span-2 row-span-2"
          >
            <Card className="h-full p-8 rounded-3xl bg-indigo-500/20 flex flex-col justify-between hover:scale-[1.02] transition">
              <div>
                <h2 className="text-3xl font-bold">Python Learning</h2>
                <p className="text-sm opacity-70">
                  Continue your quests.
                </p>
              </div>
              <Link href="/learn">
                <Button>Continue</Button>
              </Link>
            </Card>
          </motion.div>

          {/* LEVEL + XP */}
          <motion.div variants={slideRight} className="col-span-2">
            <Card className="h-full p-6 rounded-3xl bg-zinc-800 text-white flex flex-col justify-center">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs opacity-70">Level</p>
                  <p className="text-2xl font-bold">{profile.level}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{profile.xp} XP</p>
                  <p className="text-xs opacity-70">
                    {NEXT_LEVEL_XP - profile.xp} to next
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* EXAMS */}
          <motion.div variants={slideLeft} className="col-span-2">
            <Card className="h-full p-6 rounded-3xl bg-violet-500/20 flex flex-col justify-between hover:scale-[1.02] transition">
              <h3 className="font-semibold">Exams</h3>
              <div className="flex gap-3 mt-3">
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
          <motion.div variants={slideUp} className="col-span-2">
            <Card className="h-full p-6 rounded-3xl bg-sky-500/20 flex flex-col justify-between hover:scale-[1.02] transition">
              <h3 className="font-semibold">Leaderboard</h3>
              <Link href="/leaderboards">
                <Button className="w-full mt-3">
                  View Rankings
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* STREAK */}
          <motion.div variants={pop}>
            <Card className="h-full p-6 rounded-3xl bg-amber-400/20 flex items-center justify-center text-center hover:scale-105 transition">
              <div>
                <p className="text-xs opacity-70">Streak</p>
                <p className="text-2xl font-bold">{profile.streak}</p>
              </div>
            </Card>
          </motion.div>

          {/* COINS */}
          <motion.div variants={rotatePop}>
            <Card className="h-full p-6 rounded-3xl bg-yellow-400/20 flex items-center justify-center text-center hover:scale-105 transition">
              <div>
                <p className="text-xs opacity-70">Coins</p>
                <p className="text-2xl font-bold">{profile.coins}</p>
              </div>
            </Card>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}