import { type OrderStatus } from "@/lib/order-status";

const CONFIRMED_START_MS = 2 * 60 * 1000;
const PREPARING_START_MS = 6 * 60 * 1000;
const SHIPPING_START_MS = 14 * 60 * 1000;
const DELIVERY_DONE_MS = 35 * 60 * 1000;

export function resolveOrderStatus(
  order: { createdAt: string; status?: OrderStatus },
  nowMs = Date.now(),
): OrderStatus {
  if (order.status) {
    return order.status;
  }

  const createdAtMs = Date.parse(order.createdAt);
  const elapsedMs = Number.isFinite(createdAtMs)
    ? Math.max(0, nowMs - createdAtMs)
    : 0;

  if (elapsedMs >= DELIVERY_DONE_MS) {
    return "delivered";
  }

  if (elapsedMs >= SHIPPING_START_MS) {
    return "shipping";
  }

  if (elapsedMs >= PREPARING_START_MS) {
    return "preparing";
  }

  if (elapsedMs >= CONFIRMED_START_MS) {
    return "confirmed";
  }

  return "paid";
}

export function getOrderStatusCounts(
  orders: Array<{ createdAt: string; status?: OrderStatus }>,
  nowMs = Date.now(),
) {
  return orders.reduce(
    (counts, order) => {
      const status = resolveOrderStatus(order, nowMs);
      counts[status] += 1;
      return counts;
    },
    {
      pending_payment: 0,
      payment_failed: 0,
      paid: 0,
      confirmed: 0,
      preparing: 0,
      shipping: 0,
      delivered: 0,
    } as Record<OrderStatus, number>,
  );
}

export function getOrderStatusStepIndex(status: OrderStatus) {
  switch (status) {
    case "pending_payment":
    case "payment_failed":
      return 0;
    case "paid":
      return 0;
    case "confirmed":
      return 1;
    case "preparing":
      return 2;
    case "shipping":
      return 3;
    case "delivered":
      return 4;
    default:
      return 0;
  }
}
