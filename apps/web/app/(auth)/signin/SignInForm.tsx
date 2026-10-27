"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { signIn } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/types";
import styles from "../auth.module.css";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      await signIn({ email: email.trim(), password });
      // replace, not push: Back shouldn't return to the sign-in form
      router.replace("/chat");
    } catch (err) {
      // 403 "Email not verified..." comes through here with the backend's message
      setError(getErrorMessage(err));
      setPending(false);
    }
  };

  return (
    <>
      <h1 className={styles.title}>Sign in</h1>
      <p className={styles.subtitle}>Welcome back to Vynq.</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={error ? true : undefined}
          />
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className={styles.footnote}>
        New to Vynq?{" "}
        <Link href="/signup" className="text-link">
          Create an account
        </Link>
      </p>
    </>
  );
}
