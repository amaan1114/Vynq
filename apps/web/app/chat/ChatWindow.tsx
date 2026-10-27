"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { getMessages, joinConversation, leaveConversation, sendMessage } from "@/lib/api/chat";
import { getErrorMessage, type Message, type User } from "@/lib/api/types";
import { formatMessageTime, initialOf } from "./format";
import styles from "./chat.module.css";
import { socket } from "@/lib/socket";

interface ChatWindowProps {
  me: User;
  conversationId: string;
  title: string;
  onBack: () => void;
  onSent: () => void;
}

export function ChatWindow({ me, conversationId, title, onBack, onSent }: ChatWindowProps) {
  // Oldest first for display; the API returns newest first
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // No websockets yet: messages load when the chat opens, on the refresh button, and on a page refresh
  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const newestFirst = await getMessages(conversationId);
      setMessages([...newestFirst].reverse());
      setLoadError(null);
    } catch (err) {
      setLoadError(getErrorMessage(err, "Couldn't load messages."));
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);



  useEffect(() => {
    const join = () => {
      joinConversation(conversationId).catch((err) => setLoadError(err.message));
    };

    const onNewMessage = (message: Message) => {
      if (message.conversation_id !== conversationId) return;
      // Skip duplicates, e.g. the HTTP load and the socket racing
      setMessages((current) =>
        current.some((m) => m.message_id === message.message_id) ? current : [...current, message],
      );
      onSent(); // refreshes the sidebar's last message
    };

    // Rooms are lost on reconnect, so join again on every "connect"
    if (socket.connected) join();
    socket.on("connect", join);
    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("connect", join);
      socket.off("new_message", onNewMessage);
      leaveConversation(conversationId);
    };
}, [conversationId, onSent]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const sent = await sendMessage(conversationId, content);
      setMessages((current) => [...current, sent]);
      setDraft("");
      // Pulls the new last message into the chat list
      onSent();
    } catch (err) {
      setSendError(getErrorMessage(err, "Message not sent."));
    } finally {
      setSending(false);
    }
  };

  return (
    <section className={styles.chat}>
      <header className={styles.chatHeader}>
        <button type="button" className={styles.backButton} onClick={onBack} aria-label="Back to chats">
          ‹
        </button>
        <span className={styles.avatar}>{initialOf(title)}</span>
        <h2 className={styles.chatTitle}>{title}</h2>
        <button
          type="button"
          className={styles.utilityButton}
          onClick={loadMessages}
          disabled={loading}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </header>

      <div className={styles.messages} aria-live="polite">
        {loadError && (
          <p className={styles.listError} role="alert">
            {loadError}
          </p>
        )}
        {!loading && !loadError && messages.length === 0 && (
          <p className={styles.listHint}>No messages yet. Say hello.</p>
        )}
        {messages.map((message) => {
          const mine = message.sender_id === me.id;
          return (
            <div key={message.message_id} className={`${styles.bubbleRow} ${mine ? styles.mine : styles.theirs}`}>
              <div className={styles.bubble}>
                <span>{message.content}</span>
                <time className={styles.bubbleTime} dateTime={message.created_at}>
                  {formatMessageTime(message.created_at)}
                </time>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form className={styles.composer} onSubmit={handleSend}>
        {sendError && (
          <p className={styles.sendError} role="alert">
            {sendError}
          </p>
        )}
        <input
          className={styles.composerInput}
          placeholder="Message"
          aria-label="Message"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary" disabled={sending || !draft.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}
