"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteLocale } from "@/lib/i18n";
import type { StorefrontCopy } from "@/lib/storefront-copy";
import { LanguageSwitcher } from "./language-switcher";
import { BrandMark } from "./brand-mark";
import { useStorefront } from "./storefront-provider";
import styles from "./site-chrome.module.css";

type HeaderLink = {
  href: string;
  label: string;
};

type SiteHeaderClientProps = {
  locale: SiteLocale;
  navigationLinks: HeaderLink[];
  copy: Pick<
    StorefrontCopy,
    | "account"
    | "accountAria"
    | "brandSlogan"
    | "cart"
    | "cartAria"
    | "guestLabel"
    | "languageAria"
    | "signedInLabel"
  >;
};

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5H6.2L7.3 10.1C7.53 11.05 8.38 11.72 9.36 11.72H17.4C18.34 11.72 19.16 11.11 19.43 10.21L20.45 6.8C20.82 5.57 19.9 4.35 18.62 4.35H8.15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10.1" cy="18.1" r="1.4" fill="currentColor" />
      <circle cx="17.1" cy="18.1" r="1.4" fill="currentColor" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12.2C14.32 12.2 16.2 10.32 16.2 8C16.2 5.68 14.32 3.8 12 3.8C9.68 3.8 7.8 5.68 7.8 8C7.8 10.32 9.68 12.2 12 12.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5.2 19.3C6.55 16.64 9.06 15 12 15C14.94 15 17.45 16.64 18.8 19.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeaderClient({
  locale,
  navigationLinks,
  copy,
}: SiteHeaderClientProps) {
  const pathname = usePathname();
  const { cartCount, hydrated, viewer } = useStorefront();

  const visibleCartCount = hydrated ? cartCount : 0;
  const accountStatus =
    hydrated && viewer ? viewer.username ?? copy.guestLabel : copy.guestLabel;

  return (
    <header className={styles.headerWrap}>
      <div className={styles.headerInner}>
        <div className={styles.headerCard}>
          <Link href="/" className={styles.brandLink}>
            <BrandMark tagline={copy.brandSlogan} />
          </Link>

          <div className={styles.menuRow}>
            <nav className={styles.menuNav} aria-label="Primary">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.navLink}
                  data-active={
                    link.href === "/"
                      ? pathname === link.href
                      : pathname.startsWith(link.href)
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className={styles.iconRail}>
              <Link
                href="/cart"
                className={styles.iconButton}
                aria-label={`${copy.cartAria}: ${visibleCartCount}`}
                title={copy.cart}
              >
                <CartIcon />
                {visibleCartCount > 0 ? (
                  <span className={styles.iconBadge}>
                    {visibleCartCount > 99 ? "99+" : visibleCartCount}
                  </span>
                ) : null}
              </Link>

              <LanguageSwitcher
                currentLocale={locale}
                compact
                ariaLabel={`${copy.languageAria}: ${locale.toUpperCase()}`}
              />

              <Link
                href="/account"
                className={styles.iconButton}
                aria-label={`${copy.accountAria}: ${accountStatus}`}
                title={
                  hydrated && viewer
                    ? `${copy.signedInLabel}: ${accountStatus}`
                    : copy.account
                }
              >
                <AccountIcon />
                {hydrated && viewer ? <span className={styles.iconIndicator} /> : null}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
