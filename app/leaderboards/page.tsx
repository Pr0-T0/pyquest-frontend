"use client";

import { useMemo } from "react";

type User = {
  rank: number;
  name: string;
  xp: number;
  level: number;
};

const leaderboardData: User[] = [
  { rank: 1, name: "glitch", xp: 5200, level: 8 },
  { rank: 2, name: "alex", xp: 4800, level: 7 },
  { rank: 3, name: "sarah", xp: 4500, level: 7 },
  { rank: 4, name: "john", xp: 3900, level: 6 },
  { rank: 5, name: "emma", xp: 3600, level: 6 },
];

export default function LeaderboardPage() {
  const data = useMemo(() => leaderboardData, []);

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400/10 border border-yellow-400/20 shadow-yellow-400/20";
      case 2:
        return "bg-gray-300/10 border border-gray-300/20 shadow-gray-300/20";
      case 3:
        return "bg-orange-400/10 border border-orange-400/20 shadow-orange-400/20";
      default:
        return "bg-white/5 border border-white/10";
    }
  };

  return (
    <div className="min-h-screen w-full text-white px-6 py-10">
      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Leaderboard
        </h1>
        <span className="text-sm text-gray-400">
          Global Rankings
        </span>
      </div>

      {/* Leaderboard Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="grid grid-cols-4 text-gray-400 text-sm mb-4 px-2">
          <span>#</span>
          <span>User</span>
          <span>Level</span>
          <span className="text-right">XP</span>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {data.map((user) => (
            <div
              key={user.rank}
              className={`grid grid-cols-4 items-center px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:bg-white/10 ${getRankStyle(
                user.rank
              )}`}
            >
              {/* Rank */}
              <span className="font-semibold text-lg">
                {user.rank === 1 && "🥇"}
                {user.rank === 2 && "🥈"}
                {user.rank === 3 && "🥉"}
                {user.rank > 3 && user.rank}
              </span>

              {/* Username */}
              <span className="font-medium tracking-wide">
                @{user.name}
              </span>

              {/* Level */}
              <span className="text-gray-300">
                Lv {user.level}
              </span>

              {/* XP */}
              <span className="text-right font-semibold">
                {user.xp.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-6 text-center text-xs text-gray-500">
        Rankings update in real-time
      </div>
    </div>
  );
}