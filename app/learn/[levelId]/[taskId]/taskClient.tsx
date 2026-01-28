"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";

type Task = {
  id: number;
  level_id: number;
  title: string;
  description: string | null;
  difficulty: string;
  xp_reward: number;
  starter_code: string | null;
};

export default function TaskClient() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();

  const levelId = Number(params.levelId);
  const taskId = Number(params.taskId);

  const [task, setTask] = useState<Task | null>(null);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState<"task" | "tests">("task");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      /* 1. Auth guard */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      /* 2. Progression guard */
      const { data: profile } = await supabase
        .from("profiles")
        .select("level")
        .eq("id", user.id)
        .single();

      if (!profile || profile.level !== levelId) {
        router.push("/learn");
        return;
      }

      /* 3. Fetch task */
      const { data: task } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .eq("level_id", levelId)
        .single();

      if (!task) {
        router.push(`/learn/${levelId}`);
        return;
      }

      setTask(task);
      setCode(task.starter_code || "");
      setLoading(false);
    }

    load();
  }, []);

  if (loading || !task) return null;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b px-6 py-3 font-semibold">
        Level {levelId} · Task {task.id} · {task.title}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-[40%] border-r flex flex-col">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 text-sm ${
                activeTab === "task" ? "border-b-2 border-primary" : ""
              }`}
              onClick={() => setActiveTab("task")}
            >
              Task
            </button>
            <button
              className={`px-4 py-2 text-sm ${
                activeTab === "tests" ? "border-b-2 border-primary" : ""
              }`}
              onClick={() => setActiveTab("tests")}
            >
              Testcases
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 overflow-y-auto text-sm space-y-3">
            {activeTab === "task" ? (
              <>
                <h2 className="font-semibold text-base">{task.title}</h2>
                <p>{task.description}</p>

                <p className="text-muted-foreground text-xs mt-2">
                  Difficulty: {task.difficulty} · XP: {task.xp_reward}
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">Sample Testcases</p>
                <pre className="bg-muted p-3 rounded text-xs">
Input:
(example input)

Output:
(expected output)
                </pre>

                <p className="text-muted-foreground text-xs">
                  Additional hidden testcases will be run on submission.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right Panel — Monaco Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark" //add conditional rendering later
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              lineNumbers: "on",
              tabSize: 4,
              insertSpaces: true,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
            }}
          />
        </div>
      </div>

      {/* Action Bar */}
      <div className="border-t px-6 py-3 flex gap-3">
        <Button variant="secondary">Run Code</Button>
        <Button>Submit</Button>
        <Button
          variant="outline"
          onClick={() => setCode(task.starter_code || "")}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
