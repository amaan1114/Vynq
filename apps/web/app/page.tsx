import Link from "next/link";
import { GlobalNav } from "@/components/GlobalNav";
import { RedirectIfSignedIn } from "@/components/RedirectIfSignedIn";
import styles from "./page.module.css";

const features = [
  {
    title: "One-to-one, always.",
    body: "Every conversation is between exactly two people. Start one and it's the same thread every time.",
  },
  {
    title: "Find people fast.",
    body: "Search by name or email and you're one tap from a new conversation.",
  },
  {
    title: "Pick up where you left off.",
    body: "Your history is kept in order, newest first, on every device you sign in to.",
  },
];

export default function Home() {
  return (
    <>
      <RedirectIfSignedIn />
      <GlobalNav />
      <main>
        <section className={`${styles.tile} ${styles.light}`}>
          <p className={styles.eyebrow}>Vynq</p>
          <h1 className={styles.hero}>Conversations, without the noise.</h1>
          <p className={styles.lead}>Private messaging for the people who matter.</p>
          <div className={styles.ctas}>
            <Link href="/signup" className="btn btn-primary">
              Get started
            </Link>
            <Link href="/signin" className="btn btn-secondary">
              Sign in
            </Link>
          </div>

          {/* Stands in for product photography until we have screenshots */}
          <div className={styles.device} aria-hidden="true">
            <div className={styles.deviceHeader}>Maya</div>
            <div className={styles.thread}>
              <span className={`${styles.bubble} ${styles.them}`}>Are we still on for Friday?</span>
              <span className={`${styles.bubble} ${styles.me}`}>Yes! 7pm at the usual place.</span>
              <span className={`${styles.bubble} ${styles.them}`}>Perfect. See you there.</span>
            </div>
          </div>
        </section>

        <section className={`${styles.tile} ${styles.dark} on-dark`}>
          <h2 className={styles.display}>Private by design.</h2>
          <p className={styles.leadOnDark}>
            Sessions live in secure, http-only cookies. Every account is verified by email before it can send a
            word.
          </p>
        </section>

        <section className={`${styles.tile} ${styles.parchment}`}>
          <h2 className={styles.display}>Everything you need. Nothing you don&apos;t.</h2>
          <div className={styles.grid}>
            {features.map((feature) => (
              <article key={feature.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardBody}>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.tile} ${styles.dark2} on-dark`}>
          <h2 className={styles.display}>Start a conversation.</h2>
          <p className={styles.leadOnDark}>It takes less than a minute to set up.</p>
          <div className={styles.ctas}>
            <Link href="/signup" className="btn btn-primary">
              Create your account
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>Copyright © {new Date().getFullYear()} Vynq. All rights reserved.</p>
          <nav className={styles.footerLinks} aria-label="Footer">
            <Link href="/signin">Sign in</Link>
            <Link href="/signup">Create account</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
