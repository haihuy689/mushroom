"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import type { SiteLocale } from "@/lib/i18n";
import type { OrderCenterCopy } from "@/lib/order-center-copy";
import { getOrderStatusCounts } from "@/lib/order-tracking";
import type { PiVerifiedUser } from "@/lib/pi-types";
import type { StorefrontCopy } from "@/lib/storefront-copy";
import { LanguageSwitcher } from "./language-switcher";
import { BrandMark } from "./brand-mark";
import { useStorefront } from "./storefront-provider";
import styles from "./site-chrome.module.css";

type HeaderLink = {
  href: string;
  label: string;
};

type HeaderCopy = Pick<
  StorefrontCopy,
  | "account"
  | "accountAria"
  | "brandSlogan"
  | "cart"
  | "cartAria"
  | "guestLabel"
  | "languageAria"
  | "signInLabel"
  | "signOutLabel"
  | "signedInLabel"
> &
  Pick<
    OrderCenterCopy,
    | "delivered"
    | "latestOrdersTitle"
    | "menuGuestHint"
    | "menuNoOrders"
    | "menuSignedInHint"
    | "orders"
    | "ordersAria"
    | "processing"
    | "shipping"
    | "statusSummaryTitle"
    | "viewAllOrders"
  >;

type SiteHeaderClientProps = {
  locale: SiteLocale;
  navigationLinks: HeaderLink[];
  copy: HeaderCopy;
};

type AccountMenuProps = {
  accountStatus: string;
  cartCount: number;
  copy: HeaderCopy;
  hydrated: boolean;
  orderCount: number;
  orders: Array<{ id: string; createdAt: string }>;
  viewer: PiVerifiedUser | null;
  viewerName: string | null;
};

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.2 8.1V7.3C7.2 4.93 9.13 3 11.5 3C13.87 3 15.8 4.93 15.8 7.3V8.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.6 8.1H17.4C18.17 8.1 18.81 8.69 18.86 9.45L19.43 17.95C19.49 18.81 18.81 19.55 17.95 19.55H5.05C4.19 19.55 3.51 18.81 3.57 17.95L4.14 9.45C4.19 8.69 4.83 8.1 5.6 8.1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.5H20M4 12H20M4 17.5H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

function HeaderNavMenu({
  navigationLinks,
  pathname,
}: {
  navigationLinks: HeaderLink[];
  pathname: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const closeMenu = () => {
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <details ref={detailsRef} className={styles.navMenu}>
      <summary className={styles.menuButton} aria-label="Menu">
        <MenuIcon />
      </summary>

      <nav className={styles.menuPopover} aria-label="Primary">
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
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}

function AccountMenu({
  accountStatus,
  cartCount,
  copy,
  hydrated,
  orderCount,
  orders,
  viewer,
  viewerName,
}: AccountMenuProps) {
  const { signInWithPi, signOut } = useStorefront();
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const isSignedIn = hydrated && Boolean(viewer);
  const orderCounts = hydrated
    ? getOrderStatusCounts(orders)
    : {
        processing: 0,
        shipping: 0,
        delivered: 0,
      };
  const avatarLabel = viewerName?.trim().slice(0, 1).toUpperCase() || "Pi";
  const statusHint = isSignedIn ? copy.menuSignedInHint : copy.menuGuestHint;

  const closeMenu = () => {
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <details ref={detailsRef} className={styles.accountMenu}>
      <summary
        className={`${styles.iconButton} ${styles.accountSummary}`}
        aria-label={`${copy.accountAria}: ${accountStatus}`}
        title={copy.account}
      >
        <AccountIcon />
        {hydrated && (isSignedIn || orderCount > 0) ? (
          <span className={styles.iconIndicator} />
        ) : null}
      </summary>

      <div className={styles.accountPopover}>
        <div className={styles.accountCard}>
          <div className={styles.accountHeader}>
            <span className={styles.accountAvatar}>{avatarLabel}</span>
            <div className={styles.accountIntro}>
              <strong>{accountStatus}</strong>
              <span>{statusHint}</span>
            </div>
          </div>

          <div className={styles.accountStatusBlock}>
            <span className={styles.accountSectionLabel}>
              {copy.statusSummaryTitle}
            </span>
            <div className={styles.accountStatusGrid}>
              <article className={styles.accountStatCard}>
                <strong>{orderCounts.processing}</strong>
                <span>{copy.processing}</span>
              </article>
              <article className={styles.accountStatCard}>
                <strong>{orderCounts.shipping}</strong>
                <span>{copy.shipping}</span>
              </article>
              <article className={styles.accountStatCard}>
                <strong>{orderCounts.delivered}</strong>
                <span>{copy.delivered}</span>
              </article>
            </div>
          </div>

          <div className={styles.accountLinkList}>
            <Link
              href="/account"
              className={styles.accountLinkRow}
              onClick={closeMenu}
            >
              <span>{copy.account}</span>
              <span className={styles.accountLinkMeta}>
                {isSignedIn ? copy.signedInLabel : copy.guestLabel}
              </span>
            </Link>
            <Link
              href="/orders"
              className={styles.accountLinkRow}
              onClick={closeMenu}
            >
              <span>{copy.orders}</span>
              <span className={styles.accountLinkMeta}>{orderCount}</span>
            </Link>
            <Link
              href="/cart"
              className={styles.accountLinkRow}
              onClick={closeMenu}
            >
              <span>{copy.cart}</span>
              <span className={styles.accountLinkMeta}>{cartCount}</span>
            </Link>
          </div>

          <div className={styles.accountFooterRow}>
            {isSignedIn ? (
              <>
                <span>
                  {orderCount > 0 ? copy.latestOrdersTitle : copy.menuNoOrders}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    void signOut();
                  }}
                >
                  {copy.signOutLabel}
                </button>
              </>
            ) : (
              <>
                <span>{copy.menuGuestHint}</span>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    void signInWithPi();
                  }}
                >
                  {copy.signInLabel}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </details>
  );
}

export function SiteHeaderClient({
  locale,
  navigationLinks,
  copy,
}: SiteHeaderClientProps) {
  const pathname = usePathname();
  const { cartCount, hydrated, orders, viewer } = useStorefront();

  const visibleCartCount = hydrated ? cartCount : 0;
  const visibleOrderCount = hydrated ? orders.length : 0;
  const accountStatus =
    hydrated && viewer
      ? viewer.username ?? viewer.uid ?? copy.guestLabel
      : copy.guestLabel;

  return (
    <header className={styles.headerWrap}>
      <div className={styles.headerInner}>
        <div className={styles.headerCard}>
          <div className={styles.topBar}>
            <HeaderNavMenu
              navigationLinks={navigationLinks}
              pathname={pathname}
            />

            <Link href="/" className={styles.brandLink}>
              <BrandMark tagline={copy.brandSlogan} />
            </Link>

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

              <AccountMenu
                accountStatus={accountStatus}
                cartCount={visibleCartCount}
                copy={copy}
                hydrated={hydrated}
                orderCount={visibleOrderCount}
                orders={orders}
                viewer={viewer}
                viewerName={viewer?.username ?? viewer?.uid ?? null}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
