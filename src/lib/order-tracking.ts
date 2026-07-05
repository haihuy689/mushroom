import { type OrderStatus } from "@/lib/order-status";

export function resolveOrderStatus(
  order: { status?: OrderStatus },
  _nowMs = Date.now(),
): OrderStatus {
  void _nowMs;

  if (order.status) {
    return order.status;
  }

  return "paid";
}

export function getOrderStatusCounts(
  orders: Array<{ createdAt?: string; status?: OrderStatus }>,
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
      ready_to_ship: 0,
      shipping: 0,
      delivered: 0,
      delivery_issue: 0,
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
    case "ready_to_ship":
      return 3;
    case "shipping":
      return 4;
    case "delivered":
      return 5;
    case "delivery_issue":
      return 2;
    default:
      return 0;
  }
}
