"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { SiteLocale } from "@/lib/i18n";
import type { OrderCenterCopy } from "@/lib/order-center-copy";
import { getOrderStatusCounts, resolveOrderStatus } from "@/lib/order-tracking";
import type { OrderStatus } from "@/lib/order-status";
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
  const {
    addresses,
    cartCount,
    hydrated,
    orders,
    refreshStorefrontState,
    viewer,
  } = useStorefront();
  const refreshInFlightRef = useRef(false);
  const viewerUid = viewer?.uid ?? null;
  const statusCounts = hydrated ? getOrderStatusCounts(orders) : null;

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const piFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 4,
  });

  const statusLabelByKey: Record<OrderStatus, string> = {
    confirmed: orderCopy.confirmed,
    delivered: orderCopy.delivered,
    delivery_issue: orderCopy.deliveryIssue,
    paid: orderCopy.paid,
    payment_failed: orderCopy.paymentFailed,
    pending_payment: orderCopy.pendingPayment,
    preparing: orderCopy.preparing,
    ready_to_ship: orderCopy.readyToShip,
    shipping: orderCopy.shipping,
  };

  useEffect(() => {
    if (!hydrated || !viewerUid) {
      return;
    }

    let cancelled = false;
    const refreshAccountState = async () => {
      if (cancelled || refreshInFlightRef.current) {
        return;
      }

      refreshInFlightRef.current = true;

      try {
        await refreshStorefrontState(undefined, undefined, {
          allowPiAuthFallback: true,
        });
      } finally {
        refreshInFlightRef.current = false;
      }
    };
    const handleFocus = () => {
      void refreshAccountState();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refreshAccountState();
      }
    };

    void refreshAccountState();
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const interval = window.setInterval(() => {
      void refreshAccountState();
    }, 20000);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(interval);
    };
  }, [hydrated, refreshStorefrontState, viewerUid]);

  return (
    <div className={styles.page}>
      <section className={styles.accountBar}>
        <div>
          <p className={styles.eyebrow}>{copy.account}</p>
          <h1>
            {hydrated
              ? viewer?.username ?? viewer?.uid ?? copy.guestLabel
              : copy.loading}
          </h1>
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
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <p className={styles.cardLabel}>{orderCopy.orders}</p>

          <div className={styles.statusGrid}>
            <article className={styles.statusCard}>
              <strong>{hydrated ? statusCounts?.pending_payment ?? 0 : copy.loading}</strong>
              <span>{orderCopy.pendingPayment}</span>
            </article>
            <article className={styles.statusCard}>
              <strong>{hydrated ? statusCounts?.paid ?? 0 : copy.loading}</strong>
              <span>{orderCopy.paid}</span>
            </article>
            <article className={styles.statusCard}>
              <strong>{hydrated ? statusCounts?.shipping ?? 0 : copy.loading}</strong>
              <span>{orderCopy.shipping}</span>
            </article>
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardLabel}>{orderCopy.latestOrdersTitle}</p>
              <h2>{hydrated ? orders.length : copy.loading}</h2>
            </div>
            <Link href="/orders" className={styles.textLink}>
              {orderCopy.orders}
            </Link>
          </div>

          {!hydrated ? (
            <p>{copy.loading}</p>
          ) : orders.length === 0 ? (
            <p>{copy.noOrders}</p>
          ) : (
            <ul className={styles.orderList}>
              {orders.map((order) => {
                const status = resolveOrderStatus(order);
                const totalQuantity =
                  order.items?.reduce((total, item) => total + item.quantity, 0) ??
                  order.quantity;
                const itemLabel =
                  order.items && order.items.length > 1
                    ? `${order.items.length} ${copy.linesLabel}`
                    : order.items?.[0]?.productName ?? order.productName;
                const addressLabel = order.shippingAddress
                  ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                  : "--";

                return (
                  <li key={order.id} className={styles.orderItem}>
                    <div className={styles.orderSummary}>
                      <span className={styles.orderCode}>
                        #{order.id.slice(-10).toUpperCase()}
                      </span>
                      <strong>{itemLabel}</strong>
                      <span>
                        {totalQuantity} x / {piFormatter.format(order.totalPi)} Pi
                      </span>
                      <span>{addressLabel}</span>
                      {status === "pending_payment" ||
                      status === "payment_failed" ? (
                        <span className={styles.paymentWarning}>
                          {status === "pending_payment"
                            ? orderCopy.paymentPendingNotice
                            : orderCopy.paymentFailedNotice}
                        </span>
                      ) : null}
                    </div>
                    <div className={styles.orderMeta}>
                      <span
                        className={styles.orderStatus}
                        data-status={status}
                      >
                        {statusLabelByKey[status]}
                      </span>
                      <strong>{piFormatter.format(order.totalPi)} Pi</strong>
                      <span>{formatter.format(new Date(order.createdAt))}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </article>

        {hydrated && addresses.length > 0 ? (
          <article className={styles.card}>
            <p className={styles.cardLabel}>{copy.addressBookTitle}</p>
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
          </article>
        ) : null}
      </section>
    </div>
  );
}
