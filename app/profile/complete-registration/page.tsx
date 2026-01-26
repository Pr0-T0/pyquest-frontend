"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteRegistration() {
  const supabase = createClient();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!username.trim()) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    setLoading(false);

    if (!error) {
      router.replace("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">
          Complete your profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          Just one last step before you enter the dashboard.
        </p>

        <div className="space-y-2 mb-6">
          <label
            htmlFor="username"
            className="text-sm font-medium"
          >
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. sarath_dev"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none
                       focus:ring-2 focus:ring-black/20 focus:border-black
                       transition"
          />
        </div>

        <button
          onClick={submit}
          disabled={loading || !username.trim()}
          className="w-full rounded-md bg-black text-white py-2 text-sm font-medium
                     hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
