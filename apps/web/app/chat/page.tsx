import type { Metadata } from "next";
import { Suspense } from "react";
import { ChatApp } from "./ChatApp";



export const metadata: Metadata = {
  title: "Chats · Vynq",
};

// ChatApp reads ?c= with useSearchParams, which needs a Suspense boundary to prerender
export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatApp />
    </Suspense>
  );
}
