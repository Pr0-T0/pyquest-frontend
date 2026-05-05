"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/* ================= TYPES ================= */

type Profile = {
  username: string;
  level: number;
  xp: number;
  streak: number;
  coins: number;
};

type Exam = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
};

type Submission = {
  id: string;
  exam_id: string;
  score: number;
  submitted_at: string | null;
  exams: Exam | null;
};

/* ================= PAGE ================= */

export default function ActivityPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [createdExams, setCreatedExams] = useState<Exam[]>([]);
  const [takenExams, setTakenExams] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      /* 🔹 Profile */
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, level, xp, streak, coins")
        .eq("id", user.id)
        .single();

      /* 🔹 Created Exams */
      const { data: created } = await supabase
        .from("exams")
        .select("id, title, description, created_at")
        .eq("created_by", user.id)
        .order("created_at", { ascending: false });

      /* 🔹 Taken Exams (JOIN) */
      const { data: taken } = await supabase
        .from("exam_submissions")
        .select(`
          id,
          exam_id,
          score,
          submitted_at,
          exams (
            id,
            title,
            description,
            created_at
          )
        `)
        .eq("user_id", user.id)
        .not("submitted_at", "is", null)
        .order("submitted_at", { ascending: false });

      /* 🔥 FIX: flatten exams array */
      const formattedTaken: Submission[] =
        taken?.map((t: any) => ({
          id: t.id,
          exam_id: t.exam_id,
          score: t.score,
          submitted_at: t.submitted_at,
          exams: t.exams?.[0] || null,
        })) || [];

      setProfile(profileData);
      setCreatedExams(created || []);
      setTakenExams(formattedTaken);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-400">Loading...</div>;
  }

  /* ================= INSIGHTS ================= */

  const totalAttempts = takenExams.length;

  const avgScore =
    totalAttempts > 0
      ? Math.round(
          takenExams.reduce((acc, cur) => acc + cur.score, 0) /
            totalAttempts
        )
      : 0;

  const bestScore =
    totalAttempts > 0
      ? Math.max(...takenExams.map((s) => s.score))
      : 0;

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-8">

      {/* 🔥 Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Level" value={profile?.level} color="text-blue-400" />
        <StatCard label="XP" value={profile?.xp} color="text-purple-400" />
        <StatCard label="Streak" value={`${profile?.streak} 🔥`} color="text-orange-400" />
        <StatCard label="Coins" value={profile?.coins} color="text-yellow-400" />
        <StatCard label="Attempts" value={totalAttempts} color="text-green-400" />
      </div>

      {/* 📊 Insights */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Average Score" value={avgScore} color="text-cyan-400" />
        <StatCard label="Best Score" value={bestScore} color="text-pink-400" />
      </div>

      {/* 🧩 Two Columns */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Your Exams */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Your Exams</h2>
          {createdExams.length === 0 ? (
            <p className="text-gray-400">No exams created</p>
          ) : (
            <div className="space-y-3">
              {createdExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow"
                >
                  <p className="font-medium text-white">{exam.title}</p>
                  <p className="text-sm text-slate-400">
                    {exam.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Taken Exams */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Taken Exams</h2>
          {takenExams.length === 0 ? (
            <p className="text-gray-400">No exams attempted</p>
          ) : (
            <div className="space-y-3">
              {takenExams.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow"
                >
                  <p className="font-medium text-white">
                    {sub.exams?.title || "Unknown Exam"}
                  </p>
                  <p className="text-sm text-green-400">
                    Score: {sub.score}
                  </p>
                  <p className="text-xs text-slate-400">
                    {sub.submitted_at
                      ? new Date(sub.submitted_at).toLocaleString()
                      : "Not submitted"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: any;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`text-xl font-bold ${color}`}>
        {value ?? 0}
      </p>
    </div>
  );
}