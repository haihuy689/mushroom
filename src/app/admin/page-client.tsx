"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { AdminCenterCopy } from "@/lib/admin-center-copy";
import type {
  StorefrontAdminAccess,
  StorefrontStaffMember,
} from "@/lib/admin-access";
import type { SiteLocale } from "@/lib/i18n";
import type { OrderCenterCopy } from "@/lib/order-center-copy";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";
import { getOrderStatusCounts, resolveOrderStatus } from "@/lib/order-tracking";
import type { StorefrontOrder } from "@/lib/storefront-state";
import styles from "./page.module.css";

type AdminPageClientProps = {
  access: StorefrontAdminAccess;
  copy: AdminCenterCopy;
  locale: SiteLocale;
  orderCopy: OrderCenterCopy;
  orders: StorefrontOrder[];
  staff: StorefrontStaffMember[];
};

type MessageState =
  | { kind: "error"; text: string }
  | { kind: "success"; text: string }
  | null;

async function readJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Request failed.",
    );
  }

  return data;
}

export function AdminPageClient({
  access,
  copy,
  locale,
  orderCopy,
  orders: initialOrders,
  staff: initialStaff,
}: AdminPageClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [staff, setStaff] = useState(initialStaff);
  const [staffUsername, setStaffUsername] = useState("");
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageState>(null);
  const [savingStaff, setSavingStaff] = useState(false);
  const [refreshingOrders, setRefreshingOrders] = useState(false);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  const statusCounts = getOrderStatusCounts(orders);
  const statusLabelByKey: Record<OrderStatus, string> = {
    delivered: orderCopy.delivered,
    processing: orderCopy.processing,
    shipping: orderCopy.shipping,
  };

  const handleRefreshOrders = async () => {
    setRefreshingOrders(true);
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontOrder[] }>("/api/admin/orders");
      setOrders(data.items);
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setRefreshingOrders(false);
    }
  };

  const handleAddStaff = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!staffUsername.trim()) {
      return;
    }

    setSavingStaff(true);
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontStaffMember[] }>(
        "/api/admin/staff",
        {
          method: "POST",
          body: JSON.stringify({
            username: staffUsername,
          }),
        },
      );

      setStaff(data.items);
      setStaffUsername("");
      setMessage({
        kind: "success",
        text: copy.saveSuccess,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setSavingStaff(false);
    }
  };

  const handleRemoveStaff = async (username: string) => {
    setSavingStaff(true);
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontStaffMember[] }>(
        "/api/admin/staff",
        {
          method: "DELETE",
          body: JSON.stringify({
            username,
          }),
        },
      );

      setStaff(data.items);
      setMessage({
        kind: "success",
        text: copy.saveSuccess,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setSavingStaff(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    setBusyOrderId(orderId);
    setMessage(null);

    try {
      const data = await readJson<{ order: StorefrontOrder }>(
        `/api/admin/orders/${orderId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? data.order : order)),
      );
      setMessage({
        kind: "success",
        text: copy.saveSuccess,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setBusyOrderId(null);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            {access.role === "owner" ? copy.ownerPanel : copy.staffPanel}
          </p>
          <h1>{copy.adminTitle}</h1>
          <p className={styles.lead}>{copy.adminLead}</p>
          <p className={styles.notes}>{copy.notes}</p>
        </div>

        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <strong>{orders.length}</strong>
            <span>{orderCopy.orders}</span>
          </article>
          <article className={styles.statCard}>
            <strong>{statusCounts.processing}</strong>
            <span>{orderCopy.processing}</span>
          </article>
          <article className={styles.statCard}>
            <strong>{statusCounts.shipping}</strong>
            <span>{orderCopy.shipping}</span>
          </article>
          <article className={styles.statCard}>
            <strong>{statusCounts.delivered}</strong>
            <span>{orderCopy.delivered}</span>
          </article>
        </div>
      </section>

      {message ? (
        <div className={styles.message} data-kind={message.kind}>
          {message.text}
        </div>
      ) : null}

      <section className={styles.layout}>
        {access.canManageStaff ? (
          <article className={styles.card}>
            <div className={styles.cardHeading}>
              <div>
                <p className={styles.cardLabel}>{copy.addStaff}</p>
                <h2>{copy.staffManagerTitle}</h2>
              </div>
            </div>

            <p className={styles.cardLead}>{copy.staffManagerLead}</p>

            <form className={styles.staffForm} onSubmit={handleAddStaff}>
              <label className={styles.field}>
                <span>{copy.staffUsernameLabel}</span>
                <input
                  value={staffUsername}
                  onChange={(event) => setStaffUsername(event.target.value)}
                  placeholder="exampleuser123"
                  required
                />
              </label>

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={savingStaff}
              >
                {savingStaff ? copy.addStaff : copy.addStaffButton}
              </button>
            </form>

            {staff.length === 0 ? (
              <p className={styles.emptyState}>{copy.emptyStaff}</p>
            ) : (
              <div className={styles.staffList}>
                {staff.map((member) => (
                  <article key={member.usernameKey} className={styles.staffCard}>
                    <div>
                      <strong>{member.username}</strong>
                      <span>
                        {copy.staffAddedBy}: {member.addedBy}
                      </span>
                      <span>{formatter.format(new Date(member.addedAt))}</span>
                    </div>

                    <button
                      type="button"
                      className={styles.secondaryButton}
                      disabled={savingStaff}
                      onClick={() => handleRemoveStaff(member.username)}
                    >
                      {copy.removeStaff}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </article>
        ) : null}

        <article className={styles.card}>
          <div className={styles.cardHeading}>
            <div>
              <p className={styles.cardLabel}>{copy.statusLabel}</p>
              <h2>{copy.orderManagerTitle}</h2>
            </div>

            <button
              type="button"
              className={styles.secondaryButton}
              disabled={refreshingOrders}
              onClick={() => {
                void handleRefreshOrders();
              }}
            >
              {refreshingOrders ? copy.refreshOrders : copy.refreshOrders}
            </button>
          </div>

          {orders.length === 0 ? (
            <p className={styles.emptyState}>{copy.emptyOrders}</p>
          ) : (
            <div className={styles.orderList}>
              {orders.map((order) => {
                const resolvedStatus = resolveOrderStatus(order);

                return (
                  <article key={order.id} className={styles.orderCard}>
                    <div className={styles.orderTop}>
                      <div>
                        <span className={styles.orderCode}>
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                        <h3>{order.productName}</h3>
                        <p>
                          {copy.customerLabel}: {order.username ?? order.shopperUid ?? "--"}
                        </p>
                        <p>
                          {order.quantity} x / {order.totalPi} Pi
                        </p>
                      </div>

                      <span className={styles.statusPill} data-status={resolvedStatus}>
                        {statusLabelByKey[resolvedStatus]}
                      </span>
                    </div>

                    {order.shippingAddress ? (
                      <div className={styles.infoBlock}>
                        <strong>{copy.orderAddress}</strong>
                        <span>
                          {order.shippingAddress.fullName} | {order.shippingAddress.phone}
                        </span>
                        <span>
                          {[
                            order.shippingAddress.line1,
                            order.shippingAddress.line2,
                            order.shippingAddress.ward,
                            order.shippingAddress.district,
                            order.shippingAddress.city,
                            order.shippingAddress.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    ) : null}

                    {order.items && order.items.length > 0 ? (
                      <div className={styles.infoBlock}>
                        <strong>{copy.orderItems}</strong>
                        <ul className={styles.itemList}>
                          {order.items.map((item) => (
                            <li key={`${order.id}-${item.productId}`}>
                              <span>{item.productName}</span>
                              <strong>
                                {item.quantity} x / {item.totalPi} Pi
                              </strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className={styles.metaRow}>
                      <span>{formatter.format(new Date(order.createdAt))}</span>
                      <span>
                        {copy.latestSync}:{" "}
                        {formatter.format(
                          new Date(order.statusUpdatedAt ?? order.createdAt),
                        )}
                      </span>
                    </div>

                    <div className={styles.statusButtons}>
                      {ORDER_STATUSES.map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={styles.statusButton}
                          data-active={resolvedStatus === status}
                          disabled={busyOrderId === order.id}
                          onClick={() => {
                            void handleStatusUpdate(order.id, status);
                          }}
                        >
                          {busyOrderId === order.id && resolvedStatus === status
                            ? copy.updateStatus
                            : statusLabelByKey[status]}
                        </button>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
