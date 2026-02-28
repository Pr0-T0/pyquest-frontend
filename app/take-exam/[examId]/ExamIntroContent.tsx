"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Exam = {
  id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  access_code: string | null;
  time_limit_minutes: number | null;
};

export default function ExamIntroContent() {
  const params = useParams<{ examId: string }>();
  const examId = params?.examId;
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch exam
        const { data: examData, error } = await supabase
          .from("exams")
          .select("*")
          .eq("id", examId)
          .single();

        if (error || !examData) {
          console.error(error);
          setLoading(false);
          return;
        }

        // Fetch number of tasks
        const { count } = await supabase
          .from("exam_tasks")
          .select("*", { count: "exact", head: true })
          .eq("exam_id", examId);

        setExam(examData);
        setQuestionCount(count || 0);
      } catch (err) {
        console.error("Error loading exam:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [examId]);

  const handleStartExam = () => {
    if (!exam) return;

    // Private exam validation
    if (!exam.is_public) {
      if (!accessCode) {
        alert("Please enter access code.");
        return;
      }

      if (accessCode !== exam.access_code) {
        alert("Invalid access code.");
        return;
      }
    }

    router.push(`/take-exam/${examId}/attempt`);
  };

  if (loading) return <div className="p-6">Loading exam...</div>;
  if (!exam) return <div className="p-6">Exam not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">
        {exam.title}
      </h1>

      {/* Description */}
      <p className="text-gray-600 mb-6">
        {exam.description}
      </p>

      {/* Exam Details */}
      <div className="bg-gray-50 border rounded-lg p-6 mb-6 space-y-3">
        <div>
          <strong>Time Limit:</strong>{" "}
          {exam.time_limit_minutes ?? "No limit"} minutes
        </div>

        <div>
          <strong>Total Questions:</strong> {questionCount}
        </div>

        <div>
          <strong>Access Type:</strong>{" "}
          {exam.is_public ? (
            <span className="text-green-600 font-medium">
              Public Exam
            </span>
          ) : (
            <span className="text-red-600 font-medium">
              Private Exam
            </span>
          )}
        </div>
      </div>

      {/* Private Access Code */}
      {!exam.is_public && (
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Enter Access Code
          </label>
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="border p-3 w-full rounded"
            placeholder="Access code"
          />
        </div>
      )}

      {/* Start Button */}
      <button
        onClick={handleStartExam}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
      >
        Start Exam
      </button>
    </div>
  );
}