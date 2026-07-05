export const ORDER_STATUSES = [
  "pending_payment",
  "payment_failed",
  "paid",
  "confirmed",
  "preparing",
  "shipping",
  "delivered",
] as const;

export const TRACKABLE_ORDER_STATUSES = [
  "paid",
  "confirmed",
  "preparing",
  "shipping",
  "delivered",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    ORDER_STATUSES.includes(value as OrderStatus)
  );
}
