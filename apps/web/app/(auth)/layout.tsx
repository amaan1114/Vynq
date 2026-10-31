import Link from "next/link";
import styles from "./auth.module.css";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.logo}>
        Vynq
      </Link>
      <main className={styles.card}>{children}</main>
    </div>
  );
}
