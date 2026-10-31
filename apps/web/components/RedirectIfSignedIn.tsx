"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getMe } from "@/lib/api/auth";

// Signed-in users have no reason to see the landing or auth pages, so send them to their chats.
// Checked on the client because the auth cookies belong to the API's host, which the Next server can't rely on seeing
export function RedirectIfSignedIn({ to = "/chat" }: { to?: string }) {
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then(() => router.replace(to))
      .catch(() => undefined);
  }, [router, to]);

  return null;
}
