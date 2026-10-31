"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { signUp } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/types";
import styles from "../auth.module.css";

const MIN_PASSWORD_LENGTH = 8;

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setPending(true);
    try {
      const trimmedEmail = email.trim();
      await signUp({ email: trimmedEmail, password });
      setSentTo(trimmedEmail);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPending(false);
    }
  };

  // The account can't sign in until the emailed link is opened (it lands on /verify/[token])
  if (sentTo) {
    return (
      <div className={styles.status}>
        <h1 className={styles.title}>Check your inbox</h1>
        <p className={styles.subtitle}>
          We sent a verification link to <strong>{sentTo}</strong>. Open it to finish setting up your account. The
          link expires in 24 hours.
        </p>
        <Link href="/signin" className="btn btn-secondary">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Create your account</h1>
      <p className={styles.subtitle}>One account for all your conversations.</p>

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
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby="password-hint"
          />
          <span id="password-hint" className={styles.hint}>
            At least {MIN_PASSWORD_LENGTH} characters.
          </span>
        </div>

        <div className={styles.field}>
          <label htmlFor="confirm-password" className={styles.label}>
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-invalid={confirmPassword && password !== confirmPassword ? true : undefined}
          />
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className={styles.footnote}>
        Already have an account?{" "}
        <Link href="/signin" className="text-link">
          Sign in
        </Link>
      </p>
    </>
  );
}
