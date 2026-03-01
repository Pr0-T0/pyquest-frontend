"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Level = {
  id: number;
  title: string;
  description: string | null;
  difficulty: string;
};

type LevelProgress = {
  totalTasks: number;
  completedTasks: number;
};

export default function LearnPage() {
  const supabase = createClient();

  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [progress, setProgress] = useState<Record<number, LevelProgress>>({});
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: levels } = await supabase
        .from("levels")
        .select("id,title,description,difficulty")
        .order("id");

      setLevels(levels || []);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setIsAuthed(true);

      const { data: profile } = await supabase
        .from("profiles")
        .select("level")
        .eq("id", user.id)
        .single();

      const unlockedLevel = profile?.level ?? 1;
      setCurrentLevel(unlockedLevel);

      const { data: tasks } = await supabase
        .from("tasks")
        .select("id, level_id");

      const { data: completions } = await supabase
        .from("task_completions")
        .select("task_id")
        .eq("user_id", user.id);

      const completedTaskIds = new Set(
        (completions || []).map((c) => c.task_id)
      );

      const progressMap: Record<number, LevelProgress> = {};

      (tasks || []).forEach((task) => {
        if (!progressMap[task.level_id]) {
          progressMap[task.level_id] = {
            totalTasks: 0,
            completedTasks: 0,
          };
        }

        progressMap[task.level_id].totalTasks += 1;

        if (completedTaskIds.has(task.id)) {
          progressMap[task.level_id].completedTasks += 1;
        }
      });

      setProgress(progressMap);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return null;

  /* ---------------- Animations ---------------- */

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
  <div className="max-w-5xl mx-auto px-6 py-16">

    <h1 className="text-4xl font-bold mb-16 text-center">
      Your Learning Journey
    </h1>

    <div className="relative">

      {/* Vertical line */}
      <div
        className="
          absolute
          top-0
          bottom-0
          w-[4px]
          bg-muted
          left-4
          md:left-1/2
          md:-translate-x-1/2
        "
      />

      <div className="space-y-16">
        {levels.map((level, index) => {
          const levelProgress = progress[level.id];
          const total = levelProgress?.totalTasks ?? 0;
          const completed = levelProgress?.completedTasks ?? 0;
          const percent =
            total > 0 ? Math.round((completed / total) * 100) : 0;

          const isCompleted =
            isAuthed && currentLevel !== null && level.id < currentLevel;

          const isCurrent =
            isAuthed && currentLevel !== null && level.id === currentLevel;

          const isLocked =
            isAuthed && currentLevel !== null
              ? level.id > currentLevel
              : !isAuthed;

          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`
                relative
                flex
                flex-col
                md:flex-row
                ${isLeft ? "md:justify-start" : "md:justify-end"}
              `}
            >
              {/* Node */}
              <div
                className={`
                  absolute
                  left-4
                  md:left-1/2
                  md:-translate-x-1/2
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-sm
                  font-bold
                  border
                  shadow
                  ${
                    isCompleted
                      ? "bg-green-500 text-white border-green-500"
                      : isCurrent
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "bg-background border-muted"
                  }
                `}
              >
                {level.id}
              </div>

              {/* Card */}
              <div
                className={`
                  mt-14 md:mt-0
                  ml-14 md:ml-0
                  md:w-[45%]
                  p-6
                  rounded-2xl
                  border
                  shadow-sm
                  transition
                  ${
                    isCurrent
                      ? "border-indigo-500 bg-indigo-500/10"
                      : isCompleted
                      ? "border-green-500 bg-green-500/10"
                      : "border-muted bg-muted/30"
                  }
                  ${isLocked ? "opacity-40" : ""}
                `}
              >
                <h2 className="font-semibold text-lg mb-2">
                  Level {level.id}: {level.title}
                </h2>

                <p className="text-sm text-muted-foreground mb-4">
                  {level.description || "Complete tasks to advance"}
                </p>

                {/* Circular Progress */}
                {isAuthed && total > 0 && (
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12">
                      <svg
                        viewBox="0 0 36 36"
                        className="w-full h-full rotate-[-90deg]"
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-muted"
                        />
                        <motion.circle
                          cx="18"
                          cy="18"
                          r="16"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray="100"
                          initial={{ strokeDashoffset: 100 }}
                          animate={{
                            strokeDashoffset: 100 - percent,
                          }}
                          transition={{ duration: 0.8 }}
                          className={`${
                            isCompleted
                              ? "text-green-500"
                              : isCurrent
                              ? "text-indigo-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                        {percent}%
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {completed} / {total} tasks
                    </div>
                  </div>
                )}

                {/* Button */}
                {isAuthed ? (
                  isCompleted ? (
                    <span className="text-green-600 text-sm font-medium">
                      Completed
                    </span>
                  ) : isCurrent ? (
                    <Link href={`/learn/${level.id}`}>
                      <Button size="sm">Enter Level</Button>
                    </Link>
                  ) : (
                    <Button size="sm" disabled variant="secondary">
                      Locked
                    </Button>
                  )
                ) : (
                  <Link href="/login">
                    <Button size="sm" variant="secondary">
                      Sign in
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);
}