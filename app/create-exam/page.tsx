"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type TestCase = {
  input: string;
  expected_output: string;
  is_hidden: boolean;
};

type Question = {
  title: string;
  description: string;
  difficulty: string;
  points: number;
  starter_code: string;
  testcases: TestCase[];
};

export default function CreateExamPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        title: "",
        description: "",
        difficulty: "easy",
        points: 100,
        starter_code: "",
        testcases: [],
      },
    ]);
  };

  const addTestCase = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].testcases.push({
      input: "",
      expected_output: "",
      is_hidden: false,
    });
    setQuestions(updated);
  };

  const handleCreateExam = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Not authenticated");
        return;
      }

      // 1️⃣ Create Exam
      const { data: exam, error: examError } = await supabase
        .from("exams")
        .insert([
          {
            title,
            description,
            created_by: user.id,
            is_public: isPublic,
            access_code: isPublic ? null : accessCode,
            time_limit_minutes: timeLimit,
          },
        ])
        .select()
        .single();

      if (examError) throw examError;

      // 2️⃣ Insert Questions
      for (const question of questions) {
        const { data: examTask, error: taskError } = await supabase
          .from("exam_tasks")
          .insert([
            {
              exam_id: exam.id,
              title: question.title,
              description: question.description,
              difficulty: question.difficulty,
              starter_code: question.starter_code,
              points: question.points,
            },
          ])
          .select()
          .single();

        if (taskError) throw taskError;

        // 3️⃣ Insert Testcases
        const testcasesPayload = question.testcases.map((tc, index) => ({
          exam_task_id: examTask.id,
          input: tc.input,
          expected_output: tc.expected_output,
          is_hidden: tc.is_hidden,
          order_index: index,
        }));

        if (testcasesPayload.length > 0) {
          const { error: tcError } = await supabase
            .from("exam_testcases")
            .insert(testcasesPayload);

          if (tcError) throw tcError;
        }
      }

      alert("Exam Created Successfully!");
      router.push(`/exams/${exam.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Exam</h1>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Exam Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-3"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="mb-3">
        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Public Exam
        </label>
      </div>

      {!isPublic && (
        <input
          className="border p-2 w-full mb-3"
          placeholder="Access Code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
        />
      )}

      <input
        type="number"
        className="border p-2 w-full mb-4"
        placeholder="Time Limit (minutes)"
        value={timeLimit}
        onChange={(e) => setTimeLimit(Number(e.target.value))}
      />

      <button
        onClick={addQuestion}
        className="bg-blue-500 text-white px-4 py-2 mb-4"
      >
        Add Question
      </button>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border p-4 mb-4">
          <h2 className="font-semibold mb-2">Question {qIndex + 1}</h2>

          <input
            className="border p-2 w-full mb-2"
            placeholder="Title"
            value={q.title}
            onChange={(e) => {
              const updated = [...questions];
              updated[qIndex].title = e.target.value;
              setQuestions(updated);
            }}
          />

          <textarea
            className="border p-2 w-full mb-2"
            placeholder="Description"
            value={q.description}
            onChange={(e) => {
              const updated = [...questions];
              updated[qIndex].description = e.target.value;
              setQuestions(updated);
            }}
          />

          <textarea
            className="border p-2 w-full mb-2"
            placeholder="Starter Code"
            value={q.starter_code}
            onChange={(e) => {
              const updated = [...questions];
              updated[qIndex].starter_code = e.target.value;
              setQuestions(updated);
            }}
          />

          <input
            type="number"
            className="border p-2 w-full mb-2"
            placeholder="Points"
            value={q.points}
            onChange={(e) => {
              const updated = [...questions];
              updated[qIndex].points = Number(e.target.value);
              setQuestions(updated);
            }}
          />

          <button
            onClick={() => addTestCase(qIndex)}
            className="bg-green-500 text-white px-3 py-1 mb-2"
          >
            Add Testcase
          </button>

          {q.testcases.map((tc, tcIndex) => (
            <div key={tcIndex} className="border p-2 mb-2">
              <textarea
                className="border p-2 w-full mb-1"
                placeholder="Input"
                value={tc.input}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qIndex].testcases[tcIndex].input = e.target.value;
                  setQuestions(updated);
                }}
              />

              <textarea
                className="border p-2 w-full mb-1"
                placeholder="Expected Output"
                value={tc.expected_output}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qIndex].testcases[tcIndex].expected_output =
                    e.target.value;
                  setQuestions(updated);
                }}
              />

              <label>
                <input
                  type="checkbox"
                  checked={tc.is_hidden}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[qIndex].testcases[tcIndex].is_hidden =
                      e.target.checked;
                    setQuestions(updated);
                  }}
                />
                Hidden Testcase
              </label>
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleCreateExam}
        disabled={loading}
        className="bg-purple-600 text-white px-6 py-2"
      >
        {loading ? "Creating..." : "Create Exam"}
      </button>
    </div>
  );
}