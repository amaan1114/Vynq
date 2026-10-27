"use client";

import { useState, type FormEvent } from "react";
import { createConversation } from "@/lib/api/conversations";
import { getErrorMessage, type Conversation, type User, type UserSearchResult } from "@/lib/api/types";
import { searchUsers } from "@/lib/api/users";
import { formatListTime, initialOf } from "./format";
import styles from "./chat.module.css";

interface SidebarProps {
  me: User;
  conversations: Conversation[];
  listError: string | null;
  selectedId: string | null;
  onSelect: (conversationId: string) => void;
  onConversationCreated: (conversationId: string) => Promise<void>;
  onSignOut: () => void;
}

export function Sidebar({
  me,
  conversations,
  listError,
  selectedId,
  onSelect,
  onConversationCreated,
  onSignOut,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  // null = not searching, so the chat list shows instead
  const [results, setResults] = useState<UserSearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [startingWith, setStartingWith] = useState<string | null>(null);

  const clearSearch = () => {
    setQuery("");
    setResults(null);
    setSearchError(null);
  };

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      clearSearch();
      return;
    }
    setSearching(true);
    setSearchError(null);
    try {
      // The API matches the full email exactly, and can return yourself
      const users = await searchUsers(trimmed);
      setResults(users.filter((user) => user.id !== me.id));
    } catch (err) {
      setSearchError(getErrorMessage(err, "Search failed."));
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const startConversation = async (user: UserSearchResult) => {
    setStartingWith(user.id);
    setSearchError(null);
    try {
      // Returns the existing conversation if the two of you already have one
      const conversation = await createConversation(user.id);
      clearSearch();
      await onConversationCreated(conversation.conversation_id);
    } catch (err) {
      setSearchError(getErrorMessage(err, "Couldn't start the chat."));
    } finally {
      setStartingWith(null);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <header className={styles.sidebarHeader}>
        <div>
          <h1 className={styles.sidebarTitle}>Chats</h1>
          <p className={styles.me}>{me.name ?? me.email}</p>
        </div>
        <button type="button" className={styles.utilityButton} onClick={onSignOut}>
          Sign out
        </button>
      </header>

      <form className={styles.search} onSubmit={handleSearch} role="search">
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search by email"
          aria-label="Search users by email"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value) clearSearch();
          }}
        />
      </form>

      <div className={styles.list}>
        {results !== null || searching ? (
          <>
            <p className={styles.listLabel}>{searching ? "Searching…" : "People"}</p>
            {searchError && (
              <p className={styles.listError} role="alert">
                {searchError}
              </p>
            )}
            {!searching && results?.length === 0 && !searchError && (
              <p className={styles.listHint}>No one with that exact email. Check the full address.</p>
            )}
            {results?.map((user) => (
              <button
                key={user.id}
                type="button"
                className={styles.row}
                onClick={() => startConversation(user)}
                disabled={startingWith !== null}
              >
                <span className={styles.avatar}>{initialOf(user.name ?? user.email)}</span>
                <span className={styles.rowText}>
                  <span className={styles.rowName}>{user.name ?? user.email}</span>
                  <span className={styles.rowPreview}>
                    {startingWith === user.id ? "Opening chat…" : user.name ? user.email : "Start a chat"}
                  </span>
                </span>
              </button>
            ))}
            <button type="button" className={`text-link ${styles.backToChats}`} onClick={clearSearch}>
              Back to chats
            </button>
          </>
        ) : (
          <>
            {listError && (
              <p className={styles.listError} role="alert">
                {listError}
              </p>
            )}
            {!listError && conversations.length === 0 && (
              <p className={styles.listHint}>No chats yet. Search for someone by email to start one.</p>
            )}
            {conversations.map((conversation) => (
              <button
                key={conversation.conversation_id}
                type="button"
                className={`${styles.row} ${conversation.conversation_id === selectedId ? styles.rowActive : ""}`}
                onClick={() => onSelect(conversation.conversation_id)}
                aria-current={conversation.conversation_id === selectedId ? "true" : undefined}
              >
                <span className={styles.avatar}>{initialOf(conversation.conversation_name)}</span>
                <span className={styles.rowText}>
                  <span className={styles.rowTop}>
                    <span className={styles.rowName}>{conversation.conversation_name ?? "Unknown user"}</span>
                    <span className={styles.rowTime}>{formatListTime(conversation.last_message_at)}</span>
                  </span>
                  <span className={styles.rowPreview}>{conversation.last_message ?? "No messages yet"}</span>
                </span>
              </button>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
