"use client";

import Link from "next/link";
import type { SiteLocale } from "@/lib/i18n";
import type { OrderCenterCopy } from "@/lib/order-center-copy";
import { getOrderStatusCounts, resolveOrderStatus } from "@/lib/order-tracking";
import type { StorefrontCopy } from "@/lib/storefront-copy";
import { useStorefront } from "@/components/storefront-provider";
import styles from "./page.module.css";

type AccountPageClientProps = {
  locale: SiteLocale;
  copy: StorefrontCopy;
  orderCopy: OrderCenterCopy;
};

export function AccountPageClient({
  locale,
  copy,
  orderCopy,
}: AccountPageClientProps) {
  const { addresses, cartCount, hydrated, orders, viewer } = useStorefront();
  const statusCounts = hydrated ? getOrderStatusCounts(orders) : null;

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const statusLabelByKey = {
    processing: orderCopy.processing,
    shipping: orderCopy.shipping,
    delivered: orderCopy.delivered,
  };

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
          <h2>{hydrated ? viewer?.username ?? copy.guestLabel : copy.loading}</h2>
          <p>{hydrated ? (viewer ? copy.statusSignedIn : copy.statusGuest) : copy.loading}</p>

          <dl className={styles.metaList}>
            <div>
              <dt>{copy.usernameLabel}</dt>
              <dd>{hydrated ? viewer?.username ?? copy.guestLabel : copy.loading}</dd>
            </div>
            <div>
              <dt>{copy.walletLabel}</dt>
              <dd>{hydrated ? viewer?.wallet_address ?? "--" : copy.loading}</dd>
            </div>
          </dl>

          <div className={styles.statusGrid}>
            <article className={styles.statusCard}>
              <strong>{hydrated ? statusCounts?.processing ?? 0 : copy.loading}</strong>
              <span>{orderCopy.processing}</span>
            </article>
            <article className={styles.statusCard}>
              <strong>{hydrated ? statusCounts?.shipping ?? 0 : copy.loading}</strong>
              <span>{orderCopy.shipping}</span>
            </article>
            <article className={styles.statusCard}>
              <strong>{hydrated ? statusCounts?.delivered ?? 0 : copy.loading}</strong>
              <span>{orderCopy.delivered}</span>
            </article>
          </div>

          <div className={styles.actionRow}>
            <Link href="/cart" className={styles.primaryLink}>
              {copy.cartShortcut} ({cartCount})
            </Link>
            <Link href="/orders" className={styles.secondaryLink}>
              {orderCopy.orders}
            </Link>
            <Link href="/shop" className={styles.secondaryLink}>
              {copy.browseShop}
            </Link>
          </div>
        </article>

        <article className={styles.card}>
          <p className={styles.cardLabel}>{orderCopy.latestOrdersTitle}</p>
          <h2>{hydrated ? orders.length : copy.loading}</h2>

          {!hydrated ? (
            <p>{copy.loading}</p>
          ) : orders.length === 0 ? (
            <p>{copy.noOrders}</p>
          ) : (
            <ul className={styles.orderList}>
              {orders.map((order) => {
                const status = resolveOrderStatus(order);
                const itemLabel =
                  order.items && order.items.length > 1
                    ? `${order.items.length} ${copy.linesLabel}`
                    : order.items?.[0]?.productName ?? order.productName;
                const addressLabel = order.shippingAddress
                  ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                  : "--";

                return (
                  <li key={order.id} className={styles.orderItem}>
                    <div>
                      <strong>{itemLabel}</strong>
                      <span>
                        {order.quantity} x / {order.totalPi} Pi
                      </span>
                      <span>{addressLabel}</span>
                    </div>
                    <div className={styles.orderMeta}>
                      <span
                        className={styles.orderStatus}
                        data-status={status}
                      >
                        {statusLabelByKey[status]}
                      </span>
                      <span>{formatter.format(new Date(order.createdAt))}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </article>

        <article className={styles.card}>
          <p className={styles.cardLabel}>{copy.addressBookTitle}</p>
          <h2>{hydrated ? addresses.length : copy.loading}</h2>
          <p>{copy.addressBookLead}</p>

          {!hydrated ? (
            <p>{copy.loading}</p>
          ) : addresses.length === 0 ? (
            <p>{copy.noAddresses}</p>
          ) : (
            <ul className={styles.addressList}>
              {addresses.map((address) => (
                <li key={address.id} className={styles.addressItem}>
                  <div className={styles.addressHeader}>
                    <strong>{address.fullName}</strong>
                    {address.isDefault ? (
                      <span className={styles.addressTag}>{copy.defaultAddress}</span>
                    ) : null}
                  </div>
                  <span>{address.phone}</span>
                  <span>
                    {[
                      address.line1,
                      address.line2,
                      address.ward,
                      address.district,
                      address.city,
                      address.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  );
}
