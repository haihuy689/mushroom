"use client";

import {
  useCallback,
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
import type { PiAuthResult, PiVerifiedUser } from "@/lib/pi-types";
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
  adminAccessReady: boolean;
  authError: string | null;
  authBusy: boolean;
  hydrated: boolean;
  sessionChecked: boolean;
  sdkReady: boolean;
  viewer: PiVerifiedUser | null;
  cartItems: StorefrontCartItem[];
  cartCount: number;
  orders: StorefrontOrder[];
  addresses: StorefrontAddress[];
  signInWithPi: () => Promise<PiVerifiedUser | null>;
  signOut: () => Promise<void>;
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
const AUTO_AUTH_SKIP_SESSION_KEY = "mushroom.pi.skipAutoAuth";
const PI_SCOPES = ["username", "payments"] as const;
const autoAuthenticateEnabled = process.env.NEXT_PUBLIC_PI_AUTO_AUTH !== "false";
const sandboxEnabled = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

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

function getStorage(type: "localStorage" | "sessionStorage") {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window[type];
  } catch {
    return null;
  }
}

function setStorageItem(
  type: "localStorage" | "sessionStorage",
  key: string,
  value: string,
) {
  try {
    getStorage(type)?.setItem(key, value);
  } catch {
    // Some embedded browsers restrict storage access completely.
  }
}

function removeStorageItem(type: "localStorage" | "sessionStorage", key: string) {
  try {
    getStorage(type)?.removeItem(key);
  } catch {
    // Ignore storage failures so the storefront can still render.
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

async function postJson<T>(path: string, payload?: Record<string, unknown>) {
  const response = await fetch(path, {
    method: payload ? "POST" : "GET",
    headers: payload
      ? {
          "Content-Type": "application/json",
        }
      : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
    cache: "no-store",
  });

  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Request failed.");
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [databaseConfigured, setDatabaseConfigured] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [syncedViewerUid, setSyncedViewerUid] = useState<string | null>(null);
  const [adminAccessReady, setAdminAccessReady] = useState(false);

  const viewerRef = useRef<PiVerifiedUser | null>(viewerState);
  const stateSnapshotRef = useRef({
    cartItems,
    addresses,
    orders,
  });
  const mutationQueueRef = useRef<Promise<void>>(Promise.resolve());
  const lastCartSignatureRef = useRef("");
  const lastAddressSignatureRef = useRef("");
  const autoAuthStartedRef = useRef(false);
  const piInitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const piInitializedRef = useRef(false);

  const viewer = viewerState;
  const viewerUid = viewer?.uid ?? null;

  const clearAutoAuthSkip = () => {
    removeStorageItem("sessionStorage", AUTO_AUTH_SKIP_SESSION_KEY);
  };

  const hasAutoAuthSkip = () => {
    return (
      getStorage("sessionStorage")?.getItem(AUTO_AUTH_SKIP_SESSION_KEY) === "true"
    );
  };

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
    const tryInit = () => {
      if (!window.Pi) {
        piInitTimeoutRef.current = setTimeout(tryInit, 250);
        return;
      }

      if (!piInitializedRef.current) {
        try {
          window.Pi.init({
            version: "2.0",
            sandbox: sandboxEnabled,
          });
          piInitializedRef.current = true;
        } catch {
          piInitTimeoutRef.current = setTimeout(tryInit, 500);
          return;
        }
      }

      setSdkReady(true);
    };

    tryInit();

    return () => {
      if (piInitTimeoutRef.current) {
        clearTimeout(piInitTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    setStorageItem("localStorage", CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (viewer) {
      setStorageItem("localStorage", VIEWER_STORAGE_KEY, JSON.stringify(viewer));
      return;
    }

    removeStorageItem("localStorage", VIEWER_STORAGE_KEY);
  }, [hydrated, viewer]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    setStorageItem("localStorage", ORDER_STORAGE_KEY, JSON.stringify(orders));
  }, [hydrated, orders]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    setStorageItem(
      "localStorage",
      ADDRESS_STORAGE_KEY,
      JSON.stringify(addresses),
    );
  }, [addresses, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (ownerUid) {
      setStorageItem("localStorage", OWNER_STORAGE_KEY, JSON.stringify(ownerUid));
      return;
    }

    removeStorageItem("localStorage", OWNER_STORAGE_KEY);
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
  }, [ownerUid, viewer, viewerUid]);

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
          setAdminAccessReady(true);
        }
      } catch {
        if (!cancelled) {
          setAdminAccess(guestAdminAccess());
          setAdminAccessReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [viewer, viewerUid]);

  const applyViewerChange = useCallback(
    (nextViewer: PiVerifiedUser | null) => {
      const previousViewerUid = viewerRef.current?.uid ?? null;

      setViewerState(nextViewer);
      setDatabaseConfigured(false);
      setSyncedViewerUid(null);
      setAdminAccessReady(!nextViewer);

      if (!nextViewer) {
        setAdminAccess(guestAdminAccess());
        return;
      }

      if (previousViewerUid !== nextViewer.uid) {
        setAdminAccess(guestAdminAccess());
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
    },
    [ownerUid],
  );

  const signInWithPi = useCallback(async () => {
    if (!window.Pi || authBusy) {
      return null;
    }

    setAuthError(null);
    setAuthBusy(true);

    try {
      const authResult: PiAuthResult = await window.Pi.authenticate(
        [...PI_SCOPES],
        async () => undefined,
      );

      const verified = await postJson<{ user: PiVerifiedUser }>("/api/pi/auth", {
        accessToken: authResult.accessToken,
      });

      clearAutoAuthSkip();
      setSessionChecked(true);
      autoAuthStartedRef.current = true;
      applyViewerChange(verified.user);
      return verified.user;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Pi authentication failed.";

      if (!viewerRef.current) {
        setViewerState(null);
      }

      setAuthError(message);
      return null;
    } finally {
      setAuthBusy(false);
    }
  }, [applyViewerChange, authBusy]);

  const signOut = useCallback(async () => {
    setStorageItem("sessionStorage", AUTO_AUTH_SKIP_SESSION_KEY, "true");

    try {
      await fetch("/api/pi/session", {
        method: "DELETE",
        cache: "no-store",
      });
    } catch {
      // Ignore network errors here and still clear client state.
    }

    autoAuthStartedRef.current = true;
    setAuthError(null);
    applyViewerChange(null);
    removeStorageItem("localStorage", VIEWER_STORAGE_KEY);
  }, [applyViewerChange]);

  useEffect(() => {
    if (!hydrated || sessionChecked) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const data = await postJson<{ user: PiVerifiedUser | null }>("/api/pi/session");

        if (cancelled) {
          return;
        }

        setSessionChecked(true);

        if (data.user) {
          clearAutoAuthSkip();
          autoAuthStartedRef.current = true;
          applyViewerChange(data.user);
          return;
        }

        if (viewerRef.current) {
          applyViewerChange(null);
          return;
        }

        setAdminAccess(guestAdminAccess());
        setAdminAccessReady(true);
      } catch {
        if (!cancelled) {
          setSessionChecked(true);

          if (!viewerRef.current) {
            setAdminAccess(guestAdminAccess());
            setAdminAccessReady(true);
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applyViewerChange, hydrated, sessionChecked]);

  useEffect(() => {
    if (
      !autoAuthenticateEnabled ||
      !hydrated ||
      !sdkReady ||
      !sessionChecked ||
      authBusy ||
      autoAuthStartedRef.current ||
      hasAutoAuthSkip()
    ) {
      return;
    }

    if (viewerRef.current) {
      autoAuthStartedRef.current = true;
      return;
    }

    autoAuthStartedRef.current = true;
    const timer = setTimeout(() => {
      void signInWithPi();
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [authBusy, hydrated, sdkReady, sessionChecked, signInWithPi]);

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

  const setViewer = useCallback(
    (nextViewer: PiVerifiedUser | null) => {
      applyViewerChange(nextViewer);
    },
    [applyViewerChange],
  );

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
        adminAccessReady,
        authError,
        authBusy,
        hydrated,
        sessionChecked,
        sdkReady,
        viewer,
        cartItems,
        cartCount,
        orders,
        addresses,
        signInWithPi,
        signOut,
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
