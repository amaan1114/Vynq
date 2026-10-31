"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getMe, signOut } from "@/lib/api/auth";
import { getConversations } from "@/lib/api/conversations";
import { getErrorMessage, type Conversation, type User } from "@/lib/api/types";
import { ChatWindow } from "./ChatWindow";
import { Sidebar } from "./Sidebar";
import { socket } from "@/lib/socket";

import styles from "./chat.module.css";

export function ChatApp() {
  const router = useRouter();
  // The open conversation lives in the URL so a page refresh reopens it
  const selectedId = useSearchParams().get("c");

  const [me, setMe] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [listError, setListError] = useState<string | null>(null);




  const loadConversations = useCallback(async () => {
    try {
      setConversations(await getConversations());
      setListError(null);
    } catch (err) {
      setListError(getErrorMessage(err, "Couldn't load your chats."));
    }
  }, []);

  useEffect(() => {
    // getMe goes through the refresh interceptor, so this only fails when the refresh token is gone too
    getMe()
      .then((user) => {
        setMe(user);
        return loadConversations();
      })
      .catch(() => router.replace("/signin"));
  }, [router, loadConversations]);



  useEffect(() => {
    if (!me) return;
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [me]);


  const selectConversation = (conversationId: string | null) => {
    router.replace(conversationId ? `/chat?c=${encodeURIComponent(conversationId)}` : "/chat");
  };

  const handleSignOut = async () => {
    // Leave either way; if the request failed the cookies still expire on their own
    await signOut().catch(() => undefined);
    router.replace("/");
  };

  if (!me) {
    return <div className={styles.loading}>Loading…</div>;
  }

  const selected = conversations.find((c) => c.conversation_id === selectedId);

  return (
    <div className={`${styles.app} ${selectedId ? styles.hasSelection : ""}`}>
      <Sidebar
        me={me}
        conversations={conversations}
        listError={listError}
        selectedId={selectedId}
        onSelect={selectConversation}
        onConversationCreated={async (conversationId) => {
          await loadConversations();
          selectConversation(conversationId);
        }}
        onSignOut={handleSignOut}
      />
      {selectedId ? (
        <ChatWindow
          key={selectedId}
          me={me}
          conversationId={selectedId}
          title={selected?.conversation_name ?? "Chat"}
          onBack={() => selectConversation(null)}
          onSent={loadConversations}
        />
      ) : (
        <section className={styles.empty}>
          <h2 className={styles.emptyTitle}>Your messages</h2>
          <p className={styles.emptyText}>Pick a chat on the left, or search for someone by email to start one.</p>
        </section>
      )}
    </div>
  );
}
