"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteLocale } from "@/lib/i18n";
import type { OrderCenterCopy } from "@/lib/order-center-copy";
import {
  getOrderStatusCounts,
  getOrderStatusStepIndex,
  resolveOrderStatus,
  type OrderStatus,
} from "@/lib/order-tracking";
import { useStorefront } from "@/components/storefront-provider";
import styles from "./page.module.css";

type OrdersPageClientProps = {
  locale: SiteLocale;
  copy: OrderCenterCopy;
};

type OrderFilter = "all" | OrderStatus;

export function OrdersPageClient({
  locale,
  copy,
}: OrdersPageClientProps) {
  const { cartCount, hydrated, orders } = useStorefront();
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const statusCounts = hydrated ? getOrderStatusCounts(orders, nowMs) : null;
  const visibleOrders =
    activeFilter === "all"
      ? orders
      : orders.filter(
          (order) => resolveOrderStatus(order, nowMs) === activeFilter,
        );

  const filters: Array<{ key: OrderFilter; label: string; count: number }> = [
    {
      key: "all",
      label: copy.allOrders,
      count: hydrated ? orders.length : 0,
    },
    {
      key: "processing",
      label: copy.processing,
      count: statusCounts?.processing ?? 0,
    },
    {
      key: "shipping",
      label: copy.shipping,
      count: statusCounts?.shipping ?? 0,
    },
    {
      key: "delivered",
      label: copy.delivered,
      count: statusCounts?.delivered ?? 0,
    },
  ];

  const statusLabelByKey: Record<OrderStatus, string> = {
    processing: copy.processing,
    shipping: copy.shipping,
    delivered: copy.delivered,
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{copy.orders}</p>
          <h1>{copy.ordersTitle}</h1>
          <p className={styles.lead}>{copy.ordersLead}</p>
        </div>

        <div className={styles.heroAside}>
          <p className={styles.summaryLabel}>{copy.statusSummaryTitle}</p>
          <div className={styles.summaryGrid}>
            <article className={styles.summaryCard}>
              <strong>{hydrated ? statusCounts?.processing ?? 0 : copy.processing}</strong>
              <span>{copy.processing}</span>
            </article>
            <article className={styles.summaryCard}>
              <strong>{hydrated ? statusCounts?.shipping ?? 0 : copy.shipping}</strong>
              <span>{copy.shipping}</span>
            </article>
            <article className={styles.summaryCard}>
              <strong>{hydrated ? statusCounts?.delivered ?? 0 : copy.delivered}</strong>
              <span>{copy.delivered}</span>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.board}>
        <div className={styles.filterRow}>
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={styles.filterChip}
              data-active={activeFilter === filter.key}
              onClick={() => setActiveFilter(filter.key)}
            >
              <span>{filter.label}</span>
              <strong>{filter.count}</strong>
            </button>
          ))}
        </div>

        {!hydrated ? (
          <div className={styles.emptyState}>
            <h2>Loading...</h2>
            <p>{copy.ordersLead}</p>
          </div>
        ) : visibleOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>{copy.ordersEmptyTitle}</h2>
            <p>{copy.ordersEmptyBody}</p>
            <div className={styles.emptyActions}>
              <Link href="/shop" className={styles.primaryLink}>
                {copy.browseShop}
              </Link>
              <Link href="/cart" className={styles.secondaryLink}>
                {copy.openCart} ({cartCount})
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.orderList}>
            {visibleOrders.map((order) => {
              const status = resolveOrderStatus(order, nowMs);
              const activeStepIndex = getOrderStatusStepIndex(status);

              return (
                <article key={order.id} className={styles.orderCard}>
                  <div className={styles.orderTop}>
                    <div>
                      <span className={styles.orderCode}>
                        {copy.orderCodeLabel} #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <h2>{order.productName}</h2>
                      <p>
                        {order.quantity} x / {order.totalPi} Pi
                      </p>
                    </div>

                    <span
                      className={styles.statusPill}
                      data-status={status}
                    >
                      {statusLabelByKey[status]}
                    </span>
                  </div>

                  <div className={styles.orderMeta}>
                    <span>{formatter.format(new Date(order.createdAt))}</span>
                    <span>
                      {copy.updatedLabel}: {formatter.format(new Date(order.createdAt))}
                    </span>
                  </div>

                  <div className={styles.progressTrack}>
                    {(["processing", "shipping", "delivered"] as OrderStatus[]).map(
                      (step, index) => (
                        <div
                          key={step}
                          className={styles.progressStep}
                          data-active={index <= activeStepIndex}
                          data-current={index === activeStepIndex}
                        >
                          <span className={styles.progressDot} />
                          <strong>{statusLabelByKey[step]}</strong>
                        </div>
                      ),
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
