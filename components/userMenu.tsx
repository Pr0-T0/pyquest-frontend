"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const supabase = createClient();
  const router = useRouter();

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (!profile?.username) {
        router.replace("/profile/complete-registration");
        return;
      }

      setUsername(profile.username);
    }

    loadProfile();
  }, [router, supabase]);

  if (!username) return null;

  return (
    <button
      onClick={() => router.push("/profile")}
      className="text-sm font-medium hover:underline"
    >
      @{username}
    </button>
  );
}
