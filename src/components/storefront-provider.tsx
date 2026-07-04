"use client";

import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  guestAdminAccess,
  type StorefrontAdminAccess,
} from "@/lib/admin-access";
import type { PiVerifiedUser } from "@/lib/pi-types";
import {
  createStorefrontAddress,
  createStorefrontOrder,
  isStorefrontAddress,
  isStorefrontCartItem,
  isStorefrontOrder,
  normalizeAddresses,
  normalizeCartItems,
  normalizeOrders,
  type StorefrontAddress,
  type StorefrontAddressInput,
  type StorefrontCartItem,
  type StorefrontOrder,
  type StorefrontOrderInput,
  type StorefrontOrderLine,
  type StorefrontStateResponse,
} from "@/lib/storefront-state";

type StorefrontContextValue = {
  adminAccess: StorefrontAdminAccess;
  hydrated: boolean;
  viewer: PiVerifiedUser | null;
  cartItems: StorefrontCartItem[];
  cartCount: number;
  orders: StorefrontOrder[];
  addresses: StorefrontAddress[];
  setViewer: (viewer: PiVerifiedUser | null) => void;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  recordOrder: (order: StorefrontOrderInput) => void;
  saveAddress: (address: StorefrontAddressInput) => string;
  setDefaultAddress: (addressId: string) => void;
};

const CART_STORAGE_KEY = "mushroom.pi.cart";
const VIEWER_STORAGE_KEY = "mushroom.pi.viewer";
const ORDER_STORAGE_KEY = "mushroom.pi.orders";
const ADDRESS_STORAGE_KEY = "mushroom.pi.addresses";
const OWNER_STORAGE_KEY = "mushroom.pi.ownerUid";

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

type InitialStorefrontState = {
  viewer: PiVerifiedUser | null;
  cartItems: StorefrontCartItem[];
  orders: StorefrontOrder[];
  addresses: StorefrontAddress[];
  ownerUid: string | null;
};

function isViewer(value: unknown): value is PiVerifiedUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as PiVerifiedUser;

  return typeof candidate.uid === "string";
}

function isStringOrNull(value: unknown): value is string | null {
  return value === null || typeof value === "string";
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

function serializeCartItems(cartItems: StorefrontCartItem[]) {
  return JSON.stringify(normalizeCartItems(cartItems));
}

function serializeAddresses(addresses: StorefrontAddress[]) {
  return JSON.stringify(normalizeAddresses(addresses));
}

async function postStorefrontState<T>(payload: Record<string, unknown>) {
  const response = await fetch("/api/storefront/state", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Storefront sync failed.",
    );
  }

  return data;
}

function getInitialStorefrontState(): InitialStorefrontState {
  if (typeof window === "undefined") {
    return {
      viewer: null,
      cartItems: [],
      orders: [],
      addresses: [],
      ownerUid: null,
    };
  }

  const viewer = readStorage<PiVerifiedUser | null>(
    VIEWER_STORAGE_KEY,
    null,
    (value): value is PiVerifiedUser | null => value === null || isViewer(value),
  );
  const ownerUid = readStorage<string | null>(
    OWNER_STORAGE_KEY,
    null,
    isStringOrNull,
  );
  const hasOwnerMismatch = Boolean(
    viewer?.uid && ownerUid && ownerUid !== viewer.uid,
  );

  return {
    viewer,
    cartItems: hasOwnerMismatch
      ? []
      : readStorage<StorefrontCartItem[]>(
          CART_STORAGE_KEY,
          [],
          (value): value is StorefrontCartItem[] =>
            Array.isArray(value) && value.every(isStorefrontCartItem),
        ),
    orders: hasOwnerMismatch
      ? []
      : readStorage<StorefrontOrder[]>(
          ORDER_STORAGE_KEY,
          [],
          (value): value is StorefrontOrder[] =>
            Array.isArray(value) && value.every(isStorefrontOrder),
        ),
    addresses: hasOwnerMismatch
      ? []
      : readStorage<StorefrontAddress[]>(
          ADDRESS_STORAGE_KEY,
          [],
          (value): value is StorefrontAddress[] =>
            Array.isArray(value) && value.every(isStorefrontAddress),
        ),
    ownerUid: viewer?.uid ?? ownerUid,
  };
}

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [initialState] = useState<InitialStorefrontState>(getInitialStorefrontState);
  const [hydrated, setHydrated] = useState(false);
  const [viewerState, setViewerState] = useState<PiVerifiedUser | null>(
    initialState.viewer,
  );
  const [cartItems, setCartItems] = useState<StorefrontCartItem[]>(
    initialState.cartItems,
  );
  const [orders, setOrders] = useState<StorefrontOrder[]>(initialState.orders);
  const [addresses, setAddresses] = useState<StorefrontAddress[]>(
    initialState.addresses,
  );
  const [ownerUid, setOwnerUid] = useState<string | null>(initialState.ownerUid);
  const [adminAccess, setAdminAccess] = useState<StorefrontAdminAccess>(
    guestAdminAccess(),
  );
  const [databaseConfigured, setDatabaseConfigured] = useState(false);
  const [syncedViewerUid, setSyncedViewerUid] = useState<string | null>(null);

  const viewerRef = useRef<PiVerifiedUser | null>(viewerState);
  const stateSnapshotRef = useRef({
    cartItems,
    addresses,
    orders,
  });
  const mutationQueueRef = useRef<Promise<void>>(Promise.resolve());
  const lastCartSignatureRef = useRef("");
  const lastAddressSignatureRef = useRef("");

  const viewer = viewerState;
  const viewerUid = viewer?.uid ?? null;

  useEffect(() => {
    viewerRef.current = viewer;
  }, [viewer]);

  useEffect(() => {
    stateSnapshotRef.current = {
      cartItems,
      addresses,
      orders,
    };
  }, [addresses, cartItems, orders]);

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

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (ownerUid) {
      window.localStorage.setItem(OWNER_STORAGE_KEY, JSON.stringify(ownerUid));
      return;
    }

    window.localStorage.removeItem(OWNER_STORAGE_KEY);
  }, [hydrated, ownerUid]);

  useEffect(() => {
    if (!viewerUid) {
      return;
    }

    if (ownerUid && ownerUid !== viewerUid) {
      return;
    }

    let cancelled = false;
    const targetViewerUid = viewerUid;

    void (async () => {
      try {
        const response = await postStorefrontState<StorefrontStateResponse>({
          action: "syncSession",
          ...stateSnapshotRef.current,
        });

        if (cancelled || viewerRef.current?.uid !== targetViewerUid) {
          return;
        }

        lastCartSignatureRef.current = serializeCartItems(response.cartItems);
        lastAddressSignatureRef.current = serializeAddresses(response.addresses);

        setCartItems(response.cartItems);
        setAddresses(response.addresses);
        setOrders(response.orders);
        setDatabaseConfigured(response.databaseConfigured);
        setSyncedViewerUid(targetViewerUid);
      } catch {
        if (cancelled || viewerRef.current?.uid !== targetViewerUid) {
          return;
        }

        setDatabaseConfigured(false);
        setSyncedViewerUid(targetViewerUid);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ownerUid, viewerUid]);

  useEffect(() => {
    if (!viewerUid) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/admin/access", {
          cache: "no-store",
        });
        const data = (await response.json()) as StorefrontAdminAccess;

        if (!cancelled) {
          setAdminAccess(data);
        }
      } catch {
        if (!cancelled) {
          setAdminAccess(guestAdminAccess());
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [viewerUid]);

  const enqueueRemoteMutation = useEffectEvent(
    (payload: Record<string, unknown>) => {
      const targetViewerUid = viewerRef.current?.uid;

      if (!targetViewerUid) {
        return;
      }

      mutationQueueRef.current = mutationQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          if (viewerRef.current?.uid !== targetViewerUid) {
            return;
          }

          try {
            await postStorefrontState(payload);
          } catch {
            return;
          }
        });
    },
  );

  useEffect(() => {
    if (
      !hydrated ||
      !viewerUid ||
      !databaseConfigured ||
      syncedViewerUid !== viewerUid
    ) {
      return;
    }

    const signature = serializeCartItems(cartItems);

    if (signature === lastCartSignatureRef.current) {
      return;
    }

    lastCartSignatureRef.current = signature;
    enqueueRemoteMutation({
      action: "setCart",
      cartItems,
    });
  }, [
    cartItems,
    databaseConfigured,
    hydrated,
    syncedViewerUid,
    viewerUid,
  ]);

  useEffect(() => {
    if (
      !hydrated ||
      !viewerUid ||
      !databaseConfigured ||
      syncedViewerUid !== viewerUid
    ) {
      return;
    }

    const signature = serializeAddresses(addresses);

    if (signature === lastAddressSignatureRef.current) {
      return;
    }

    lastAddressSignatureRef.current = signature;
    enqueueRemoteMutation({
      action: "setAddresses",
      addresses,
    });
  }, [
    addresses,
    databaseConfigured,
    hydrated,
    syncedViewerUid,
    viewerUid,
  ]);

  const setViewer = (nextViewer: PiVerifiedUser | null) => {
    setViewerState(nextViewer);
    setDatabaseConfigured(false);
    setSyncedViewerUid(null);

    if (!nextViewer) {
      setAdminAccess(guestAdminAccess());
      return;
    }

    if (ownerUid && ownerUid !== nextViewer.uid) {
      setCartItems([]);
      setOrders([]);
      setAddresses([]);
      mutationQueueRef.current = Promise.resolve();
      lastCartSignatureRef.current = "";
      lastAddressSignatureRef.current = "";
    }

    if (ownerUid !== nextViewer.uid) {
      setOwnerUid(nextViewer.uid);
    }
  };

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

  const recordOrder = (order: StorefrontOrderInput) => {
    const nextOrder = createStorefrontOrder(order);

    setOrders((current) => normalizeOrders([nextOrder, ...current]));

    if (viewerRef.current?.uid && databaseConfigured) {
      const targetViewerUid = viewerRef.current.uid;

      mutationQueueRef.current = mutationQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          if (viewerRef.current?.uid !== targetViewerUid) {
            return;
          }

          try {
            await postStorefrontState({
              action: "recordOrder",
              order: nextOrder,
            });
          } catch {
            return;
          }
        });
    }
  };

  const saveAddress = (address: StorefrontAddressInput) => {
    const nextAddress = createStorefrontAddress(address);

    setAddresses((current) => {
      const shouldSetDefault =
        current.length === 0 || address.isDefault === true;
      const normalizedCurrent = shouldSetDefault
        ? current.map((entry) => ({ ...entry, isDefault: false }))
        : current;

      return normalizeAddresses([
        {
          ...nextAddress,
          isDefault: shouldSetDefault,
        },
        ...normalizedCurrent,
      ]);
    });

    return nextAddress.id;
  };

  const setDefaultAddress = (addressId: string) => {
    setAddresses((current) =>
      normalizeAddresses(
        current.map((address) => ({
          ...address,
          isDefault: address.id === addressId,
        })),
      ),
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StorefrontContext.Provider
      value={{
        adminAccess,
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

export type {
  StorefrontAddress,
  StorefrontAddressInput,
  StorefrontCartItem,
  StorefrontOrder,
  StorefrontOrderInput,
  StorefrontOrderLine,
};
