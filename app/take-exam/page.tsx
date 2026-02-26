"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Exam = {
  id: string;
  title: string;
  description: string;
  is_public: boolean;
  time_limit_minutes: number;
  created_by: string;
  profiles: {
    username: string;
  };
};

export default function TakeExamPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    const { data, error } = await supabase
      .from("exams")
      .select(`
        *,
        profiles(username)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setExams(data as any);
    }

    setLoading(false);
  };

  const handleClick = (examId: string) => {
    router.push(`/take-exam/${examId}`);
  };

  if (loading) return <div className="p-6">Loading exams...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Available Exams</h1>

      {exams.length === 0 && <p>No exams available.</p>}

      <div className="grid gap-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            onClick={() => handleClick(exam.id)}
            className="border p-4 rounded cursor-pointer hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{exam.title}</h2>

              <span
                className={`px-3 py-1 text-sm rounded ${
                  exam.is_public
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {exam.is_public ? "Public" : "Private"}
              </span>
            </div>

            <p className="text-gray-600 mt-2">{exam.description}</p>

            <div className="text-sm text-gray-500 mt-2">
              Created by: {exam.profiles?.username || "Unknown"} | Time Limit:{" "}
              {exam.time_limit_minutes} minutes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}