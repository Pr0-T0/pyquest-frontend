"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteRegistration() {
  const supabase = createClient();
  const router = useRouter();
  const [username, setUsername] = useState("");

  async function submit() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    if (!error) {
      router.replace("/dashboard");
    }
  }

  return (
    <div className="max-w-md mx-auto py-20">
      <h1 className="text-2xl font-bold mb-4">
        Complete your registration
      </h1>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Choose a username"
        className="border w-full p-2 rounded mb-4"
      />

      <button
        onClick={submit}
        className="w-full bg-black text-white py-2 rounded"
      >
        Continue
      </button>
    </div>
  );
}
