import Link from "next/link";
import { GlobalNav } from "@/components/GlobalNav";
import { RedirectIfSignedIn } from "@/components/RedirectIfSignedIn";
import styles from "./page.module.css";

// Getting started really is a sequence, so these are numbered
const steps = [
  {
    title: "Create an account",
    body: "Sign up with your email and a password.",
  },
  {
    title: "Confirm your email",
    body: "Open the link we send you. Accounts can't message anyone until they're confirmed.",
  },
  {
    title: "Find someone",
    body: "Search for their exact email address. Your conversation with them opens, and it's the same one every time you come back.",
  },
];

export default function Home() {
  return (
    <>
      <RedirectIfSignedIn />
      <GlobalNav />
      <main>
        <section className={styles.hero}>
          {/* Two lines, two sides of a conversation (DESIGN.md "two voices") */}
          <h1 className={styles.headline}>
            <span className={styles.voiceA}>Just you</span>{" "}
            <span className={styles.voiceB}>and one other person.</span>
          </h1>
          <div className={styles.intro}>
            <p className={styles.lead}>
              Vynq is a messenger for one-to-one conversations. No group chats, no channels, no feed. Find someone by
              their email and start talking.
            </p>
            <div className={styles.ctas}>
              <Link href="/signup" className="btn btn-primary">
                Create an account
              </Link>
              <Link href="/signin" className="btn btn-secondary">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.steps} aria-labelledby="steps-title">
          <h2 id="steps-title" className={styles.sectionTitle}>
            Three steps to your first message
          </h2>
          <ol className={styles.stepList}>
            {steps.map((step) => (
              <li key={step.title} className={styles.step}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Vynq</p>
        <nav className={styles.footerLinks} aria-label="Footer">
          <Link href="/signin">Sign in</Link>
          <Link href="/signup">Create an account</Link>
        </nav>
      </footer>
    </>
  );
}
