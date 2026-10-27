import Link from "next/link";
import styles from "./GlobalNav.module.css";

// Only shown to signed-out visitors; signed-in users are redirected to /chat by RedirectIfSignedIn
export function GlobalNav() {
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Vynq
        </Link>
        <nav className={styles.links} aria-label="Account">
          <Link href="/signin" className={styles.link}>
            Sign in
          </Link>
          <Link href="/signup" className={styles.cta}>
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
