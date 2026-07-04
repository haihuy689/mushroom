export type OrderStatus = "processing" | "shipping" | "delivered";

const SHIPPING_START_MS = 4 * 60 * 1000;
const DELIVERY_DONE_MS = 16 * 60 * 1000;

export function resolveOrderStatus(
  order: { createdAt: string },
  nowMs = Date.now(),
): OrderStatus {
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

  return "processing";
}

export function getOrderStatusCounts(
  orders: Array<{ createdAt: string }>,
  nowMs = Date.now(),
) {
  return orders.reduce(
    (counts, order) => {
      const status = resolveOrderStatus(order, nowMs);
      counts[status] += 1;
      return counts;
    },
    {
      processing: 0,
      shipping: 0,
      delivered: 0,
    } as Record<OrderStatus, number>,
  );
}

export function getOrderStatusStepIndex(status: OrderStatus) {
  switch (status) {
    case "processing":
      return 0;
    case "shipping":
      return 1;
    case "delivered":
      return 2;
    default:
      return 0;
  }
}
