export type StorefrontCartItem = {
  productId: string;
  quantity: number;
};

export type StorefrontShippingAddress = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  note?: string;
};

export type StorefrontAddress = StorefrontShippingAddress & {
  id: string;
  isDefault: boolean;
  createdAt: string;
};

export type StorefrontAddressInput = StorefrontShippingAddress & {
  isDefault?: boolean;
};

export type StorefrontOrderLine = {
  productId: string;
  productName: string;
  quantity: number;
  totalPi: number;
};

export type StorefrontOrder = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPi: number;
  createdAt: string;
  txid?: string;
  paymentId?: string;
  username?: string;
  items?: StorefrontOrderLine[];
  shippingAddress?: StorefrontShippingAddress;
};

export type StorefrontOrderInput = Omit<StorefrontOrder, "createdAt" | "id"> & {
  createdAt?: string;
  id?: string;
};

export type StorefrontStateSnapshot = {
  cartItems: StorefrontCartItem[];
  addresses: StorefrontAddress[];
  orders: StorefrontOrder[];
};

export type StorefrontStateResponse = StorefrontStateSnapshot & {
  databaseConfigured: boolean;
};

const MAX_CART_QUANTITY = 99;
const MAX_SAVED_ADDRESSES = 8;
const MAX_SAVED_ORDERS = 24;

function normalizeText(value: string | undefined) {
  return value?.trim() ?? "";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function toIsoDate(value: string | undefined) {
  if (value) {
    const timestamp = Date.parse(value);

    if (Number.isFinite(timestamp)) {
      return new Date(timestamp).toISOString();
    }
  }

  return new Date().toISOString();
}

export function createStorefrontId(prefix: string) {
  const uuid = globalThis.crypto?.randomUUID?.();

  if (uuid) {
    return `${prefix}-${uuid}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function isStorefrontCartItem(
  value: unknown,
): value is StorefrontCartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as StorefrontCartItem;

  return (
    typeof candidate.productId === "string" &&
    isFiniteNumber(candidate.quantity) &&
    candidate.quantity > 0
  );
}

function isStorefrontShippingAddress(
  value: unknown,
): value is StorefrontShippingAddress {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as StorefrontShippingAddress;

  return (
    typeof candidate.fullName === "string" &&
    typeof candidate.phone === "string" &&
    typeof candidate.line1 === "string" &&
    typeof candidate.ward === "string" &&
    typeof candidate.district === "string" &&
    typeof candidate.city === "string" &&
    typeof candidate.country === "string"
  );
}

export function isStorefrontAddress(value: unknown): value is StorefrontAddress {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as StorefrontAddress;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.isDefault === "boolean" &&
    isStorefrontShippingAddress(candidate)
  );
}

export function isStorefrontOrderLine(
  value: unknown,
): value is StorefrontOrderLine {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as StorefrontOrderLine;

  return (
    typeof candidate.productId === "string" &&
    typeof candidate.productName === "string" &&
    isFiniteNumber(candidate.quantity) &&
    candidate.quantity > 0 &&
    isFiniteNumber(candidate.totalPi)
  );
}

export function isStorefrontOrder(value: unknown): value is StorefrontOrder {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as StorefrontOrder;
  const hasValidItems =
    candidate.items === undefined ||
    (Array.isArray(candidate.items) &&
      candidate.items.every(isStorefrontOrderLine));
  const hasValidShippingAddress =
    candidate.shippingAddress === undefined ||
    isStorefrontShippingAddress(candidate.shippingAddress);

  return (
    typeof candidate.id === "string" &&
    typeof candidate.productId === "string" &&
    typeof candidate.productName === "string" &&
    isFiniteNumber(candidate.quantity) &&
    candidate.quantity > 0 &&
    isFiniteNumber(candidate.totalPi) &&
    typeof candidate.createdAt === "string" &&
    hasValidItems &&
    hasValidShippingAddress
  );
}

export function emptyStorefrontState(): StorefrontStateSnapshot {
  return {
    cartItems: [],
    addresses: [],
    orders: [],
  };
}

export function normalizeCartItems(
  cartItems: StorefrontCartItem[],
): StorefrontCartItem[] {
  const totals = new Map<string, number>();
  const order: string[] = [];

  for (const item of cartItems) {
    const productId = normalizeText(item.productId);
    const quantity = Math.max(
      1,
      Math.min(MAX_CART_QUANTITY, Math.round(item.quantity)),
    );

    if (!productId) {
      continue;
    }

    if (!totals.has(productId)) {
      order.push(productId);
      totals.set(productId, quantity);
      continue;
    }

    totals.set(
      productId,
      Math.min(MAX_CART_QUANTITY, (totals.get(productId) ?? 0) + quantity),
    );
  }

  return order.map((productId) => ({
    productId,
    quantity: totals.get(productId) ?? 1,
  }));
}

function normalizeShippingAddress(
  address: StorefrontShippingAddress | undefined,
): StorefrontShippingAddress | undefined {
  if (!address) {
    return undefined;
  }

  return {
    fullName: normalizeText(address.fullName),
    phone: normalizeText(address.phone),
    line1: normalizeText(address.line1),
    line2: normalizeText(address.line2),
    ward: normalizeText(address.ward),
    district: normalizeText(address.district),
    city: normalizeText(address.city),
    country: normalizeText(address.country),
    note: normalizeText(address.note),
  };
}

export function normalizeAddresses(
  addresses: StorefrontAddress[],
): StorefrontAddress[] {
  const uniqueAddresses: StorefrontAddress[] = [];
  const seenIds = new Set<string>();

  for (const address of addresses) {
    const id = normalizeText(address.id) || createStorefrontId("address");

    if (seenIds.has(id)) {
      continue;
    }

    seenIds.add(id);
    uniqueAddresses.push({
      id,
      fullName: normalizeText(address.fullName),
      phone: normalizeText(address.phone),
      line1: normalizeText(address.line1),
      line2: normalizeText(address.line2),
      ward: normalizeText(address.ward),
      district: normalizeText(address.district),
      city: normalizeText(address.city),
      country: normalizeText(address.country),
      note: normalizeText(address.note),
      isDefault: address.isDefault === true,
      createdAt: toIsoDate(address.createdAt),
    });

    if (uniqueAddresses.length >= MAX_SAVED_ADDRESSES) {
      break;
    }
  }

  const defaultAddressId =
    uniqueAddresses.find((address) => address.isDefault)?.id ??
    uniqueAddresses[0]?.id;

  return uniqueAddresses.map((address) => ({
    ...address,
    isDefault: address.id === defaultAddressId,
  }));
}

function normalizeOrderLines(
  order: Pick<
    StorefrontOrder,
    "items" | "productId" | "productName" | "quantity" | "totalPi"
  >,
) {
  if (Array.isArray(order.items) && order.items.length > 0) {
    return order.items
      .map((item) => ({
        productId: normalizeText(item.productId),
        productName: normalizeText(item.productName),
        quantity: Math.max(1, Math.round(item.quantity)),
        totalPi: Number(item.totalPi.toFixed(4)),
      }))
      .filter((item) => item.productId && item.productName);
  }

  const productId = normalizeText(order.productId);
  const productName = normalizeText(order.productName);

  if (!productId || !productName) {
    return [];
  }

  return [
    {
      productId,
      productName,
      quantity: Math.max(1, Math.round(order.quantity)),
      totalPi: Number(order.totalPi.toFixed(4)),
    },
  ];
}

export function normalizeOrders(orders: StorefrontOrder[]): StorefrontOrder[] {
  const uniqueOrders: StorefrontOrder[] = [];
  const seenIds = new Set<string>();

  for (const order of orders) {
    const id = normalizeText(order.id) || createStorefrontId("order");

    if (seenIds.has(id)) {
      continue;
    }

    const productId = normalizeText(order.productId);
    const productName = normalizeText(order.productName);

    if (!productId || !productName) {
      continue;
    }

    seenIds.add(id);

    uniqueOrders.push({
      id,
      productId,
      productName,
      quantity: Math.max(1, Math.round(order.quantity)),
      totalPi: Number(order.totalPi.toFixed(4)),
      createdAt: toIsoDate(order.createdAt),
      txid: normalizeText(order.txid) || undefined,
      paymentId: normalizeText(order.paymentId) || undefined,
      username: normalizeText(order.username) || undefined,
      items: normalizeOrderLines(order),
      shippingAddress: normalizeShippingAddress(order.shippingAddress),
    });
  }

  return uniqueOrders
    .sort(
      (left, right) =>
        Date.parse(right.createdAt) - Date.parse(left.createdAt),
    )
    .slice(0, MAX_SAVED_ORDERS);
}

export function normalizeStorefrontState(
  state: Partial<StorefrontStateSnapshot> | undefined,
): StorefrontStateSnapshot {
  return {
    cartItems: normalizeCartItems(state?.cartItems ?? []),
    addresses: normalizeAddresses(state?.addresses ?? []),
    orders: normalizeOrders(state?.orders ?? []),
  };
}

export function mergeStorefrontState(
  remoteState: StorefrontStateSnapshot,
  localState: StorefrontStateSnapshot,
): StorefrontStateSnapshot {
  const remote = normalizeStorefrontState(remoteState);
  const local = normalizeStorefrontState(localState);

  return {
    cartItems: normalizeCartItems([...local.cartItems, ...remote.cartItems]),
    addresses: normalizeAddresses([...local.addresses, ...remote.addresses]),
    orders: normalizeOrders([...local.orders, ...remote.orders]),
  };
}

export function createStorefrontAddress(
  input: StorefrontAddressInput,
): StorefrontAddress {
  return {
    id: createStorefrontId("address"),
    fullName: normalizeText(input.fullName),
    phone: normalizeText(input.phone),
    line1: normalizeText(input.line1),
    line2: normalizeText(input.line2),
    ward: normalizeText(input.ward),
    district: normalizeText(input.district),
    city: normalizeText(input.city),
    country: normalizeText(input.country),
    note: normalizeText(input.note),
    isDefault: input.isDefault === true,
    createdAt: new Date().toISOString(),
  };
}

export function createStorefrontOrder(
  input: StorefrontOrderInput,
): StorefrontOrder {
  return normalizeOrders([
    {
      id: normalizeText(input.id) || createStorefrontId("order"),
      productId: normalizeText(input.productId),
      productName: normalizeText(input.productName),
      quantity: Math.max(1, Math.round(input.quantity)),
      totalPi: Number(input.totalPi.toFixed(4)),
      createdAt: toIsoDate(input.createdAt),
      txid: normalizeText(input.txid) || undefined,
      paymentId: normalizeText(input.paymentId) || undefined,
      username: normalizeText(input.username) || undefined,
      items: input.items,
      shippingAddress: input.shippingAddress,
    },
  ])[0];
}
