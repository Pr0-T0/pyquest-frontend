"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
      /* 1. Fetch levels (PUBLIC) */
      const { data: levels } = await supabase
        .from("levels")
        .select("id,title,description,difficulty")
        .order("id");

      setLevels(levels || []);

      /* 2. Check auth */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setIsAuthed(true);

      /* 3. Fetch profile level */
      const { data: profile } = await supabase
        .from("profiles")
        .select("level")
        .eq("id", user.id)
        .single();

      const unlockedLevel = profile?.level ?? 1;
      setCurrentLevel(unlockedLevel);

      /* 4. Fetch tasks + completions */
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Learning Path</h1>

      {!isAuthed && (
        <div className="mb-6 p-4 border rounded bg-muted">
          <p className="mb-3">
            Sign in to start solving challenges and track your progress.
          </p>
          <Link href="/login">
            <Button>Sign in to start</Button>
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {levels.map((level) => {
          const levelProgress = progress[level.id];
          const total = levelProgress?.totalTasks ?? 0;
          const completed = levelProgress?.completedTasks ?? 0;

          const isCompleted =
            isAuthed && currentLevel !== null && level.id < currentLevel;

          const isCurrent =
            isAuthed && currentLevel !== null && level.id === currentLevel;

          const isLocked =
            isAuthed && currentLevel !== null
              ? level.id > currentLevel
              : !isAuthed;

          return (
            <Card
              key={level.id}
              className={`border ${
                isCurrent
                  ? "border-primary"
                  : isCompleted
                  ? "opacity-80"
                  : "opacity-40"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    Level {level.id}: {level.title}
                  </CardTitle>
                  <CardDescription>
                    {level.description || "Complete all tasks to advance"}
                  </CardDescription>

                  {isAuthed && total > 0 && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      {completed} / {total} tasks completed
                    </p>
                  )}
                </div>

                {isAuthed ? (
                  isCompleted ? (
                    <span className="text-green-600 font-semibold">
                      Completed
                    </span>
                  ) : isCurrent ? (
                    <Link href={`/learn/${level.id}`}>
                      <Button>Continue</Button>
                    </Link>
                  ) : (
                    <Button disabled variant="secondary">
                      Locked
                    </Button>
                  )
                ) : (
                  <Link href="/login">
                    <Button variant="secondary">Sign in</Button>
                  </Link>
                )}
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
