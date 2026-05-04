"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Editor from "@monaco-editor/react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Task = {
  id: string;
  title: string;
  description: string;
  difficulty: string | null;
  starter_code: string | null;
  points: number;
};

type Testcase = {
  id: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
};

type ExecutionResult = {
  testcaseId: string;
  passed: boolean;
  executionTime?: number;
  error?: string;
};

export default function AttemptClient() {
  const { examId } = useParams<{ examId: string }>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [testcases, setTestcases] = useState<Testcase[]>([]);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;
    loadTasks();
  }, [examId]);

  const loadTasks = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("exam_tasks")
      .select("*")
      .eq("exam_id", examId)
      .order("created_at");

    if (data && data.length > 0) {
      setTasks(data);
      await selectTask(data[0]);
    }

    setLoading(false);
  };

  const selectTask = async (task: Task) => {
    setSelectedTask(task);
    setCode(task.starter_code || "");
    setResults([]);

    const { data } = await supabase
      .from("exam_testcases")
      .select("*")
      .eq("exam_task_id", task.id)
      .order("order_index");

    setTestcases(data || []);
  };

  const handleRun = async () => {
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, testcases }),
      });

      const result = await response.json();
      setResults(result.results || []);
    } catch (error) {
      console.error("Execution error:", error);
    }
  };

  const handleSubmit = () => {
    alert("Submit logic not implemented yet.");
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">
        Loading exam...
      </div>
    );

  return (
  <div className="h-screen flex flex-col bg-gray-100 text-gray-900">

    {/* TOP BAR - QUESTIONS */}
    <div className="bg-white border-b px-4 py-2 flex gap-3 overflow-x-auto">
      {tasks.map((task, index) => (
        <button
          key={task.id}
          onClick={() => selectTask(task)}
          className={`px-4 py-2 rounded text-sm font-medium ${
            selectedTask?.id === task.id
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Q{index + 1}
        </button>
      ))}
    </div>

    {/* MAIN SPLIT */}
    <div className="flex flex-1 overflow-hidden">

      {/* LEFT - DESCRIPTION */}
      <div className="w-1/2 bg-white border-r flex flex-col">

        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">
            {selectedTask?.title}
          </h2>
        </div>

        <div className="p-4 overflow-y-auto text-sm">
          {selectedTask?.description}
        </div>

      </div>

      {/* RIGHT - EDITOR */}
      <div className="w-1/2 flex flex-col">

        <div className="flex-1">
          <Editor
            height="100%"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
          />
        </div>

      </div>
    </div>

    {/* BOTTOM PANEL - TESTCASES + RESULTS */}
    <div className="bg-white border-t p-4 max-h-52 overflow-y-auto">

      <h3 className="font-semibold mb-2">Testcases</h3>

      {testcases.filter(tc => !tc.is_hidden).map(tc => (
        <div key={tc.id} className="mb-2 border rounded p-2 text-sm">
          <p><strong>Input:</strong> {tc.input}</p>
          <p><strong>Expected:</strong> {tc.expected_output}</p>
        </div>
      ))}

      {results.length > 0 && (
        <>
          <h3 className="font-semibold mt-3 mb-1">Results</h3>
          {results.map((r, i) => (
            <div key={i}>
              Testcase {i + 1}:{" "}
              <span className={r.passed ? "text-green-600" : "text-red-600"}>
                {r.passed ? "Passed" : "Failed"}
              </span>
            </div>
          ))}
        </>
      )}
    </div>

    {/* ACTION BAR */}
    <div className="bg-white border-t p-3 flex gap-3">
      <button
        onClick={handleRun}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Run
      </button>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit
      </button>
    </div>
  </div>
);
}