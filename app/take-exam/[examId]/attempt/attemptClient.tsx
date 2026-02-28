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
    <div className="flex h-screen bg-gray-200">

      {/* LEFT SIDEBAR */}
      <div className="w-72 bg-white shadow-md flex flex-col">

        <div className="p-5 border-b font-semibold text-lg">
          Questions
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              onClick={() => selectTask(task)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedTask?.id === task.id
                  ? "bg-blue-50 border border-blue-400 shadow-sm"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="font-medium text-sm">
                {index + 1}. {task.title}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {task.difficulty} • {task.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT MAIN PANEL */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* PROBLEM DESCRIPTION */}
        <div className="bg-white shadow-sm border-b p-6 max-h-64 overflow-y-auto">
          <h2 className="text-2xl font-bold">
            {selectedTask?.title}
          </h2>

          <p className="mt-4 text-sm text-gray-700 whitespace-pre-line">
            {selectedTask?.description}
          </p>
        </div>

        {/* SAMPLE TESTCASES */}
        <div className="bg-gray-50 border-b p-6 max-h-48 overflow-y-auto">
          <h3 className="font-semibold mb-3">
            Sample Testcases
          </h3>

          {testcases.filter(tc => !tc.is_hidden).length === 0 && (
            <p className="text-sm text-gray-500">
              No sample testcases available.
            </p>
          )}

          {testcases
            .filter(tc => !tc.is_hidden)
            .map((tc) => (
              <div
                key={tc.id}
                className="mb-3 bg-white border rounded-lg p-3 text-sm shadow-sm"
              >
                <p>
                  <strong>Input:</strong> {tc.input}
                </p>
                <p>
                  <strong>Expected:</strong> {tc.expected_output}
                </p>
              </div>
            ))}
        </div>

        {/* EXECUTION RESULTS */}
        {results.length > 0 && (
          <div className="bg-white border-b p-4 text-sm">
            <h3 className="font-semibold mb-2">
              Results
            </h3>

            {results.map((r, i) => (
              <div
                key={i}
                className={`mb-1 ${
                  r.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                Testcase {i + 1}:{" "}
                {r.passed ? "Passed" : "Failed"}
              </div>
            ))}
          </div>
        )}

        {/* EDITOR */}
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
          />
        </div>

        {/* ACTION BAR */}
        <div className="bg-white border-t p-4 flex gap-4 shadow-inner">
          <button
            onClick={handleRun}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Run
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}