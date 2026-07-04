export const ORDER_STATUSES = [
  "processing",
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
