"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { runCodeAPI } from "@/lib/executor/runCode";

type Testcase = {
  id: number;
  input: string;
  expected_output: string;
  order_index: number;
};



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
  const [testcases, setTestcases] = useState<Testcase[]>([]);

  // Output / execution state
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

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

      const { data: samples} = await supabase
        .from("testcases")
        .select("id,input, expected_output, order_index")
        .eq("task_id", taskId)
        .eq("is_hidden", false)
        .order("order_index");

      setTask(task);
      setCode(task.starter_code || "");
      setTestcases(samples || []);
      setLoading(false);
    }

    load();
  }, []);

  async function runCode() {
    setIsRunning(true);
    setShowOutput(true);
    setOutput("");

    try {
      const result = await runCodeAPI(code);
      console.log(result)

      if (result.success ) {
        setOutput(`Output:\n${result.stdout || "(no output)"}`);
      } else {
        setOutput(
          `Error:\n${result.stderr || "Execution failed"}`
        );
      }
    } catch {
      setOutput(
        "Error:\nCould not connect to execution server."
      );
    } finally {
      setIsRunning(false);
    }
  }

  if (loading || !task) return null;

  return (
    <div className="h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <div className="px-6 py-3 text-sm bg-background border-b border-border/40">
        <span className="font-medium">
          Level {levelId} · {task.title}
        </span>
        <span className="ml-2 text-muted-foreground">
          ({task.difficulty})
        </span>
      </div>

      {/* Main */}
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Left Panel */}
        <div className="w-[36%] bg-background rounded-xl border border-border/40 shadow-sm flex flex-col">
          {/* Tabs */}
          <div className="flex gap-1 p-2 border-b border-border/40">
            {["task", "tests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 text-sm rounded-md transition ${
                  activeTab === tab
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab === "task" ? "Description" : "Testcases"}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto text-sm leading-relaxed space-y-3">
            {activeTab === "task" ? (
              <>
                <h2 className="text-base font-semibold">
                  {task.title}
                </h2>
                <p>{task.description}</p>
                <p className="text-xs text-muted-foreground">
                  XP Reward: {task.xp_reward}
                </p>
              </>
            ) : (
              <>
  <p className="font-medium">Sample Testcases</p>

  {testcases.length === 0 && (
    <p className="text-xs text-muted-foreground">
      No sample testcases available.
    </p>
  )}

  {testcases.map((tc, index) => (
    <div
      key={tc.id}
      className="bg-muted p-3 rounded text-xs space-y-2"
    >
      <p className="font-semibold">
        Testcase {index + 1}
      </p>

      <div>
        <p className="font-medium">Input:</p>
        <pre className="whitespace-pre-wrap">
          {tc.input}
        </pre>
      </div>

      <div>
        <p className="font-medium">Output:</p>
        <pre className="whitespace-pre-wrap">
          {tc.expected_output}
        </pre>
      </div>
    </div>
  ))}

  <p className="text-xs text-muted-foreground">
    Hidden testcases will be used during submission.
  </p>
</>
            )}
          </div>
        </div>

        {/* Right Panel — Editor */}
        <div className="flex-1 bg-background rounded-xl border border-border/40 shadow-sm overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
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

      {/* Output Panel */}
      {showOutput && (
        <div className="mx-4 mb-2 bg-background border border-border/40 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-2 text-sm font-medium border-b border-border/40">
            Output
          </div>
          <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
            {isRunning ? "Running..." : output || "No output"}
          </pre>
        </div>
      )}

      {/* Action Bar */}
      <div className="px-6 py-3 flex justify-end gap-3 bg-background/80 backdrop-blur border-t border-border/40">
        <Button
          variant="secondary"
          onClick={runCode}
          disabled={isRunning}
        >
          {isRunning ? "Running..." : "Run"}
        </Button>
        <Button className="px-6">Submit</Button>
      </div>
    </div>
  );
}
