"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ProductThumbnail } from "@/components/product-thumbnail";
import type {
  StorefrontAdminAccess,
  StorefrontStaffMember,
} from "@/lib/admin-access";
import type { AdminCenterCopy } from "@/lib/admin-center-copy";
import type { SiteLocale } from "@/lib/i18n";
import type { OrderCenterCopy } from "@/lib/order-center-copy";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";
import { getOrderStatusCounts, resolveOrderStatus } from "@/lib/order-tracking";
import {
  createEmptyStorefrontProductInput,
  type StorefrontProductInput,
  type StorefrontProductRecord,
} from "@/lib/storefront-product";
import type { StorefrontOrder } from "@/lib/storefront-state";
import styles from "./page.module.css";

type AdminPageClientProps = {
  copy: AdminCenterCopy;
  initialAccess: StorefrontAdminAccess;
  initialCredentialSessionActive: boolean;
  initialOrders: StorefrontOrder[] | null;
  initialProducts: StorefrontProductRecord[] | null;
  initialStaff: StorefrontStaffMember[] | null;
  locale: SiteLocale;
  orderCopy: OrderCenterCopy;
};

type AdminView = "overview" | "products" | "orders" | "staff" | "operations";

type MessageState =
  | { kind: "error"; text: string }
  | { kind: "success"; text: string }
  | null;

type DashboardSnapshot = {
  orders: StorefrontOrder[];
  products: StorefrontProductRecord[];
  staff: StorefrontStaffMember[];
};

type RequestInitWithTimeout = RequestInit & {
  timeoutMs?: number;
};

type ProductEditorMode = "idle" | "create" | "edit";

type StaffEditor = {
  canManageOrders: boolean;
  canManageProducts: boolean;
  canManageStaff: boolean;
  fullName: string;
  identity: string;
  isActive: boolean;
  note: string;
  role: string;
};

type OrderEditor = {
  adminNote: string;
  id: string;
  shippingCarrier: string;
  status: OrderStatus;
  trackingCode: string;
};

async function readJson<T>(path: string, init?: RequestInitWithTimeout) {
  const { timeoutMs = 10000, ...requestInit } = init ?? {};
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(path, {
      ...requestInit,
      headers:
        requestInit.method === "GET" || !requestInit.method
          ? requestInit.headers
          : {
              "Content-Type": "application/json",
              ...(requestInit.headers ?? {}),
            },
      cache: "no-store",
      signal: controller.signal,
    });

    const data = (await response.json()) as T & { error?: string };

    if (!response.ok) {
      throw new Error(
        typeof data.error === "string" ? data.error : "Request failed.",
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The request took too long. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function createEmptyStaffEditor(): StaffEditor {
  return {
    canManageOrders: true,
    canManageProducts: false,
    canManageStaff: false,
    fullName: "",
    identity: "",
    isActive: true,
    note: "",
    role: "staff",
  };
}

function toProductEditor(product: StorefrontProductRecord): StorefrontProductInput {
  return {
    accent: product.accent,
    badge: product.badge,
    category: product.category,
    compareAtPi: product.compareAtPi,
    costPi: product.costPi,
    description: product.description,
    format: product.format,
    id: product.id,
    imageUrl: product.imageUrl,
    inventoryCount: product.inventoryCount,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    lowStockThreshold: product.lowStockThreshold,
    name: product.name,
    packaging: product.packaging,
    pricePi: product.pricePi,
    slug: product.slug,
    sourceProductId: product.sourceProductId,
    sku: product.sku,
    tagline: product.tagline,
    weightUnit: product.weightUnit,
    weightValue: product.weightValue,
  };
}

function toStaffEditor(member: StorefrontStaffMember): StaffEditor {
  return {
    canManageOrders: member.canManageOrders,
    canManageProducts: member.canManageProducts,
    canManageStaff: member.canManageStaff,
    fullName: member.fullName,
    identity: member.identity,
    isActive: member.isActive,
    note: member.note,
    role: member.role,
  };
}

function toOrderEditor(order: StorefrontOrder): OrderEditor {
  return {
    adminNote: order.adminNote ?? "",
    id: order.id,
    shippingCarrier: order.shippingCarrier ?? "",
    status: resolveOrderStatus(order),
    trackingCode: order.trackingCode ?? "",
  };
}

function readFieldValue(
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) {
  const target = event.target;

  if (target instanceof HTMLInputElement && target.type === "checkbox") {
    return target.checked;
  }

  if (target instanceof HTMLInputElement && target.type === "number") {
    return target.value === "" ? "" : Number(target.value);
  }

  return target.value;
}

function normalizeIdentityKey(value: string) {
  return value.trim().toLowerCase();
}

export function AdminPageClient({
  copy,
  initialAccess,
  initialCredentialSessionActive,
  initialOrders,
  initialProducts,
  initialStaff,
  locale,
  orderCopy,
}: AdminPageClientProps) {
  const hasInitialDashboardData =
    initialOrders !== null &&
    initialProducts !== null &&
    initialStaff !== null;
  const [orders, setOrders] = useState<StorefrontOrder[]>(initialOrders ?? []);
  const [products, setProducts] = useState<StorefrontProductRecord[]>(
    initialProducts ?? [],
  );
  const [staff, setStaff] = useState<StorefrontStaffMember[]>(initialStaff ?? []);
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState("");
  const [adminPasswordCurrent, setAdminPasswordCurrent] = useState("");
  const [adminPasswordNew, setAdminPasswordNew] = useState("");
  const [credentialAuthOverride, setCredentialAuthOverride] = useState<boolean | null>(
    null,
  );
  const [dashboardBusy, setDashboardBusy] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [dashboardReady, setDashboardReady] = useState(hasInitialDashboardData);
  const [dashboardRequested, setDashboardRequested] = useState(
    hasInitialDashboardData,
  );
  const [loggingInAdmin, setLoggingInAdmin] = useState(false);
  const [loggingOutAdmin, setLoggingOutAdmin] = useState(false);
  const [changingAdminPassword, setChangingAdminPassword] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);
  const [productMode, setProductMode] = useState<ProductEditorMode>("idle");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productEditor, setProductEditor] = useState<StorefrontProductInput>(
    createEmptyStorefrontProductInput(),
  );
  const [savingProduct, setSavingProduct] = useState(false);
  const [refreshingProducts, setRefreshingProducts] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderEditor, setOrderEditor] = useState<OrderEditor | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [refreshingOrders, setRefreshingOrders] = useState(false);
  const [selectedStaffIdentityKey, setSelectedStaffIdentityKey] = useState<
    string | null
  >(null);
  const [staffMode, setStaffMode] = useState<"create" | "edit">("create");
  const [staffEditor, setStaffEditor] = useState<StaffEditor>(
    createEmptyStaffEditor(),
  );
  const [savingStaff, setSavingStaff] = useState(false);
  const [refreshingStaff, setRefreshingStaff] = useState(false);
  const [deactivatingStaffKey, setDeactivatingStaffKey] = useState<string | null>(
    null,
  );

  const hasCredentialSession =
    credentialAuthOverride ?? initialCredentialSessionActive;
  const canAccessAdmin =
    credentialAuthOverride === false ? false : initialAccess.canAccessAdmin;
  const canManageOrders =
    credentialAuthOverride === false ? false : initialAccess.canManageOrders;
  const canManageProducts =
    credentialAuthOverride === false ? false : initialAccess.canManageProducts;
  const canManageStaff =
    credentialAuthOverride === false ? false : initialAccess.canManageStaff;

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const piFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        maximumFractionDigits: 4,
      }),
    [locale],
  );

  const formatPi = useCallback(
    (value: number) => `${piFormatter.format(Number(value.toFixed(4)))} Pi`,
    [piFormatter],
  );

  const orderCounts = useMemo(() => getOrderStatusCounts(orders), [orders]);
  const activeProducts = useMemo(
    () => products.filter((product) => product.isActive),
    [products],
  );
  const hiddenProducts = useMemo(
    () => products.filter((product) => !product.isActive),
    [products],
  );
  const lowStockProducts = useMemo(
    () =>
      activeProducts.filter(
        (product) => product.inventoryCount <= product.lowStockThreshold,
      ),
    [activeProducts],
  );
  const activeStaff = useMemo(
    () => staff.filter((member) => member.isActive),
    [staff],
  );
  const inactiveStaff = useMemo(
    () => staff.filter((member) => !member.isActive),
    [staff],
  );
  const openOrders = orderCounts.processing + orderCounts.shipping;
  const totalSalesPi = useMemo(
    () =>
      orders.reduce((total, order) => total + Number(order.totalPi || 0), 0),
    [orders],
  );
  const catalogValuePi = useMemo(
    () =>
      products.reduce(
        (total, product) => total + product.inventoryCount * product.pricePi,
        0,
      ),
    [products],
  );

  const statusLabelByKey: Record<OrderStatus, string> = {
    delivered: orderCopy.delivered,
    processing: orderCopy.processing,
    shipping: orderCopy.shipping,
  };

  const productStatusCount = useMemo(
    () => ({
      hidden: hiddenProducts.length,
      lowStock: lowStockProducts.length,
      live: activeProducts.length,
    }),
    [activeProducts.length, hiddenProducts.length, lowStockProducts.length],
  );

  const navigationItems = useMemo(
    () =>
      [
        {
          count: `${orders.length}`,
          id: "overview" as const,
          label: copy.overviewTab,
          visible: true,
        },
        {
          count: `${products.length}`,
          id: "products" as const,
          label: copy.productsTab,
          visible: canManageProducts,
        },
        {
          count: `${openOrders}`,
          id: "orders" as const,
          label: copy.ordersTab,
          visible: canManageOrders,
        },
        {
          count: `${activeStaff.length}`,
          id: "staff" as const,
          label: copy.staffTab,
          visible: canManageStaff,
        },
        {
          count: `${lowStockProducts.length}`,
          id: "operations" as const,
          label: copy.operationsTab,
          visible: true,
        },
      ].filter((item) => item.visible),
    [
      activeStaff.length,
      canManageOrders,
      canManageProducts,
      canManageStaff,
      copy.operationsTab,
      copy.ordersTab,
      copy.overviewTab,
      copy.productsTab,
      copy.staffTab,
      lowStockProducts.length,
      openOrders,
      orders.length,
      products.length,
    ],
  );

  useEffect(() => {
    if (navigationItems.some((item) => item.id === activeView)) {
      return;
    }

    const nextView = navigationItems[0]?.id ?? "overview";
    const frame = window.requestAnimationFrame(() => {
      setActiveView(nextView);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [activeView, navigationItems]);

  const loadDashboardSnapshot = useCallback(async () => {
    setDashboardRequested(true);
    setDashboardBusy(true);
    setDashboardError(null);

    try {
      const data = await readJson<DashboardSnapshot>("/api/admin/dashboard", {
        timeoutMs: 12000,
      });

      setOrders(data.orders);
      setProducts(data.products);
      setStaff(data.staff);
      setDashboardReady(true);
    } catch (error) {
      setDashboardError(
        error instanceof Error ? error.message : copy.dashboardSlowError,
      );
    } finally {
      setDashboardBusy(false);
    }
  }, [copy.dashboardSlowError]);

  useEffect(() => {
    if (
      !canAccessAdmin ||
      dashboardReady ||
      dashboardBusy ||
      dashboardRequested
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      void loadDashboardSnapshot();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    canAccessAdmin,
    dashboardBusy,
    dashboardReady,
    dashboardRequested,
    loadDashboardSnapshot,
  ]);

  useEffect(() => {
    if (!canManageProducts) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (productMode === "idle") {
        if (products.length > 0) {
          setProductMode("edit");
          setSelectedProductId(products[0].id);
          setProductEditor(toProductEditor(products[0]));
          return;
        }

        setProductMode("create");
        setProductEditor(createEmptyStorefrontProductInput());
        return;
      }

      if (productMode === "edit") {
        const selectedProduct =
          products.find((product) => product.id === selectedProductId) ?? null;

        if (selectedProduct) {
          setProductEditor(toProductEditor(selectedProduct));
          return;
        }

        if (products.length > 0) {
          setSelectedProductId(products[0].id);
          setProductEditor(toProductEditor(products[0]));
          return;
        }

        setProductMode("create");
        setSelectedProductId(null);
        setProductEditor(createEmptyStorefrontProductInput());
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [canManageProducts, productMode, products, selectedProductId]);

  useEffect(() => {
    if (!canManageOrders) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (orders.length === 0) {
        setSelectedOrderId(null);
        setOrderEditor(null);
        return;
      }

      const selectedOrder =
        orders.find((order) => order.id === selectedOrderId) ?? orders[0];

      if (selectedOrder.id !== selectedOrderId) {
        setSelectedOrderId(selectedOrder.id);
      }

      setOrderEditor(toOrderEditor(selectedOrder));
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [canManageOrders, orders, selectedOrderId]);

  useEffect(() => {
    if (!canManageStaff) {
      return;
    }

    if (staffMode === "create") {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (staff.length === 0) {
        setSelectedStaffIdentityKey(null);
        setStaffMode("create");
        setStaffEditor(createEmptyStaffEditor());
        return;
      }

      const selectedMember =
        staff.find((member) => member.identityKey === selectedStaffIdentityKey) ??
        staff[0];

      if (selectedMember.identityKey !== selectedStaffIdentityKey) {
        setSelectedStaffIdentityKey(selectedMember.identityKey);
      }

      setStaffEditor(toStaffEditor(selectedMember));
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [canManageStaff, selectedStaffIdentityKey, staff, staffMode]);

  const handleAdminLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoggingInAdmin(true);
    setMessage(null);

    try {
      await readJson("/api/admin/session", {
        method: "POST",
        body: JSON.stringify({
          password: adminPassword,
          username: adminUsername,
        }),
      });

      setCredentialAuthOverride(true);
      setAdminPassword("");
      window.location.replace("/admin");
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setLoggingInAdmin(false);
    }
  };

  const handleAdminLogout = async () => {
    setLoggingOutAdmin(true);
    setMessage(null);

    try {
      await readJson("/api/admin/session", {
        method: "DELETE",
      });

      setCredentialAuthOverride(false);
      window.location.replace("/admin");
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setLoggingOutAdmin(false);
    }
  };

  const handleChangeAdminPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (adminPasswordNew.length < 8) {
      setMessage({
        kind: "error",
        text: copy.adminPasswordTooShortError,
      });
      return;
    }

    if (adminPasswordNew !== adminPasswordConfirm) {
      setMessage({
        kind: "error",
        text: copy.adminPasswordMismatchError,
      });
      return;
    }

    setChangingAdminPassword(true);

    try {
      await readJson("/api/admin/password", {
        method: "PATCH",
        body: JSON.stringify({
          confirmPassword: adminPasswordConfirm,
          currentPassword: adminPasswordCurrent,
          newPassword: adminPasswordNew,
        }),
      });

      setAdminPasswordConfirm("");
      setAdminPasswordCurrent("");
      setAdminPasswordNew("");
      setMessage({
        kind: "success",
        text: copy.adminPasswordChangeSuccess,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setChangingAdminPassword(false);
    }
  };

  const handleRefreshProducts = async () => {
    setRefreshingProducts(true);
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontProductRecord[] }>(
        "/api/admin/products",
      );
      setProducts(data.items);
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setRefreshingProducts(false);
    }
  };

  const handleRefreshOrders = async () => {
    setRefreshingOrders(true);
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontOrder[] }>("/api/admin/orders");
      setOrders(data.items);
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setRefreshingOrders(false);
    }
  };

  const handleRefreshStaff = async () => {
    setRefreshingStaff(true);
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontStaffMember[] }>(
        "/api/admin/staff",
      );
      setStaff(data.items);
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setRefreshingStaff(false);
    }
  };

  const handleStartNewProduct = () => {
    setProductMode("create");
    setSelectedProductId(null);
    setProductEditor(createEmptyStorefrontProductInput());
  };

  const handleSelectProduct = (product: StorefrontProductRecord) => {
    setProductMode("edit");
    setSelectedProductId(product.id);
    setProductEditor(toProductEditor(product));
  };

  const handleProductEditorChange = (
    field: keyof StorefrontProductInput,
    value: boolean | number | string | null,
  ) => {
    setProductEditor((current) => ({
      ...current,
      [field]: value,
    }) as StorefrontProductInput);
  };

  const handleSaveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProduct(true);
    setMessage(null);

    try {
      const data = await readJson<{
        item: StorefrontProductRecord;
        items: StorefrontProductRecord[];
      }>("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(productEditor),
      });

      setProducts(data.items);
      setProductMode("edit");
      setSelectedProductId(data.item.id);
      setProductEditor(toProductEditor(data.item));
      setMessage({
        kind: "success",
        text: copy.saveSuccess,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setSavingProduct(false);
    }
  };

  const handleSelectOrder = (order: StorefrontOrder) => {
    setSelectedOrderId(order.id);
    setOrderEditor(toOrderEditor(order));
  };

  const handleOrderEditorChange = (
    field: keyof OrderEditor,
    value: string,
  ) => {
    setOrderEditor((current) =>
      current
        ? ({
            ...current,
            [field]: value,
          } as OrderEditor)
        : current,
    );
  };

  const handleSaveOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!orderEditor) {
      return;
    }

    setSavingOrder(true);
    setMessage(null);

    try {
      const data = await readJson<{ order: StorefrontOrder }>(
        `/api/admin/orders/${orderEditor.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            adminNote: orderEditor.adminNote,
            shippingCarrier: orderEditor.shippingCarrier,
            status: orderEditor.status,
            trackingCode: orderEditor.trackingCode,
          }),
        },
      );

      setOrders((current) =>
        current.map((order) => (order.id === data.order.id ? data.order : order)),
      );
      setOrderEditor(toOrderEditor(data.order));
      setMessage({
        kind: "success",
        text: copy.saveSuccess,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setSavingOrder(false);
    }
  };

  const handleStartNewStaff = () => {
    setStaffMode("create");
    setSelectedStaffIdentityKey(null);
    setStaffEditor(createEmptyStaffEditor());
  };

  const handleSelectStaff = (member: StorefrontStaffMember) => {
    setStaffMode("edit");
    setSelectedStaffIdentityKey(member.identityKey);
    setStaffEditor(toStaffEditor(member));
  };

  const handleStaffEditorChange = (
    field: keyof StaffEditor,
    value: boolean | string,
  ) => {
    setStaffEditor((current) => ({
      ...current,
      [field]: value,
    }) as StaffEditor);
  };

  const handleSaveStaff = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingStaff(true);
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontStaffMember[] }>(
        "/api/admin/staff",
        {
          method: "POST",
          body: JSON.stringify(staffEditor),
        },
      );

      const selectedIdentityKey = normalizeIdentityKey(staffEditor.identity);
      const selectedMember =
        data.items.find((member) => member.identityKey === selectedIdentityKey) ??
        null;

      setStaff(data.items);

      if (selectedMember) {
        setStaffMode("edit");
        setSelectedStaffIdentityKey(selectedMember.identityKey);
        setStaffEditor(toStaffEditor(selectedMember));
      }

      setMessage({
        kind: "success",
        text: copy.saveSuccess,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setSavingStaff(false);
    }
  };

  const handleDeactivateStaff = async (identity: string) => {
    setDeactivatingStaffKey(normalizeIdentityKey(identity));
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontStaffMember[] }>(
        "/api/admin/staff",
        {
          method: "DELETE",
          body: JSON.stringify({
            identity,
          }),
        },
      );

      const selectedMember =
        data.items.find(
          (member) =>
            member.identityKey === normalizeIdentityKey(identity),
        ) ?? null;

      setStaff(data.items);

      if (selectedMember) {
        setStaffMode("edit");
        setSelectedStaffIdentityKey(selectedMember.identityKey);
        setStaffEditor(toStaffEditor(selectedMember));
      }

      setMessage({
        kind: "success",
        text: copy.saveSuccess,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setDeactivatingStaffKey(null);
    }
  };

  const handleReactivateStaff = async () => {
    setSavingStaff(true);
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontStaffMember[] }>(
        "/api/admin/staff",
        {
          method: "POST",
          body: JSON.stringify({
            ...staffEditor,
            isActive: true,
          }),
        },
      );

      const selectedIdentityKey = normalizeIdentityKey(staffEditor.identity);
      const selectedMember =
        data.items.find((member) => member.identityKey === selectedIdentityKey) ??
        null;

      setStaff(data.items);

      if (selectedMember) {
        setStaffMode("edit");
        setSelectedStaffIdentityKey(selectedMember.identityKey);
        setStaffEditor(toStaffEditor(selectedMember));
      }

      setMessage({
        kind: "success",
        text: copy.saveSuccess,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setSavingStaff(false);
    }
  };

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) ?? null;
  const currentProductRecord =
    selectedProductId !== null
      ? products.find((product) => product.id === selectedProductId) ?? null
      : null;
  const currentStaffRecord =
    selectedStaffIdentityKey !== null
      ? staff.find((member) => member.identityKey === selectedStaffIdentityKey) ??
        null
      : null;

  const renderMessage = message ? (
    <div className={styles.message} data-kind={message.kind}>
      {message.text}
    </div>
  ) : null;

  if (!canAccessAdmin) {
    return (
      <div className={styles.authPage}>
        {renderMessage}
        <section className={styles.authCard}>
          <p className={styles.eyebrow}>{copy.ownerPanel}</p>
          <h1>{copy.adminLoginTitle}</h1>
          <p className={styles.authLead}>{copy.adminLoginLead}</p>

          <form className={styles.authForm} onSubmit={handleAdminLogin}>
            <label className={styles.field}>
              <span>{copy.adminLoginUsernameLabel}</span>
              <input
                autoComplete="username"
                required
                value={adminUsername}
                onChange={(event) => setAdminUsername(event.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>{copy.adminLoginPasswordLabel}</span>
              <input
                autoComplete="current-password"
                required
                type="password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
              />
            </label>

            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loggingInAdmin}
            >
              {loggingInAdmin ? copy.savingLabel : copy.adminLoginButton}
            </button>
          </form>

          <p className={styles.authNote}>{copy.noAccessBody}</p>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <p className={styles.eyebrow}>{copy.ownerPanel}</p>
            <h1>{copy.adminTitle}</h1>
            <p className={styles.sidebarLead}>{copy.adminLead}</p>
          </div>

          <nav className={styles.navigation}>
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.navButton}
                data-active={activeView === item.id}
                onClick={() => setActiveView(item.id)}
              >
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </button>
            ))}
          </nav>

          <div className={styles.sidebarCard}>
            <div className={styles.metaRow}>
              <span>{copy.latestSync}</span>
              <strong>
                {dashboardReady
                  ? dateFormatter.format(new Date())
                  : copy.dashboardLoading}
              </strong>
            </div>
            <div className={styles.metaRow}>
              <span>{copy.statusLabel}</span>
              <strong>{hasCredentialSession ? "Admin" : "Guest"}</strong>
            </div>
            <div className={styles.sidebarActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  void loadDashboardSnapshot();
                }}
              >
                {copy.dashboardRetry}
              </button>
              {hasCredentialSession ? (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  disabled={loggingOutAdmin}
                  onClick={() => {
                    void handleAdminLogout();
                  }}
                >
                  {loggingOutAdmin ? copy.savingLabel : copy.adminLogoutButton}
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        <main className={styles.workspace}>
          {renderMessage}

          {dashboardBusy && !dashboardReady ? (
            <div className={styles.message}>{copy.dashboardLoading}</div>
          ) : null}

          {dashboardError ? (
            <div className={styles.message} data-kind="error">
              <div className={styles.errorRow}>
                <span>{dashboardError}</span>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    void loadDashboardSnapshot();
                  }}
                >
                  {copy.dashboardRetry}
                </button>
              </div>
            </div>
          ) : null}

          <section className={styles.hero}>
            <div>
              <p className={styles.eyebrow}>{copy.ownerPanel}</p>
              <h2>{copy.adminTitle}</h2>
              <p className={styles.heroLead}>{copy.adminLead}</p>
            </div>

            <div className={styles.metrics}>
              <article className={styles.metricCard}>
                <span>{orderCopy.orders}</span>
                <strong>{numberFormatter.format(orders.length)}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{copy.openOrdersLabel}</span>
                <strong>{numberFormatter.format(openOrders)}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{copy.totalSalesLabel}</span>
                <strong>{formatPi(totalSalesPi)}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{copy.catalogValueLabel}</span>
                <strong>{formatPi(catalogValuePi)}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{copy.lowStockLabel}</span>
                <strong>{numberFormatter.format(lowStockProducts.length)}</strong>
              </article>
              <article className={styles.metricCard}>
                <span>{copy.inactiveStaffLabel}</span>
                <strong>{numberFormatter.format(inactiveStaff.length)}</strong>
              </article>
            </div>
          </section>

          {activeView === "overview" ? (
            <section className={styles.sectionStack}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.sectionEyebrow}>{copy.overviewTab}</p>
                  <h3>{copy.adminTitle}</h3>
                </div>
              </div>

              <div className={styles.overviewGrid}>
                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.operationsTitle}</p>
                      <h4>{copy.lowStockLabel}</h4>
                    </div>
                  </div>
                  {lowStockProducts.length === 0 ? (
                    <p className={styles.emptyState}>{copy.allClearLabel}</p>
                  ) : (
                    <div className={styles.simpleList}>
                      {lowStockProducts.slice(0, 5).map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          className={styles.simpleRow}
                          onClick={() => {
                            setActiveView("products");
                            handleSelectProduct(product);
                          }}
                        >
                          <div>
                            <strong>{product.name}</strong>
                            <span>{product.sku || product.slug}</span>
                          </div>
                          <span className={styles.rowValue}>
                            {product.inventoryCount} / {product.lowStockThreshold}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </article>

                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.ordersTab}</p>
                      <h4>{copy.recentOrdersTitle}</h4>
                    </div>
                  </div>
                  {orders.length === 0 ? (
                    <p className={styles.emptyState}>{copy.emptyOrders}</p>
                  ) : (
                    <div className={styles.simpleList}>
                      {orders.slice(0, 5).map((order) => (
                        <button
                          key={order.id}
                          type="button"
                          className={styles.simpleRow}
                          onClick={() => {
                            setActiveView("orders");
                            handleSelectOrder(order);
                          }}
                        >
                          <div>
                            <strong>#{order.id.slice(-8).toUpperCase()}</strong>
                            <span>{order.username ?? order.shopperUid ?? "--"}</span>
                          </div>
                          <span className={styles.rowValue}>
                            {formatPi(order.totalPi)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </article>

                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.staffTab}</p>
                      <h4>{copy.teamOverviewTitle}</h4>
                    </div>
                  </div>
                  {staff.length === 0 ? (
                    <p className={styles.emptyState}>{copy.emptyStaff}</p>
                  ) : (
                    <div className={styles.teamStack}>
                      <div className={styles.teamMetric}>
                        <span>{copy.staffManagerTitle}</span>
                        <strong>{numberFormatter.format(activeStaff.length)}</strong>
                      </div>
                      <div className={styles.teamMetric}>
                        <span>{copy.inactiveStaffLabel}</span>
                        <strong>{numberFormatter.format(inactiveStaff.length)}</strong>
                      </div>
                      <div className={styles.simpleList}>
                        {staff.slice(0, 4).map((member) => (
                          <button
                            key={member.identityKey}
                            type="button"
                            className={styles.simpleRow}
                            onClick={() => {
                              setActiveView("staff");
                              handleSelectStaff(member);
                            }}
                          >
                            <div>
                              <strong>{member.fullName || member.identity}</strong>
                              <span>{member.role}</span>
                            </div>
                            <span
                              className={styles.statusChip}
                              data-tone={member.isActive ? "success" : "muted"}
                            >
                              {member.isActive ? copy.staffActiveLabel : copy.inactiveStaffLabel}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </div>
            </section>
          ) : null}

          {activeView === "products" && canManageProducts ? (
            <section className={styles.sectionStack}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.sectionEyebrow}>{copy.productsTab}</p>
                  <h3>{copy.catalogManagerTitle}</h3>
                  <p className={styles.sectionLead}>{copy.catalogManagerLead}</p>
                </div>
                <div className={styles.headerActions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    disabled={refreshingProducts}
                    onClick={() => {
                      void handleRefreshProducts();
                    }}
                  >
                    {refreshingProducts ? copy.savingLabel : copy.productsRefresh}
                  </button>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={handleStartNewProduct}
                  >
                    {copy.newProductButton}
                  </button>
                </div>
              </div>

              <div className={styles.detailGrid}>
                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.catalogManagerTitle}</p>
                      <h4>{products.length}</h4>
                    </div>
                    <div className={styles.inlineMetrics}>
                      <span>{copy.productLiveStatus}: {productStatusCount.live}</span>
                      <span>{copy.productHiddenStatus}: {productStatusCount.hidden}</span>
                      <span>{copy.lowStockLabel}: {productStatusCount.lowStock}</span>
                    </div>
                  </div>

                  {products.length === 0 ? (
                    <p className={styles.emptyState}>{copy.emptyProducts}</p>
                  ) : (
                    <div className={styles.selectionList}>
                      {products.map((product) => {
                        const inventoryTone =
                          product.inventoryCount <= 0
                            ? "danger"
                            : product.inventoryCount <= product.lowStockThreshold
                              ? "warning"
                              : "success";
                        const isCustomProduct = !product.sourceProductId;

                        return (
                          <button
                            key={product.id}
                            type="button"
                            className={styles.selectionRow}
                            data-active={selectedProductId === product.id}
                            onClick={() => handleSelectProduct(product)}
                          >
                            <ProductThumbnail
                              accent={product.accent}
                              compact
                              imageUrl={product.imageUrl || undefined}
                              name={product.name}
                              productId={product.id}
                            />
                            <div className={styles.selectionCopy}>
                              <div className={styles.selectionTitle}>
                                <strong>{product.name}</strong>
                                <span>{product.sku || product.slug}</span>
                              </div>
                              <div className={styles.tagRow}>
                                <span className={styles.statusChip} data-tone={product.isActive ? "success" : "muted"}>
                                  {product.isActive
                                    ? copy.productLiveStatus
                                    : copy.productHiddenStatus}
                                </span>
                                <span className={styles.statusChip} data-tone={inventoryTone}>
                                  {product.inventoryCount > 0
                                    ? copy.productInStockStatus
                                    : copy.productOutOfStockStatus}
                                </span>
                                <span className={styles.statusChip} data-tone={isCustomProduct ? "accent" : "neutral"}>
                                  {isCustomProduct
                                    ? copy.productCustomLabel
                                    : copy.productSystemLabel}
                                </span>
                              </div>
                            </div>
                            <div className={styles.selectionMeta}>
                              <strong>{formatPi(product.pricePi)}</strong>
                              <span>
                                {copy.inventoryLabel}: {product.inventoryCount}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </article>

                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>
                        {productMode === "create"
                          ? copy.newProductTitle
                          : copy.editProductTitle}
                      </p>
                      <h4>
                        {productMode === "create"
                          ? copy.newProductTitle
                          : currentProductRecord?.name ?? copy.editProductTitle}
                      </h4>
                    </div>
                  </div>

                  {productMode === "idle" ? (
                    <p className={styles.emptyState}>{copy.selectProductPrompt}</p>
                  ) : (
                    <form className={styles.formStack} onSubmit={handleSaveProduct}>
                      <div className={styles.previewCard}>
                        <ProductThumbnail
                          accent={productEditor.accent}
                          imageUrl={productEditor.imageUrl || undefined}
                          name={productEditor.name || "Product"}
                          productId={productEditor.id || productEditor.slug || "draft"}
                        />
                        <div>
                          <strong>{productEditor.name || copy.newProductTitle}</strong>
                          <span>{productEditor.sku || productEditor.slug || "--"}</span>
                          <div className={styles.tagRow}>
                            <span className={styles.statusChip} data-tone={productEditor.isActive ? "success" : "muted"}>
                              {productEditor.isActive
                                ? copy.productLiveStatus
                                : copy.productHiddenStatus}
                            </span>
                            <span className={styles.statusChip} data-tone={productEditor.isFeatured ? "accent" : "neutral"}>
                              {copy.featuredProductLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.formGrid}>
                        <label className={styles.field}>
                          <span>{copy.productNameLabel}</span>
                          <input
                            required
                            value={productEditor.name}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "name",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.productSlugLabel}</span>
                          <input
                            value={productEditor.slug}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "slug",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.skuLabel}</span>
                          <input
                            value={productEditor.sku}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "sku",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.productCategoryLabel}</span>
                          <input
                            value={productEditor.category}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "category",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.priceLabel}</span>
                          <input
                            min="0"
                            required
                            step="0.0001"
                            type="number"
                            value={productEditor.pricePi}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "pricePi",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.comparePriceLabel}</span>
                          <input
                            min="0"
                            step="0.0001"
                            type="number"
                            value={productEditor.compareAtPi ?? ""}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "compareAtPi",
                                readFieldValue(event) === ""
                                  ? null
                                  : readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.costPriceLabel}</span>
                          <input
                            min="0"
                            step="0.0001"
                            type="number"
                            value={productEditor.costPi ?? ""}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "costPi",
                                readFieldValue(event) === ""
                                  ? null
                                  : readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.inventoryLabel}</span>
                          <input
                            min="0"
                            step="1"
                            type="number"
                            value={productEditor.inventoryCount}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "inventoryCount",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.lowStockThresholdLabel}</span>
                          <input
                            min="0"
                            step="1"
                            type="number"
                            value={productEditor.lowStockThreshold}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "lowStockThreshold",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.packagingLabel}</span>
                          <input
                            value={productEditor.packaging}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "packaging",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.productFormatLabel}</span>
                          <input
                            value={productEditor.format}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "format",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.weightValueLabel}</span>
                          <input
                            min="0"
                            step="0.01"
                            type="number"
                            value={productEditor.weightValue ?? ""}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "weightValue",
                                readFieldValue(event) === ""
                                  ? null
                                  : readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.weightUnitLabel}</span>
                          <input
                            value={productEditor.weightUnit ?? ""}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "weightUnit",
                                readFieldValue(event) === ""
                                  ? null
                                  : readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.imageUrlLabel}</span>
                          <input
                            value={productEditor.imageUrl}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "imageUrl",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.productBadgeLabel}</span>
                          <input
                            value={productEditor.badge}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "badge",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.productAccentLabel}</span>
                          <input
                            value={productEditor.accent}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "accent",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={`${styles.field} ${styles.checkboxField}`}>
                          <span>{copy.productActiveLabel}</span>
                          <input
                            checked={productEditor.isActive}
                            type="checkbox"
                            onChange={(event) =>
                              handleProductEditorChange(
                                "isActive",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={`${styles.field} ${styles.checkboxField}`}>
                          <span>{copy.featuredProductLabel}</span>
                          <input
                            checked={productEditor.isFeatured}
                            type="checkbox"
                            onChange={(event) =>
                              handleProductEditorChange(
                                "isFeatured",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={`${styles.field} ${styles.fullField}`}>
                          <span>{copy.productTaglineLabel}</span>
                          <input
                            value={productEditor.tagline}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "tagline",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={`${styles.field} ${styles.fullField}`}>
                          <span>{copy.productDescriptionLabel}</span>
                          <textarea
                            rows={5}
                            value={productEditor.description}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "description",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                      </div>

                      <div className={styles.formActions}>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={handleStartNewProduct}
                        >
                          {copy.newProductButton}
                        </button>
                        <button
                          type="submit"
                          className={styles.primaryButton}
                          disabled={savingProduct}
                        >
                          {savingProduct ? copy.savingLabel : copy.saveProductButton}
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              </div>
            </section>
          ) : null}

          {activeView === "orders" && canManageOrders ? (
            <section className={styles.sectionStack}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.sectionEyebrow}>{copy.ordersTab}</p>
                  <h3>{copy.orderManagerTitle}</h3>
                  <p className={styles.sectionLead}>{copy.orderManagerLead}</p>
                </div>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  disabled={refreshingOrders}
                  onClick={() => {
                    void handleRefreshOrders();
                  }}
                >
                  {refreshingOrders ? copy.savingLabel : copy.refreshOrders}
                </button>
              </div>

              <div className={styles.detailGrid}>
                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.statusLabel}</p>
                      <h4>{orderCopy.orders}</h4>
                    </div>
                    <div className={styles.inlineMetrics}>
                      <span>{orderCopy.processing}: {orderCounts.processing}</span>
                      <span>{orderCopy.shipping}: {orderCounts.shipping}</span>
                      <span>{orderCopy.delivered}: {orderCounts.delivered}</span>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <p className={styles.emptyState}>{copy.emptyOrders}</p>
                  ) : (
                    <div className={styles.selectionList}>
                      {orders.map((order) => {
                        const status = resolveOrderStatus(order);

                        return (
                          <button
                            key={order.id}
                            type="button"
                            className={styles.selectionRow}
                            data-active={selectedOrderId === order.id}
                            onClick={() => handleSelectOrder(order)}
                          >
                            <div className={styles.selectionCopy}>
                              <div className={styles.selectionTitle}>
                                <strong>#{order.id.slice(-8).toUpperCase()}</strong>
                                <span>{order.username ?? order.shopperUid ?? "--"}</span>
                              </div>
                              <div className={styles.tagRow}>
                                <span className={styles.statusChip} data-tone={status}>
                                  {statusLabelByKey[status]}
                                </span>
                              </div>
                            </div>
                            <div className={styles.selectionMeta}>
                              <strong>{formatPi(order.totalPi)}</strong>
                              <span>{dateFormatter.format(new Date(order.createdAt))}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </article>

                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.orderManagerTitle}</p>
                      <h4>
                        {selectedOrder
                          ? `#${selectedOrder.id.slice(-8).toUpperCase()}`
                          : copy.orderManagerTitle}
                      </h4>
                    </div>
                  </div>

                  {!selectedOrder || !orderEditor ? (
                    <p className={styles.emptyState}>{copy.selectOrderPrompt}</p>
                  ) : (
                    <form className={styles.formStack} onSubmit={handleSaveOrder}>
                      <div className={styles.summaryGrid}>
                        <div className={styles.summaryCard}>
                          <span>{copy.customerLabel}</span>
                          <strong>
                            {selectedOrder.username ?? selectedOrder.shopperUid ?? "--"}
                          </strong>
                        </div>
                        <div className={styles.summaryCard}>
                          <span>{copy.paymentIdLabel}</span>
                          <strong>{selectedOrder.paymentId ?? "--"}</strong>
                        </div>
                        <div className={styles.summaryCard}>
                          <span>{copy.txidLabel}</span>
                          <strong>{selectedOrder.txid ?? "--"}</strong>
                        </div>
                        <div className={styles.summaryCard}>
                          <span>{copy.priceLabel}</span>
                          <strong>{formatPi(selectedOrder.totalPi)}</strong>
                        </div>
                      </div>

                      <div className={styles.formGrid}>
                        <label className={styles.field}>
                          <span>{copy.orderCodeLabel}</span>
                          <input value={selectedOrder.id} disabled />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.statusLabel}</span>
                          <select
                            value={orderEditor.status}
                            onChange={(event) =>
                              handleOrderEditorChange(
                                "status",
                                String(readFieldValue(event)),
                              )
                            }
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {statusLabelByKey[status]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.field}>
                          <span>{copy.shippingCarrierLabel}</span>
                          <input
                            value={orderEditor.shippingCarrier}
                            onChange={(event) =>
                              handleOrderEditorChange(
                                "shippingCarrier",
                                String(readFieldValue(event)),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.trackingCodeLabel}</span>
                          <input
                            value={orderEditor.trackingCode}
                            onChange={(event) =>
                              handleOrderEditorChange(
                                "trackingCode",
                                String(readFieldValue(event)),
                              )
                            }
                          />
                        </label>
                        <label className={`${styles.field} ${styles.fullField}`}>
                          <span>{copy.internalNoteLabel}</span>
                          <textarea
                            rows={4}
                            value={orderEditor.adminNote}
                            onChange={(event) =>
                              handleOrderEditorChange(
                                "adminNote",
                                String(readFieldValue(event)),
                              )
                            }
                          />
                        </label>
                      </div>

                      {selectedOrder.shippingAddress ? (
                        <div className={styles.infoBlock}>
                          <strong>{copy.orderAddress}</strong>
                          <span>
                            {selectedOrder.shippingAddress.fullName} |{" "}
                            {selectedOrder.shippingAddress.phone}
                          </span>
                          <span>
                            {[
                              selectedOrder.shippingAddress.line1,
                              selectedOrder.shippingAddress.line2,
                              selectedOrder.shippingAddress.ward,
                              selectedOrder.shippingAddress.district,
                              selectedOrder.shippingAddress.city,
                              selectedOrder.shippingAddress.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      ) : null}

                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        <div className={styles.infoBlock}>
                          <strong>{copy.orderItems}</strong>
                          <ul className={styles.itemList}>
                            {selectedOrder.items.map((item) => (
                              <li key={`${selectedOrder.id}-${item.productId}`}>
                                <span>{item.productName}</span>
                                <strong>
                                  {item.quantity} x / {formatPi(item.totalPi)}
                                </strong>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <div className={styles.formActions}>
                        <button
                          type="submit"
                          className={styles.primaryButton}
                          disabled={savingOrder}
                        >
                          {savingOrder ? copy.savingLabel : copy.saveOrderButton}
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              </div>
            </section>
          ) : null}

          {activeView === "staff" && canManageStaff ? (
            <section className={styles.sectionStack}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.sectionEyebrow}>{copy.staffTab}</p>
                  <h3>{copy.staffManagerTitle}</h3>
                  <p className={styles.sectionLead}>{copy.staffManagerLead}</p>
                </div>
                <div className={styles.headerActions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    disabled={refreshingStaff}
                    onClick={() => {
                      void handleRefreshStaff();
                    }}
                  >
                    {refreshingStaff ? copy.savingLabel : copy.dashboardRetry}
                  </button>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={handleStartNewStaff}
                  >
                    {copy.newStaffButton}
                  </button>
                </div>
              </div>

              <div className={styles.detailGrid}>
                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.staffManagerTitle}</p>
                      <h4>{staff.length}</h4>
                    </div>
                    <div className={styles.inlineMetrics}>
                      <span>{copy.staffActiveLabel}: {activeStaff.length}</span>
                      <span>{copy.inactiveStaffLabel}: {inactiveStaff.length}</span>
                    </div>
                  </div>

                  {staff.length === 0 ? (
                    <p className={styles.emptyState}>{copy.emptyStaff}</p>
                  ) : (
                    <div className={styles.selectionList}>
                      {staff.map((member) => (
                        <button
                          key={member.identityKey}
                          type="button"
                          className={styles.selectionRow}
                          data-active={selectedStaffIdentityKey === member.identityKey}
                          onClick={() => handleSelectStaff(member)}
                        >
                          <div className={styles.selectionCopy}>
                            <div className={styles.selectionTitle}>
                              <strong>{member.fullName || member.identity}</strong>
                              <span>{member.identity}</span>
                            </div>
                            <div className={styles.tagRow}>
                              <span className={styles.statusChip} data-tone={member.isActive ? "success" : "muted"}>
                                {member.isActive ? copy.staffActiveLabel : copy.inactiveStaffLabel}
                              </span>
                              <span className={styles.statusChip} data-tone="neutral">
                                {member.role}
                              </span>
                            </div>
                          </div>
                          <div className={styles.selectionMeta}>
                            <span>{copy.staffAddedBy}</span>
                            <strong>{member.addedBy}</strong>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </article>

                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>
                        {staffMode === "edit"
                          ? copy.editStaffTitle
                          : copy.newStaffTitle}
                      </p>
                      <h4>
                        {staffMode === "edit"
                          ? currentStaffRecord?.fullName ||
                            currentStaffRecord?.identity ||
                            copy.editStaffTitle
                          : copy.newStaffTitle}
                      </h4>
                    </div>
                  </div>

                  {staffMode === "edit" && !currentStaffRecord ? (
                    <p className={styles.emptyState}>{copy.selectStaffPrompt}</p>
                  ) : (
                    <form className={styles.formStack} onSubmit={handleSaveStaff}>
                      <div className={styles.formGrid}>
                        <label className={styles.field}>
                          <span>{copy.staffIdentityLabel}</span>
                          <input
                            required
                            value={staffEditor.identity}
                            onChange={(event) =>
                              handleStaffEditorChange(
                                "identity",
                                String(readFieldValue(event)),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.staffFullNameLabel}</span>
                          <input
                            value={staffEditor.fullName}
                            onChange={(event) =>
                              handleStaffEditorChange(
                                "fullName",
                                String(readFieldValue(event)),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.staffRoleLabel}</span>
                          <input
                            value={staffEditor.role}
                            onChange={(event) =>
                              handleStaffEditorChange(
                                "role",
                                String(readFieldValue(event)),
                              )
                            }
                          />
                        </label>
                        <label className={`${styles.field} ${styles.checkboxField}`}>
                          <span>{copy.staffActiveLabel}</span>
                          <input
                            checked={staffEditor.isActive}
                            type="checkbox"
                            onChange={(event) =>
                              handleStaffEditorChange(
                                "isActive",
                                event.target.checked,
                              )
                            }
                          />
                        </label>
                        <label className={`${styles.field} ${styles.fullField}`}>
                          <span>{copy.staffNoteLabel}</span>
                          <textarea
                            rows={4}
                            value={staffEditor.note}
                            onChange={(event) =>
                              handleStaffEditorChange(
                                "note",
                                String(readFieldValue(event)),
                              )
                            }
                          />
                        </label>
                      </div>

                      <div className={styles.permissionBlock}>
                        <p className={styles.permissionTitle}>
                          {copy.staffPermissionsLabel}
                        </p>
                        <div className={styles.permissionGrid}>
                          <label className={styles.permissionItem}>
                            <input
                              checked={staffEditor.canManageOrders}
                              type="checkbox"
                              onChange={(event) =>
                                handleStaffEditorChange(
                                  "canManageOrders",
                                  event.target.checked,
                                )
                              }
                            />
                            <span>{copy.staffManageOrdersLabel}</span>
                          </label>
                          <label className={styles.permissionItem}>
                            <input
                              checked={staffEditor.canManageProducts}
                              type="checkbox"
                              onChange={(event) =>
                                handleStaffEditorChange(
                                  "canManageProducts",
                                  event.target.checked,
                                )
                              }
                            />
                            <span>{copy.staffManageProductsLabel}</span>
                          </label>
                          <label className={styles.permissionItem}>
                            <input
                              checked={staffEditor.canManageStaff}
                              type="checkbox"
                              onChange={(event) =>
                                handleStaffEditorChange(
                                  "canManageStaff",
                                  event.target.checked,
                                )
                              }
                            />
                            <span>{copy.staffManageStaffLabel}</span>
                          </label>
                        </div>
                      </div>

                      <div className={styles.formActions}>
                        <button
                          type="button"
                          className={styles.secondaryButton}
                          onClick={handleStartNewStaff}
                        >
                          {copy.newStaffButton}
                        </button>
                        {currentStaffRecord ? (
                          <button
                            type="button"
                            className={styles.secondaryButton}
                            disabled={
                              deactivatingStaffKey === currentStaffRecord.identityKey ||
                              savingStaff
                            }
                            onClick={() => {
                              if (currentStaffRecord.isActive) {
                                void handleDeactivateStaff(currentStaffRecord.identity);
                                return;
                              }

                              void handleReactivateStaff();
                            }}
                          >
                            {deactivatingStaffKey === currentStaffRecord.identityKey ||
                            savingStaff
                              ? copy.savingLabel
                              : currentStaffRecord.isActive
                                ? copy.removeStaff
                                : copy.reactivateStaff}
                          </button>
                        ) : null}
                        <button
                          type="submit"
                          className={styles.primaryButton}
                          disabled={savingStaff}
                        >
                          {savingStaff ? copy.savingLabel : copy.saveStaffButton}
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              </div>
            </section>
          ) : null}

          {activeView === "operations" ? (
            <section className={styles.sectionStack}>
              <div className={styles.sectionHeader}>
                <div>
                  <p className={styles.sectionEyebrow}>{copy.operationsTab}</p>
                  <h3>{copy.operationsTitle}</h3>
                  <p className={styles.sectionLead}>{copy.operationsLead}</p>
                </div>
              </div>

              <div className={styles.overviewGrid}>
                <article className={`${styles.panel} ${styles.widePanel}`}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>
                        {copy.operationsTab}
                      </p>
                      <h4>{copy.adminPasswordSecurityTitle}</h4>
                      <p className={styles.sectionLead}>
                        {copy.adminPasswordSecurityLead}
                      </p>
                    </div>
                  </div>

                  <form
                    className={styles.formStack}
                    onSubmit={handleChangeAdminPassword}
                  >
                    <div className={styles.formGrid}>
                      <label className={styles.field}>
                        <span>{copy.adminPasswordCurrentLabel}</span>
                        <input
                          autoComplete="current-password"
                          required
                          type="password"
                          value={adminPasswordCurrent}
                          onChange={(event) =>
                            setAdminPasswordCurrent(event.target.value)
                          }
                        />
                      </label>
                      <label className={styles.field}>
                        <span>{copy.adminPasswordNewLabel}</span>
                        <input
                          autoComplete="new-password"
                          minLength={8}
                          required
                          type="password"
                          value={adminPasswordNew}
                          onChange={(event) =>
                            setAdminPasswordNew(event.target.value)
                          }
                        />
                      </label>
                      <label className={styles.field}>
                        <span>{copy.adminPasswordConfirmLabel}</span>
                        <input
                          autoComplete="new-password"
                          minLength={8}
                          required
                          type="password"
                          value={adminPasswordConfirm}
                          onChange={(event) =>
                            setAdminPasswordConfirm(event.target.value)
                          }
                        />
                      </label>
                    </div>

                    <div className={styles.formActions}>
                      <button
                        type="submit"
                        className={styles.primaryButton}
                        disabled={changingAdminPassword}
                      >
                        {changingAdminPassword
                          ? copy.savingLabel
                          : copy.adminPasswordChangeButton}
                      </button>
                    </div>
                  </form>
                </article>

                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.productsTab}</p>
                      <h4>{copy.lowStockLabel}</h4>
                    </div>
                  </div>
                  {lowStockProducts.length === 0 ? (
                    <p className={styles.emptyState}>{copy.allClearLabel}</p>
                  ) : (
                    <div className={styles.simpleList}>
                      {lowStockProducts.map((product) => (
                        <div key={product.id} className={styles.simpleStaticRow}>
                          <div>
                            <strong>{product.name}</strong>
                            <span>{product.sku || product.slug}</span>
                          </div>
                          <span className={styles.rowValue}>
                            {product.inventoryCount} / {product.lowStockThreshold}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>

                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.productsTab}</p>
                      <h4>{copy.productHiddenStatus}</h4>
                    </div>
                  </div>
                  {hiddenProducts.length === 0 ? (
                    <p className={styles.emptyState}>{copy.noHiddenProductsLabel}</p>
                  ) : (
                    <div className={styles.simpleList}>
                      {hiddenProducts.map((product) => (
                        <div key={product.id} className={styles.simpleStaticRow}>
                          <div>
                            <strong>{product.name}</strong>
                            <span>{product.sku || product.slug}</span>
                          </div>
                          <span className={styles.rowValue}>{formatPi(product.pricePi)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>

                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.ordersTab}</p>
                      <h4>{copy.openOrdersLabel}</h4>
                    </div>
                  </div>
                  {orders.length === 0 ? (
                    <p className={styles.emptyState}>{copy.emptyOrders}</p>
                  ) : (
                    <div className={styles.simpleList}>
                      {orders
                        .filter((order) => resolveOrderStatus(order) !== "delivered")
                        .slice(0, 8)
                        .map((order) => {
                          const status = resolveOrderStatus(order);
                          return (
                            <div key={order.id} className={styles.simpleStaticRow}>
                              <div>
                                <strong>#{order.id.slice(-8).toUpperCase()}</strong>
                                <span>{order.username ?? order.shopperUid ?? "--"}</span>
                              </div>
                              <span className={styles.statusChip} data-tone={status}>
                                {statusLabelByKey[status]}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </article>

                <article className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.staffTab}</p>
                      <h4>{copy.teamOverviewTitle}</h4>
                    </div>
                  </div>
                  {staff.length === 0 ? (
                    <p className={styles.emptyState}>{copy.emptyStaff}</p>
                  ) : (
                    <div className={styles.simpleList}>
                      {staff.slice(0, 8).map((member) => (
                        <div key={member.identityKey} className={styles.simpleStaticRow}>
                          <div>
                            <strong>{member.fullName || member.identity}</strong>
                            <span>{member.role}</span>
                          </div>
                          <span
                            className={styles.statusChip}
                            data-tone={member.isActive ? "success" : "muted"}
                          >
                            {member.isActive ? copy.staffActiveLabel : copy.inactiveStaffLabel}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
