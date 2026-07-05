"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteLocale } from "@/lib/i18n";
import type { OrderCenterCopy } from "@/lib/order-center-copy";
import type { PiCheckoutCopy } from "@/lib/public-site-copy";
import {
  getOrderStatusCounts,
  getOrderStatusStepIndex,
  resolveOrderStatus,
} from "@/lib/order-tracking";
import {
  TRACKABLE_ORDER_STATUSES,
  type OrderStatus,
} from "@/lib/order-status";
import {
  useStorefront,
  type StorefrontOrder,
} from "@/components/storefront-provider";
import styles from "./page.module.css";

type OrdersPageClientProps = {
  locale: SiteLocale;
  copy: OrderCenterCopy;
  piCopy: PiCheckoutCopy;
  serverConfigured: boolean;
};

type OrderFilter = "all" | OrderStatus;

async function postJson<T>(
  path: string,
  payload: Record<string, unknown>,
  fallbackError: string,
) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : fallbackError,
    );
  }

  return data;
}

export function OrdersPageClient({
  locale,
  copy,
  piCopy,
  serverConfigured,
}: OrdersPageClientProps) {
  const {
    authBusy,
    cartCount,
    clearCart,
    hydrated,
    orders,
    recordOrder,
    refreshStorefrontState,
    sdkReady,
    signInWithPi,
    viewer,
  } = useStorefront();
  const [activeFilter, setActiveFilter] = useState<OrderFilter>("all");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [paymentMessage, setPaymentMessage] = useState<{
    kind: "error" | "success";
    orderId: string;
    text: string;
  } | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<{
    kind: "error" | "success";
    text: string;
  } | null>(null);
  const [retryingOrderId, setRetryingOrderId] = useState<string | null>(null);
  const [refreshingOrders, setRefreshingOrders] = useState(false);
  const refreshingOrdersRef = useRef(false);

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
      key: "pending_payment",
      label: copy.pendingPayment,
      count: statusCounts?.pending_payment ?? 0,
    },
    {
      key: "payment_failed",
      label: copy.paymentFailed,
      count: statusCounts?.payment_failed ?? 0,
    },
    {
      key: "paid",
      label: copy.paid,
      count: statusCounts?.paid ?? 0,
    },
    {
      key: "preparing",
      label: copy.preparing,
      count: statusCounts?.preparing ?? 0,
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
    confirmed: copy.confirmed,
    paid: copy.paid,
    payment_failed: copy.paymentFailed,
    pending_payment: copy.pendingPayment,
    preparing: copy.preparing,
    shipping: copy.shipping,
    delivered: copy.delivered,
  };
  const loadingLabel = locale === "vi" ? "\u0110ang t\u1ea3i..." : "Loading...";
  const notAvailableLabel = locale === "vi" ? "Ch\u01b0a c\u00f3" : "Not available";

  const handleRefreshOrders = useCallback(
    async (quiet = false) => {
      if (!viewer || refreshingOrdersRef.current) {
        return;
      }

      refreshingOrdersRef.current = true;
      setRefreshingOrders(true);

      if (!quiet) {
        setSyncMessage(null);
      }

      const refreshed = await refreshStorefrontState();

      if (!quiet) {
        setSyncMessage({
          kind: refreshed ? "success" : "error",
          text: refreshed ? copy.syncSuccess : copy.syncFailed,
        });
      }

      refreshingOrdersRef.current = false;
      setRefreshingOrders(false);
    },
    [
      copy.syncFailed,
      copy.syncSuccess,
      refreshStorefrontState,
      viewer,
    ],
  );

  useEffect(() => {
    if (!hydrated || !viewer) {
      return;
    }

    const timer = window.setTimeout(() => {
      void handleRefreshOrders(true);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [handleRefreshOrders, hydrated, viewer]);

  const recordExistingOrderStatus = (
    order: StorefrontOrder,
    status: OrderStatus,
    paymentId?: string,
    txid?: string,
  ) => {
    recordOrder({
      ...order,
      paymentId,
      status,
      statusUpdatedAt: new Date().toISOString(),
      statusUpdatedBy: "Pi Network Testnet",
      txid,
    });
  };

  const handleRetryPayment = async (order: StorefrontOrder) => {
    if (!window.Pi) {
      setPaymentMessage({
        kind: "error",
        orderId: order.id,
        text: piCopy.sdkUnavailable,
      });
      return;
    }

    if (!sdkReady) {
      setPaymentMessage({
        kind: "error",
        orderId: order.id,
        text: piCopy.sdkNotReady,
      });
      return;
    }

    if (!serverConfigured) {
      setPaymentMessage({
        kind: "error",
        orderId: order.id,
        text: piCopy.missingServerKey,
      });
      return;
    }

    let activeViewer = viewer;

    if (!activeViewer) {
      activeViewer = await signInWithPi();
    }

    if (!activeViewer) {
      setPaymentMessage({
        kind: "error",
        orderId: order.id,
        text: piCopy.authRequired,
      });
      return;
    }

    setRetryingOrderId(order.id);
    setPaymentMessage(null);

    window.Pi.createPayment(
      {
        amount: order.totalPi,
        memo: order.id,
        metadata: {
          itemCount: order.quantity,
          lineCount: order.items?.length ?? 1,
          orderCode: order.id,
          orderId: order.id,
          productId: order.productId,
          productName: order.productName,
          surface: "mushroom-pi-order-retry",
          testMode: true,
        },
      },
      {
        onReadyForServerApproval: async (paymentId) => {
          try {
            await postJson(
              "/api/pi/payments/approve",
              { paymentId },
              piCopy.approvalFailed,
            );
            recordExistingOrderStatus(order, "pending_payment", paymentId);
          } catch (error) {
            recordExistingOrderStatus(order, "payment_failed", paymentId);
            setRetryingOrderId(null);
            setPaymentMessage({
              kind: "error",
              orderId: order.id,
              text: error instanceof Error ? error.message : piCopy.approvalFailed,
            });
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          try {
            await postJson(
              "/api/pi/payments/complete",
              { paymentId, txid },
              piCopy.completionFailed,
            );
            recordExistingOrderStatus(order, "paid", paymentId, txid);
            clearCart();
            setRetryingOrderId(null);
            setPaymentMessage({
              kind: "success",
              orderId: order.id,
              text: copy.retryPaymentSuccess,
            });
          } catch (error) {
            recordExistingOrderStatus(order, "payment_failed", paymentId);
            setRetryingOrderId(null);
            setPaymentMessage({
              kind: "error",
              orderId: order.id,
              text: error instanceof Error ? error.message : piCopy.completionFailed,
            });
          }
        },
        onCancel: (paymentId) => {
          recordExistingOrderStatus(order, "payment_failed", paymentId);
          setRetryingOrderId(null);
          setPaymentMessage({
            kind: "error",
            orderId: order.id,
            text: `[${paymentId}] ${piCopy.cancelled}`,
          });
        },
        onError: (error, payment) => {
          recordExistingOrderStatus(order, "payment_failed", payment?.identifier);
          setRetryingOrderId(null);
          setPaymentMessage({
            kind: "error",
            orderId: order.id,
            text: `${piCopy.paymentError}: ${error.message}`,
          });
        },
      },
    );
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
              <strong>{hydrated ? statusCounts?.pending_payment ?? 0 : loadingLabel}</strong>
              <span>{copy.pendingPayment}</span>
            </article>
            <article className={styles.summaryCard}>
              <strong>{hydrated ? statusCounts?.paid ?? 0 : loadingLabel}</strong>
              <span>{copy.paid}</span>
            </article>
            <article className={styles.summaryCard}>
              <strong>{hydrated ? statusCounts?.shipping ?? 0 : loadingLabel}</strong>
              <span>{copy.shipping}</span>
            </article>
            <article className={styles.summaryCard}>
              <strong>{hydrated ? statusCounts?.delivered ?? 0 : loadingLabel}</strong>
              <span>{copy.delivered}</span>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.board}>
        <div className={styles.boardToolbar}>
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

          <button
            type="button"
            className={styles.refreshButton}
            disabled={!viewer || refreshingOrders}
            onClick={() => {
              void handleRefreshOrders();
            }}
          >
            {refreshingOrders ? copy.refreshingOrders : copy.refreshOrders}
          </button>
        </div>

        {syncMessage ? (
          <div className={styles.inlineMessage} data-kind={syncMessage.kind}>
            {syncMessage.text}
          </div>
        ) : null}

        {!hydrated ? (
          <div className={styles.emptyState}>
            <h2>{loadingLabel}</h2>
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
              const isExpanded = expandedOrderId === order.id;
              const headline =
                order.items && order.items.length > 1
                  ? order.productName
                  : order.items?.[0]?.productName ?? order.productName;
              const addressLine = order.shippingAddress
                ? [
                    order.shippingAddress.line1,
                    order.shippingAddress.ward,
                    order.shippingAddress.district,
                    order.shippingAddress.city,
                  ]
                    .filter(Boolean)
                    .join(", ")
                : null;
              const recipientLine = order.shippingAddress
                ? [
                    order.shippingAddress.fullName,
                    order.shippingAddress.phone,
                  ]
                    .filter(Boolean)
                    .join(" | ")
                : null;

              return (
                <article
                  key={order.id}
                  className={styles.orderCard}
                  data-expanded={isExpanded}
                >
                  <button
                    type="button"
                    className={styles.orderSummaryButton}
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedOrderId((currentOrderId) =>
                        currentOrderId === order.id ? null : order.id,
                      )
                    }
                  >
                    <div className={styles.orderSummaryMain}>
                      <span className={styles.orderCode}>
                        {copy.orderCodeLabel} #{order.id}
                      </span>
                      <h2>{headline}</h2>
                      <p>
                        {copy.placedAtLabel}:{" "}
                        {formatter.format(new Date(order.createdAt))}
                      </p>
                    </div>

                    <div className={styles.orderSummaryMeta}>
                      <span
                        className={styles.statusPill}
                        data-status={status}
                      >
                        {statusLabelByKey[status]}
                      </span>
                      <strong>{order.totalPi} Pi</strong>
                      <small>
                        {order.quantity}{" "}
                        {locale === "vi" ? "s\u1ea3n ph\u1ea9m" : "items"}
                      </small>
                      <span className={styles.detailsHint}>
                        {isExpanded ? copy.hideDetails : copy.expandDetails}
                      </span>
                    </div>
                  </button>

                  {isExpanded ? (
                    <div className={styles.orderDetails}>
                      <section className={styles.detailSection}>
                        <div className={styles.detailSectionHeader}>
                          <strong>{copy.statusSummaryTitle}</strong>
                          <span>
                            {copy.updatedLabel}:{" "}
                            {formatter.format(
                              new Date(order.statusUpdatedAt ?? order.createdAt),
                            )}
                          </span>
                        </div>

                        {status === "pending_payment" ||
                        status === "payment_failed" ? (
                          <div className={styles.paymentNotice} data-status={status}>
                            <strong>{statusLabelByKey[status]}</strong>
                            <p>
                              {status === "pending_payment"
                                ? copy.paymentPendingNotice
                                : copy.paymentFailedNotice}
                            </p>
                            {paymentMessage?.orderId === order.id ? (
                              <div
                                className={styles.inlineMessage}
                                data-kind={paymentMessage.kind}
                              >
                                {paymentMessage.text}
                              </div>
                            ) : null}
                            <button
                              type="button"
                              className={styles.secondaryLink}
                              disabled={retryingOrderId !== null || authBusy}
                              onClick={() => {
                                void handleRetryPayment(order);
                              }}
                            >
                              {retryingOrderId === order.id
                                ? copy.retryingPayment
                                : copy.retryPayment}
                            </button>
                          </div>
                        ) : (
                          <div className={styles.progressTrack}>
                            {TRACKABLE_ORDER_STATUSES.map((step, index) => (
                              <div
                                key={step}
                                className={styles.progressStep}
                                data-active={index <= activeStepIndex}
                                data-current={index === activeStepIndex}
                              >
                                <span className={styles.progressDot} />
                                <strong>{statusLabelByKey[step]}</strong>
                              </div>
                            ))}
                          </div>
                        )}
                      </section>

                      <section className={styles.detailSection}>
                        <strong>{copy.orderItemsTitle}</strong>
                        {order.items && order.items.length > 0 ? (
                          <ul className={styles.itemList}>
                            {order.items.map((item) => (
                              <li
                                key={`${order.id}-${item.productId}`}
                                className={styles.itemRow}
                              >
                                <span>{item.productName}</span>
                                <strong>
                                  {item.quantity} x / {item.totalPi} Pi
                                </strong>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </section>

                      <section className={styles.detailSection}>
                        <strong>{copy.paymentDetailsTitle}</strong>
                        <div className={styles.detailInfoGrid}>
                          <span>
                            {copy.totalLabel}: <strong>{order.totalPi} Pi</strong>
                          </span>
                          <span>
                            Payment ID:{" "}
                            <strong>{order.paymentId ?? notAvailableLabel}</strong>
                          </span>
                          <span>
                            TXID: <strong>{order.txid ?? notAvailableLabel}</strong>
                          </span>
                          <span>
                            {copy.orderCodeLabel}: <strong>{order.id}</strong>
                          </span>
                        </div>
                      </section>

                      <section className={styles.detailSection}>
                        <strong>{copy.deliveryDetailsTitle}</strong>
                        <div className={styles.detailInfoGrid}>
                          <span>
                            {copy.carrierLabel}:{" "}
                            <strong>
                              {order.shippingCarrier ?? notAvailableLabel}
                            </strong>
                          </span>
                          <span>
                            {copy.shipperLabel}:{" "}
                            <strong>{order.shipperName ?? notAvailableLabel}</strong>
                          </span>
                          <span>
                            {copy.trackingCodeLabel}:{" "}
                            <strong>{order.trackingCode ?? notAvailableLabel}</strong>
                          </span>
                          <span>
                            {copy.receiverLabel}:{" "}
                            <strong>{order.receivedBy ?? notAvailableLabel}</strong>
                          </span>
                        </div>
                        {recipientLine ? (
                          <p className={styles.addressLine}>
                            {copy.receiverLabel}: {recipientLine}
                          </p>
                        ) : null}
                        {addressLine ? (
                          <p className={styles.addressLine}>
                            {copy.deliveryAddressLabel}: {addressLine}
                          </p>
                        ) : null}
                      </section>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
