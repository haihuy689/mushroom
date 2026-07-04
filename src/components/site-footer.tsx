import Link from "next/link";
import { getRequestLocale } from "@/lib/request-locale";
import { getNavigationLinks, getSiteCopy } from "@/lib/site-data";
import { BRAND_SLOGAN } from "@/lib/storefront-copy";
import { BrandMark } from "./brand-mark";
import styles from "./site-chrome.module.css";

export async function SiteFooter() {
  const locale = await getRequestLocale();
  const siteCopy = getSiteCopy(locale);
  const navigationLinks = getNavigationLinks(locale);

  return (
    <footer className={styles.footerWrap}>
      <div className={styles.footerInner}>
        <div className={styles.footerCard}>
          <div className={styles.footerTop}>
            <div>
              <BrandMark tagline={BRAND_SLOGAN} />
              <p className={styles.footerCopy}>{siteCopy.footerCopy}</p>
            </div>

            <div className={styles.footerMeta}>
              {siteCopy.footerMeta.map((item) => (
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
              {siteCopy.footerGithub}
            </a>
            <a
              href="https://mushroom-theta-five.vercel.app"
              target="_blank"
              rel="noreferrer"
              className={styles.footerLink}
            >
              {siteCopy.footerLiveSite}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
