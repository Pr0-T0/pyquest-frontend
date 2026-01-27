"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Level = {
  id: number;
  title: string;
  description: string | null;
  difficulty: string;
  xp_reward: number;
};

export default function LearnPage() {
  const supabase = createClient();

  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      // 1. Get user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 2. Get profile (current level)
      const { data: profile } = await supabase
        .from("profiles")
        .select("level")
        .eq("id", user.id)
        .single();

      setCurrentLevel(profile?.level);

      // 3. Fetch all levels
      const { data: levels } = await supabase
        .from("levels")
        .select("*")
        .order("id");

      setLevels(levels || []);
    }

    load();
  }, []);

  if (!currentLevel) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Learning Path</h1>

      <div className="space-y-4">
        {levels.map((level) => {
          const isCompleted = level.id < currentLevel;
          const isCurrent = level.id === currentLevel;
          const isLocked = level.id > currentLevel;

          return (
            <Card
              key={level.id}
              className={`border ${
                isCurrent
                  ? "border-primary"
                  : isCompleted
                  ? "opacity-70"
                  : "opacity-40"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    Level {level.id}: {level.title}
                  </CardTitle>
                  <CardDescription>
                    {level.description || "Solve the challenge"}
                  </CardDescription>
                </div>

                {isCompleted && (
                  <span className="text-green-600 font-semibold">
                    Completed
                  </span>
                )}

                {isCurrent && (
                  <Link href={`/learn/${level.id}`}>
                    <Button>Start</Button>
                  </Link>
                )}

                {isLocked && (
                  <Button disabled variant="secondary">
                    Locked
                  </Button>
                )}
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
