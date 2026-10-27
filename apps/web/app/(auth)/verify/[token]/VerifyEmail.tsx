"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { verifyEmail } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/api/types";
import styles from "../../auth.module.css";

type Status = { state: "verifying" } | { state: "verified" } | { state: "failed"; message: string };

export function VerifyEmail({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>({ state: "verifying" });
  // Strict mode runs effects twice in dev; only send the request once
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    verifyEmail(token)
      .then(() => setStatus({ state: "verified" }))
      .catch((err) => setStatus({ state: "failed", message: getErrorMessage(err) }));
  }, [token]);

  return (
    <div className={styles.status} aria-live="polite">
      {status.state === "verifying" && (
        <>
          <h1 className={styles.title}>Verifying…</h1>
          <p className={styles.subtitle}>Hang on while we confirm your email.</p>
        </>
      )}

      {status.state === "verified" && (
        <>
          <h1 className={styles.title}>You&apos;re verified</h1>
          <p className={styles.subtitle}>Your email is confirmed. You can sign in now.</p>
          <Link href="/signin" className="btn btn-primary">
            Sign in
          </Link>
        </>
      )}

      {status.state === "failed" && (
        <>
          <h1 className={styles.title}>Link didn&apos;t work</h1>
          <p className={styles.error} role="alert">
            {status.message}
          </p>
          <p className={styles.subtitle}>Signing in sends a fresh verification link if your email isn&apos;t verified yet.</p>
          <Link href="/signin" className="btn btn-secondary">
            Go to sign in
          </Link>
        </>
      )}
    </div>
  );
}
