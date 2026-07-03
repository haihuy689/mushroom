import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getRequestLocale } from "@/lib/request-locale";
import { getNavigationLinks, getSiteCopy } from "@/lib/site-data";
import { BrandMark } from "./brand-mark";
import styles from "./site-chrome.module.css";

export async function SiteHeader() {
  const locale = await getRequestLocale();
  const siteCopy = getSiteCopy(locale);
  const navigationLinks = getNavigationLinks(locale);

  return (
    <header className={styles.headerWrap}>
      <div className={styles.headerInner}>
        <div className={styles.headerCard}>
          <Link href="/" className={styles.brandLink}>
            <BrandMark tagline={siteCopy.brandTagline} />
          </Link>

          <div className={styles.headerAside}>
            <nav className={styles.nav} aria-label="Primary">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
              <Link href="/shop" className={styles.headerAction}>
                {siteCopy.headerAction}
              </Link>
            </nav>

            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
