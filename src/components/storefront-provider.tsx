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
};

type RecordOrderInput = Omit<StorefrontOrder, "createdAt" | "id">;

type StorefrontContextValue = {
  hydrated: boolean;
  viewer: PiVerifiedUser | null;
  cartItems: CartItem[];
  cartCount: number;
  orders: StorefrontOrder[];
  setViewer: (viewer: PiVerifiedUser | null) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  recordOrder: (order: RecordOrderInput) => void;
};

const CART_STORAGE_KEY = "mushroom.pi.cart";
const VIEWER_STORAGE_KEY = "mushroom.pi.viewer";
const ORDER_STORAGE_KEY = "mushroom.pi.orders";

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

function isOrder(value: unknown): value is StorefrontOrder {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as StorefrontOrder;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.productId === "string" &&
    typeof candidate.productName === "string" &&
    typeof candidate.quantity === "number" &&
    typeof candidate.totalPi === "number" &&
    typeof candidate.createdAt === "string"
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

  const addToCart = (productId: string) => {
    setCartItems((current) => {
      const match = current.find((item) => item.productId === productId);
      if (!match) {
        return [...current, { productId, quantity: 1 }];
      }

      return current.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, 99),
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

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StorefrontContext.Provider
      value={{
        hydrated,
        viewer,
        cartItems,
        cartCount,
        orders,
        setViewer,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        recordOrder,
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
