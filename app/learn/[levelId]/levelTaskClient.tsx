"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

type Task = {
  id: number;
  title: string;
  description: string | null;
  difficulty: string;
};

export default function LevelTasksClient() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const levelId = Number(params.levelId);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("level")
        .eq("id", user.id)
        .single();

      if (!profile || profile.level !== levelId) {
        router.push("/learn");
        return;
      }

      const { data: tasks } = await supabase
        .from("tasks")
        .select("id,title,description,difficulty")
        .eq("level_id", levelId)
        .order("id");

      setTasks(tasks || []);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return null;

  /* ---------------- Animations ---------------- */

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.06 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">

      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Level {levelId} · Missions
        </h1>

        <Link
          href="/learn"
          className="text-sm text-muted-foreground hover:text-primary transition"
        >
          ← Back to Levels
        </Link>
      </div>

      {/* Mission Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {tasks.map((task, index) => {
          const difficultyStyle =
            task.difficulty === "easy"
              ? "bg-green-500/15 text-green-600 border-green-500/30"
              : task.difficulty === "medium"
              ? "bg-yellow-500/15 text-yellow-600 border-yellow-500/30"
              : "bg-red-500/15 text-red-600 border-red-500/30";

          return (
            <motion.div
              key={task.id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group"
            >
              <Link href={`/learn/${levelId}/${task.id}`}>
                <div
                  className="
                    relative
                    h-full
                    p-6
                    rounded-3xl
                    border
                    bg-muted/40
                    hover:shadow-xl
                    transition-all
                    duration-300
                    cursor-pointer
                    overflow-hidden
                  "
                >
                  {/* Mission Number */}
                  <div className="absolute top-4 right-4 text-xs font-semibold text-muted-foreground">
                    #{index + 1}
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition">
                    {task.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {task.description}
                  </p>

                  {/* Difficulty Badge */}
                  <div
                    className={`
                      inline-block
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      border
                      ${difficultyStyle}
                    `}
                  >
                    {task.difficulty}
                  </div>

                  {/* Hover Start Indicator */}
                  <div className="mt-6 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition">
                    Start Mission →
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}