"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">
        Level {levelId} · Tasks
      </h1>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <Card key={task.id}>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>
                  Task {index + 1}: {task.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              </div>

              <Link href={`/learn/${levelId}/${task.id}`}>
                <Button>Start</Button>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
