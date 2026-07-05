export const ORDER_STATUSES = [
  "pending_payment",
  "payment_failed",
  "paid",
  "confirmed",
  "preparing",
  "ready_to_ship",
  "shipping",
  "delivered",
  "delivery_issue",
] as const;

export const TRACKABLE_ORDER_STATUSES = [
  "paid",
  "confirmed",
  "preparing",
  "ready_to_ship",
  "shipping",
  "delivered",
] as const;

export const ADMIN_ORDER_STATUSES = [
  "paid",
  "confirmed",
  "preparing",
  "ready_to_ship",
  "shipping",
  "delivered",
  "delivery_issue",
] as const satisfies readonly OrderStatus[];

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    ORDER_STATUSES.includes(value as OrderStatus)
  );
}

export function isAdminOrderStatus(value: unknown): value is AdminOrderStatus {
  return (
    typeof value === "string" &&
    ADMIN_ORDER_STATUSES.includes(value as AdminOrderStatus)
  );
}
