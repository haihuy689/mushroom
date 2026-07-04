"use client";

import Link from "next/link";
import type { SiteLocale } from "@/lib/i18n";
import type { StorefrontCopy } from "@/lib/storefront-copy";
import { useStorefront } from "@/components/storefront-provider";
import styles from "./page.module.css";

type AccountPageClientProps = {
  locale: SiteLocale;
  copy: StorefrontCopy;
};

export function AccountPageClient({
  locale,
  copy,
}: AccountPageClientProps) {
  const { cartCount, hydrated, orders, viewer } = useStorefront();

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{copy.account}</p>
        <h1>{copy.accountTitle}</h1>
        <p className={styles.lead}>{copy.accountLead}</p>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <p className={styles.cardLabel}>{copy.statusTitle}</p>
          <h2>
            {hydrated
              ? viewer?.username ?? copy.guestLabel
              : copy.loading}
          </h2>
          <p>{hydrated ? (viewer ? copy.statusSignedIn : copy.statusGuest) : copy.loading}</p>

          <dl className={styles.metaList}>
            <div>
              <dt>{copy.usernameLabel}</dt>
              <dd>{hydrated ? viewer?.username ?? copy.guestLabel : copy.loading}</dd>
            </div>
            <div>
              <dt>{copy.walletLabel}</dt>
              <dd>{hydrated ? viewer?.wallet_address ?? "—" : copy.loading}</dd>
            </div>
          </dl>

          <div className={styles.actionRow}>
            <Link href="/cart" className={styles.primaryLink}>
              {copy.cartShortcut} ({cartCount})
            </Link>
            <Link href="/shop" className={styles.secondaryLink}>
              {copy.browseShop}
            </Link>
          </div>
        </article>

        <article className={styles.card}>
          <p className={styles.cardLabel}>{copy.orderHistoryTitle}</p>
          <h2>{hydrated ? orders.length : copy.loading}</h2>

          {!hydrated ? (
            <p>{copy.loading}</p>
          ) : orders.length === 0 ? (
            <p>{copy.noOrders}</p>
          ) : (
            <ul className={styles.orderList}>
              {orders.map((order) => (
                <li key={order.id} className={styles.orderItem}>
                  <div>
                    <strong>{order.productName}</strong>
                    <span>
                      {order.quantity} x / {order.totalPi} Pi
                    </span>
                  </div>
                  <span>{formatter.format(new Date(order.createdAt))}</span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  );
}
