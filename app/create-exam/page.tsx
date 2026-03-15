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
    setQuestions(prev => [
      ...prev,
      {
        title: "",
        description: "",
        difficulty: "easy",
        points: 100,
        starter_code: "",
        testcases: []
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const addTestCase = (qIndex: number) => {
    setQuestions(prev =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              testcases: [
                ...q.testcases,
                { input: "", expected_output: "", is_hidden: false }
              ]
            }
          : q
      )
    );
  };

  const removeTestCase = (qIndex: number, tcIndex: number) => {
    setQuestions(prev =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              testcases: q.testcases.filter((_, j) => j !== tcIndex)
            }
          : q
      )
    );
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    setQuestions(prev =>
      prev.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    );
  };

  const updateTestCase = (
    qIndex: number,
    tcIndex: number,
    field: keyof TestCase,
    value: any
  ) => {
    setQuestions(prev =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;

        const updatedTC = q.testcases.map((tc, j) =>
          j === tcIndex ? { ...tc, [field]: value } : tc
        );

        return { ...q, testcases: updatedTC };
      })
    );
  };

  const handleCreateExam = async () => {
    try {
      if (!title.trim()) {
        alert("Exam title required");
        return;
      }

      if (questions.length === 0) {
        alert("Add at least one question");
        return;
      }

      setLoading(true);

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      // 1️⃣ Create exam
      const { data: exam, error: examError } = await supabase
        .from("exams")
        .insert({
          title,
          description,
          created_by: user.id,
          is_public: isPublic,
          access_code: isPublic ? null : accessCode,
          time_limit_minutes: timeLimit
        })
        .select()
        .single();

      if (examError) throw examError;

      // 2️⃣ Insert tasks
      const questionPayload = questions.map(q => ({
        exam_id: exam.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        starter_code: q.starter_code,
        points: q.points
      }));

      const { data: insertedQuestions, error: taskError } = await supabase
        .from("exam_tasks")
        .insert(questionPayload)
        .select();

      if (taskError) throw taskError;

      // 3️⃣ Insert testcases
      const testcasePayload: any[] = [];

      insertedQuestions.forEach((task, i) => {
        const q = questions[i];

        q.testcases.forEach((tc, index) => {
          testcasePayload.push({
            exam_task_id: task.id,
            input: tc.input,
            expected_output: tc.expected_output,
            is_hidden: tc.is_hidden,
            order_index: index
          });
        });
      });

      if (testcasePayload.length > 0) {
        const { error } = await supabase
          .from("exam_testcases")
          .insert(testcasePayload);

        if (error) throw error;
      }

      alert("Exam created successfully!");
      router.push(`/exams/${exam.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 text-white">

      <h1 className="text-3xl font-bold">Create Coding Exam</h1>

      {/* Exam Info */}
      <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 space-y-4 backdrop-blur">

        <input
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Exam Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 min-h-[120px] focus:ring-2 focus:ring-blue-500"
          placeholder="Exam Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex flex-wrap gap-6 items-center">

          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Public Exam
          </label>

          {!isPublic && (
            <input
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2"
              placeholder="Access Code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
          )}

          <input
            type="number"
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 w-40"
            placeholder="Time (min)"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">

        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="bg-gray-900/80 border border-gray-700 rounded-xl p-6 space-y-4 backdrop-blur"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">
                Question {qIndex + 1}
              </h2>

              <button
                onClick={() => removeQuestion(qIndex)}
                className="text-red-400 hover:text-red-500"
              >
                Remove
              </button>
            </div>

            <input
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2"
              placeholder="Question Title"
              value={q.title}
              onChange={(e) =>
                updateQuestion(qIndex, "title", e.target.value)
              }
            />

            <textarea
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 min-h-[120px]"
              placeholder="Problem Description"
              value={q.description}
              onChange={(e) =>
                updateQuestion(qIndex, "description", e.target.value)
              }
            />

            <textarea
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 min-h-[140px] font-mono"
              placeholder="Starter Code"
              value={q.starter_code}
              onChange={(e) =>
                updateQuestion(qIndex, "starter_code", e.target.value)
              }
            />

            <div className="flex gap-4">

              <select
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2"
                value={q.difficulty}
                onChange={(e) =>
                  updateQuestion(qIndex, "difficulty", e.target.value)
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <input
                type="number"
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 w-32"
                value={q.points}
                onChange={(e) =>
                  updateQuestion(qIndex, "points", Number(e.target.value))
                }
              />
            </div>

            {/* Testcases */}
            <div className="space-y-4">

              <button
                onClick={() => addTestCase(qIndex)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
              >
                Add Testcase
              </button>

              {q.testcases.map((tc, tcIndex) => (
                <div
                  key={tcIndex}
                  className="border border-gray-700 rounded-lg p-4 bg-gray-800 space-y-2"
                >
                  <textarea
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2"
                    placeholder="Input"
                    value={tc.input}
                    onChange={(e) =>
                      updateTestCase(
                        qIndex,
                        tcIndex,
                        "input",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2"
                    placeholder="Expected Output"
                    value={tc.expected_output}
                    onChange={(e) =>
                      updateTestCase(
                        qIndex,
                        tcIndex,
                        "expected_output",
                        e.target.value
                      )
                    }
                  />

                  <div className="flex justify-between items-center">

                    <label className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        checked={tc.is_hidden}
                        onChange={(e) =>
                          updateTestCase(
                            qIndex,
                            tcIndex,
                            "is_hidden",
                            e.target.checked
                          )
                        }
                      />
                      Hidden
                    </label>

                    <button
                      onClick={() =>
                        removeTestCase(qIndex, tcIndex)
                      }
                      className="text-red-400 hover:text-red-500"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add Question
        </button>

      </div>

      <button
        onClick={handleCreateExam}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
      >
        {loading ? "Creating..." : "Create Exam"}
      </button>

    </div>
  );
}