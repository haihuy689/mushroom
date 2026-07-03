import Link from "next/link";
import { navigationLinks } from "@/lib/site-data";
import { BrandMark } from "./brand-mark";
import styles from "./site-chrome.module.css";

const footerMeta = [
  "Pi Testnet rollout",
  "Commerce-first architecture",
  "Editorial mushroom content",
];

export function SiteFooter() {
  return (
    <footer className={styles.footerWrap}>
      <div className={styles.footerInner}>
        <div className={styles.footerCard}>
          <div className={styles.footerTop}>
            <div>
              <BrandMark />
              <p className={styles.footerCopy}>
                Mushroom.Pi is being shaped as a Pi-native mushroom storefront
                with testnet checkout, account sign-in, and a blog that gives
                the brand editorial depth around products, routines, and
                mushroom education.
              </p>
            </div>

            <div className={styles.footerMeta}>
              {footerMeta.map((item) => (
                <span key={item} className={styles.metaPill}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.footerLinks}>
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.footerLink}>
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/haihuy689/mushroom"
              target="_blank"
              rel="noreferrer"
              className={styles.footerLink}
            >
              GitHub
            </a>
            <a
              href="https://mushroom-theta-five.vercel.app"
              target="_blank"
              rel="noreferrer"
              className={styles.footerLink}
            >
              Live Site
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
