import Link from "next/link";
import { navigationLinks } from "@/lib/site-data";
import { BrandMark } from "./brand-mark";
import styles from "./site-chrome.module.css";

export function SiteHeader() {
  return (
    <header className={styles.headerWrap}>
      <div className={styles.headerInner}>
        <div className={styles.headerCard}>
          <Link href="/" className={styles.brandLink}>
            <BrandMark />
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
            <Link href="/shop" className={styles.headerAction}>
              Open Storefront
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
