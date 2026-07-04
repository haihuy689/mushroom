"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { PiVerifiedUser } from "@/lib/pi-types";

type CartItem = {
  productId: string;
  quantity: number;
};

export type StorefrontAddress = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  note?: string;
  isDefault: boolean;
  createdAt: string;
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
  shippingAddress?: Omit<StorefrontAddress, "createdAt" | "id" | "isDefault">;
};

type AddressInput = Omit<StorefrontAddress, "createdAt" | "id" | "isDefault"> & {
  isDefault?: boolean;
};

type RecordOrderInput = Omit<StorefrontOrder, "createdAt" | "id">;

type StorefrontContextValue = {
  hydrated: boolean;
  viewer: PiVerifiedUser | null;
  cartItems: CartItem[];
  cartCount: number;
  orders: StorefrontOrder[];
  addresses: StorefrontAddress[];
  setViewer: (viewer: PiVerifiedUser | null) => void;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  recordOrder: (order: RecordOrderInput) => void;
  saveAddress: (address: AddressInput) => string;
  setDefaultAddress: (addressId: string) => void;
};

const CART_STORAGE_KEY = "mushroom.pi.cart";
const VIEWER_STORAGE_KEY = "mushroom.pi.viewer";
const ORDER_STORAGE_KEY = "mushroom.pi.orders";
const ADDRESS_STORAGE_KEY = "mushroom.pi.addresses";

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as CartItem;
  return (
    typeof candidate.productId === "string" &&
    typeof candidate.quantity === "number" &&
    Number.isFinite(candidate.quantity) &&
    candidate.quantity > 0
  );
}

function isViewer(value: unknown): value is PiVerifiedUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as PiVerifiedUser;
  return typeof candidate.uid === "string";
}

function isAddress(value: unknown): value is StorefrontAddress {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as StorefrontAddress;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.fullName === "string" &&
    typeof candidate.phone === "string" &&
    typeof candidate.line1 === "string" &&
    typeof candidate.ward === "string" &&
    typeof candidate.district === "string" &&
    typeof candidate.city === "string" &&
    typeof candidate.country === "string" &&
    typeof candidate.isDefault === "boolean" &&
    typeof candidate.createdAt === "string"
  );
}

function isOrderLine(value: unknown): value is StorefrontOrderLine {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as StorefrontOrderLine;
  return (
    typeof candidate.productId === "string" &&
    typeof candidate.productName === "string" &&
    typeof candidate.quantity === "number" &&
    typeof candidate.totalPi === "number"
  );
}

function isOrder(value: unknown): value is StorefrontOrder {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as StorefrontOrder;
  const hasValidItems =
    candidate.items === undefined ||
    (Array.isArray(candidate.items) && candidate.items.every(isOrderLine));
  const hasValidShippingAddress =
    candidate.shippingAddress === undefined ||
    (typeof candidate.shippingAddress === "object" &&
      candidate.shippingAddress !== null &&
      typeof candidate.shippingAddress.fullName === "string" &&
      typeof candidate.shippingAddress.phone === "string" &&
      typeof candidate.shippingAddress.line1 === "string" &&
      typeof candidate.shippingAddress.ward === "string" &&
      typeof candidate.shippingAddress.district === "string" &&
      typeof candidate.shippingAddress.city === "string" &&
      typeof candidate.shippingAddress.country === "string");

  return (
    typeof candidate.id === "string" &&
    typeof candidate.productId === "string" &&
    typeof candidate.productName === "string" &&
    typeof candidate.quantity === "number" &&
    typeof candidate.totalPi === "number" &&
    typeof candidate.createdAt === "string" &&
    hasValidItems &&
    hasValidShippingAddress
  );
}

function readStorage<T>(
  key: string,
  fallback: T,
  guard: (value: unknown) => value is T,
) {
  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return fallback;
    }

    const parsed = JSON.parse(rawValue) as unknown;
    return guard(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [viewer, setViewer] = useState<PiVerifiedUser | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return readStorage<PiVerifiedUser | null>(
      VIEWER_STORAGE_KEY,
      null,
      (value): value is PiVerifiedUser | null => value === null || isViewer(value),
    );
  });
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return readStorage<CartItem[]>(
      CART_STORAGE_KEY,
      [],
      (value): value is CartItem[] => Array.isArray(value) && value.every(isCartItem),
    );
  });
  const [orders, setOrders] = useState<StorefrontOrder[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return readStorage<StorefrontOrder[]>(
      ORDER_STORAGE_KEY,
      [],
      (value): value is StorefrontOrder[] => Array.isArray(value) && value.every(isOrder),
    );
  });
  const [addresses, setAddresses] = useState<StorefrontAddress[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    return readStorage<StorefrontAddress[]>(
      ADDRESS_STORAGE_KEY,
      [],
      (value): value is StorefrontAddress[] =>
        Array.isArray(value) && value.every(isAddress),
    );
  });

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setHydrated(true);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (viewer) {
      window.localStorage.setItem(VIEWER_STORAGE_KEY, JSON.stringify(viewer));
      return;
    }

    window.localStorage.removeItem(VIEWER_STORAGE_KEY);
  }, [hydrated, viewer]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  }, [hydrated, orders]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses, hydrated]);

  const addToCart = (productId: string, quantity = 1) => {
    const normalizedQuantity = Math.max(1, Math.min(99, quantity));

    setCartItems((current) => {
      const match = current.find((item) => item.productId === productId);
      if (!match) {
        return [...current, { productId, quantity: normalizedQuantity }];
      }

      return current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(item.quantity + normalizedQuantity, 99),
            }
          : item,
      );
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((current) =>
      current.filter((item) => item.productId !== productId),
    );
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(quantity, 99),
            }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const recordOrder = (order: RecordOrderInput) => {
    setOrders((current) => [
      {
        ...order,
        id: `${order.productId}-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ].slice(0, 24));
  };

  const saveAddress = (address: AddressInput) => {
    const nextId = `address-${Date.now()}`;

    setAddresses((current) => {
      const shouldSetDefault =
        current.length === 0 || address.isDefault === true;
      const normalizedCurrent = shouldSetDefault
        ? current.map((entry) => ({ ...entry, isDefault: false }))
        : current;

      return [
        {
          id: nextId,
          fullName: address.fullName.trim(),
          phone: address.phone.trim(),
          line1: address.line1.trim(),
          line2: address.line2?.trim() || "",
          ward: address.ward.trim(),
          district: address.district.trim(),
          city: address.city.trim(),
          country: address.country.trim(),
          note: address.note?.trim() || "",
          isDefault: shouldSetDefault,
          createdAt: new Date().toISOString(),
        },
        ...normalizedCurrent,
      ].slice(0, 8);
    });

    return nextId;
  };

  const setDefaultAddress = (addressId: string) => {
    setAddresses((current) =>
      current.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      })),
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StorefrontContext.Provider
      value={{
        hydrated,
        viewer,
        cartItems,
        cartCount,
        orders,
        addresses,
        setViewer,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        recordOrder,
        saveAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const value = useContext(StorefrontContext);

  if (!value) {
    throw new Error("useStorefront must be used within StorefrontProvider.");
  }

  return value;
}
