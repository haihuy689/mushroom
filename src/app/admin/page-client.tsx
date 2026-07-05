"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  PRODUCT_OPTION_GROUPS,
  createProductOptionMap,
  normalizeProductOptionValue,
  type StorefrontProductOption,
  type StorefrontProductOptionGroup,
} from "@/lib/product-options";
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
type ProductMediaUploadKind = "cover" | "gallery" | "video";

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
type ProductOptionEditor = {
  group: StorefrontProductOptionGroup;
  selectedValue: string;
  value: string;
};

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
  deliveredAt: string;
  fulfillmentStaff: string;
  id: string;
  receivedBy: string;
  shippingCarrier: string;
  shipperName: string;
  status: OrderStatus;
  trackingCode: string;
};

type ProductMediaUploadResponse = {
  item: {
    url: string;
  };
};

async function uploadAdminProductMedia(
  file: File,
  kind: ProductMediaUploadKind,
) {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("kind", kind);

  const response = await fetch("/api/admin/uploads", {
    body: formData,
    cache: "no-store",
    method: "POST",
  });
  const data = (await response.json()) as ProductMediaUploadResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Unable to upload file.",
    );
  }

  return data.item.url;
}

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

    const rawResponse = await response.text();
    let data: (T & { error?: string }) | null = null;

    try {
      data = rawResponse
        ? (JSON.parse(rawResponse) as T & { error?: string })
        : ({} as T & { error?: string });
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data && typeof data.error === "string"
          ? data.error
          : rawResponse || `Request failed with status ${response.status}.`,
      );
    }

    if (!data) {
      throw new Error("Server returned an invalid response.");
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

function createEmptyProductOptionEditor(): ProductOptionEditor {
  return {
    group: "category",
    selectedValue: "",
    value: "",
  };
}

function getProductOptionField(group: StorefrontProductOptionGroup) {
  switch (group) {
    case "category":
      return "category";
    case "format":
      return "format";
    case "packaging":
      return "packaging";
    case "weightUnit":
      return "weightUnit";
  }
}

function toProductEditor(product: StorefrontProductRecord): StorefrontProductInput {
  return {
    accent: product.accent,
    badge: product.badge,
    category: product.category,
    compareAtPi: product.compareAtPi,
    costPi: product.costPi,
    actualSoldCount: product.actualSoldCount,
    baseSoldCount: product.baseSoldCount,
    description: product.description,
    format: product.format,
    galleryImageUrls: product.galleryImageUrls,
    id: product.id,
    imageUrl: product.imageUrl,
    inventoryCount: product.inventoryCount,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    lowStockThreshold: product.lowStockThreshold,
    name: product.name,
    packaging: product.packaging,
    pricePi: product.pricePi,
    mediaNote: product.mediaNote,
    slug: product.slug,
    sourceProductId: product.sourceProductId,
    sku: product.sku,
    tagline: product.tagline,
    videoUrl: product.videoUrl,
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
    deliveredAt: toDateTimeLocalValue(order.deliveredAt),
    fulfillmentStaff: order.fulfillmentStaff ?? "",
    id: order.id,
    receivedBy: order.receivedBy ?? "",
    shippingCarrier: order.shippingCarrier ?? "",
    shipperName: order.shipperName ?? "",
    status: resolveOrderStatus(order),
    trackingCode: order.trackingCode ?? "",
  };
}

function toDateTimeLocalValue(value: string | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (part: number) => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDateTimeLocalValue(value: string) {
  if (!value.trim()) {
    return "";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function readFieldValue(
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
) {
  const target = event.target;

  if (target instanceof HTMLInputElement && target.type === "checkbox") {
    return target.checked;
  }

  if (target instanceof HTMLInputElement && target.type === "number") {
    const normalizedValue = target.value.trim().replace(/\s+/g, "").replace(",", ".");

    if (normalizedValue === "") {
      return "";
    }

    const numericValue = Number(normalizedValue);

    return Number.isFinite(numericValue) ? numericValue : target.value;
  }

  return target.value;
}

function readAdminNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value.trim().replace(/\s+/g, "").replace(",", "."));
  }

  return NaN;
}

function getDisplayedSoldCount(
  product: Pick<StorefrontProductInput, "actualSoldCount" | "baseSoldCount">,
) {
  return Math.max(
    0,
    Math.round((product.baseSoldCount ?? 0) + (product.actualSoldCount ?? 0)),
  );
}

function getMediaFileName(url: string) {
  try {
    const pathName = new URL(url).pathname;
    const fileName = pathName.split("/").pop();

    return fileName ? decodeURIComponent(fileName) : "Uploaded file";
  } catch {
    return url.split("/").pop() || "Uploaded file";
  }
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
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const adminUsername = "admin";
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
  const [uploadingMediaKind, setUploadingMediaKind] =
    useState<ProductMediaUploadKind | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [refreshingProducts, setRefreshingProducts] = useState(false);
  const [productOptions, setProductOptions] = useState(
    createProductOptionMap(),
  );
  const productOptionsRequestedRef = useRef(false);
  const [savingProductOption, setSavingProductOption] = useState(false);
  const [deletingProductOption, setDeletingProductOption] = useState(false);
  const [productOptionEditor, setProductOptionEditor] =
    useState<ProductOptionEditor>(createEmptyProductOptionEditor());
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
    credentialAuthOverride === true
      ? true
      : credentialAuthOverride === false
        ? false
        : initialAccess.canAccessAdmin;
  const canManageOrders =
    credentialAuthOverride === true
      ? true
      : credentialAuthOverride === false
        ? false
        : initialAccess.canManageOrders;
  const canManageProducts =
    credentialAuthOverride === true
      ? true
      : credentialAuthOverride === false
        ? false
        : initialAccess.canManageProducts;
  const canManageStaff =
    credentialAuthOverride === true
      ? true
      : credentialAuthOverride === false
        ? false
        : initialAccess.canManageStaff;

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
  const openOrders =
    orderCounts.pending_payment +
    orderCounts.payment_failed +
    orderCounts.paid +
    orderCounts.confirmed +
    orderCounts.preparing +
    orderCounts.shipping;
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
    confirmed: orderCopy.confirmed,
    delivered: orderCopy.delivered,
    paid: orderCopy.paid,
    payment_failed: orderCopy.paymentFailed,
    pending_payment: orderCopy.pendingPayment,
    preparing: orderCopy.preparing,
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

  const productOptionGroupLabels = useMemo(
    () =>
      ({
        category: copy.productCategoryLabel,
        format: copy.productFormatLabel,
        packaging: copy.packagingLabel,
        weightUnit: copy.weightUnitLabel,
      }) satisfies Record<StorefrontProductOptionGroup, string>,
    [
      copy.packagingLabel,
      copy.productCategoryLabel,
      copy.productFormatLabel,
      copy.weightUnitLabel,
    ],
  );

  const productSelectOptions = useMemo(() => {
    const optionMap = createProductOptionMap(
      PRODUCT_OPTION_GROUPS.flatMap((group) =>
        productOptions[group].map((value) => ({
          createdAt: "",
          group,
          updatedAt: "",
          value,
        })),
      ),
    );

    const addValue = (
      group: StorefrontProductOptionGroup,
      value: string | null | undefined,
    ) => {
      const normalizedValue = normalizeProductOptionValue(value);

      if (normalizedValue && !optionMap[group].includes(normalizedValue)) {
        optionMap[group].push(normalizedValue);
      }
    };

    for (const product of products) {
      addValue("category", product.category);
      addValue("format", product.format);
      addValue("packaging", product.packaging);
      addValue("weightUnit", product.weightUnit);
    }

    addValue("category", productEditor.category);
    addValue("format", productEditor.format);
    addValue("packaging", productEditor.packaging);
    addValue("weightUnit", productEditor.weightUnit);

    for (const group of PRODUCT_OPTION_GROUPS) {
      optionMap[group] = Array.from(new Set(optionMap[group])).sort((a, b) =>
        a.localeCompare(b, locale),
      );
    }

    return optionMap;
  }, [
    locale,
    productEditor.category,
    productEditor.format,
    productEditor.packaging,
    productEditor.weightUnit,
    productOptions,
    products,
  ]);

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

  const handleRefreshProductOptions = useCallback(async () => {
    const data = await readJson<{ items: StorefrontProductOption[] }>(
      "/api/admin/product-options",
    );

    setProductOptions(createProductOptionMap(data.items));
  }, []);

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
        timeoutMs: 30000,
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

    if (!productOptionsRequestedRef.current) {
      productOptionsRequestedRef.current = true;
      void handleRefreshProductOptions().catch((error) => {
        productOptionsRequestedRef.current = false;
        setMessage({
          kind: "error",
          text: error instanceof Error ? error.message : copy.saveError,
        });
      });
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
  }, [
    canManageProducts,
    copy.saveError,
    handleRefreshProductOptions,
    productMode,
    products,
    selectedProductId,
  ]);

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
          password: adminPassword.trim(),
          username: adminUsername.trim(),
        }),
        timeoutMs: 20000,
      });

      setCredentialAuthOverride(true);
      setAdminPassword("");
      setDashboardReady(false);
      setDashboardRequested(false);
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
    value: boolean | number | string | string[] | null,
  ) => {
    setProductEditor((current) => ({
      ...current,
      [field]: value,
    }) as StorefrontProductInput);
  };

  const handleProductMediaUpload = async (
    kind: ProductMediaUploadKind,
    files: File[],
  ) => {
    if (files.length === 0) {
      return;
    }

    setUploadingMediaKind(kind);
    setMessage(null);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        uploadedUrls.push(await uploadAdminProductMedia(file, kind));
      }

      setProductEditor((current) => {
        if (kind === "cover") {
          return {
            ...current,
            imageUrl: uploadedUrls[0] ?? current.imageUrl,
          };
        }

        if (kind === "video") {
          return {
            ...current,
            videoUrl: uploadedUrls[0] ?? current.videoUrl,
          };
        }

        return {
          ...current,
          galleryImageUrls: Array.from(
            new Set([...(current.galleryImageUrls ?? []), ...uploadedUrls]),
          ).slice(0, 12),
        };
      });
      setMessage({
        kind: "success",
        text: copy.mediaUploadSuccess,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setUploadingMediaKind(null);
    }
  };

  const handleRemoveGalleryImage = (url: string) => {
    setProductEditor((current) => ({
      ...current,
      galleryImageUrls: (current.galleryImageUrls ?? []).filter(
        (item) => item !== url,
      ),
    }));
  };

  const handleSaveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProduct(true);
    setMessage(null);

    try {
      const pricePi = readAdminNumber(productEditor.pricePi);

      if (!productEditor.name.trim() || !Number.isFinite(pricePi) || pricePi < 0) {
        setMessage({
          kind: "error",
          text: copy.productRequiredFieldsError,
        });
        return;
      }

      const data = await readJson<{
        item: StorefrontProductRecord;
        items: StorefrontProductRecord[];
      }>("/api/admin/products", {
        method: "POST",
        timeoutMs: 30000,
        body: JSON.stringify({
          ...productEditor,
          pricePi,
          sourceProductId: null,
        }),
      });

      setProducts(data.items);
      setProductMode("edit");
      setSelectedProductId(data.item.id);
      setProductEditor(toProductEditor(data.item));
      setMessage({
        kind: "success",
        text: copy.saveProductSuccess,
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

  const handleDeleteProduct = async () => {
    const productId = selectedProductId;

    if (!productId || !window.confirm(copy.deleteProductConfirm)) {
      return;
    }

    setDeletingProduct(true);
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontProductRecord[] }>(
        "/api/admin/products",
        {
          method: "DELETE",
          timeoutMs: 30000,
          body: JSON.stringify({
            id: productId,
          }),
        },
      );

      setProducts(data.items);

      if (data.items.length > 0) {
        setProductMode("edit");
        setSelectedProductId(data.items[0].id);
        setProductEditor(toProductEditor(data.items[0]));
      } else {
        setProductMode("create");
        setSelectedProductId(null);
        setProductEditor(createEmptyStorefrontProductInput());
      }

      setMessage({
        kind: "success",
        text: copy.deleteProductSuccess,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setDeletingProduct(false);
    }
  };

  const handleProductOptionGroupChange = (
    group: StorefrontProductOptionGroup,
  ) => {
    setProductOptionEditor({
      group,
      selectedValue: "",
      value: "",
    });
  };

  const handleProductOptionSelectionChange = (value: string) => {
    setProductOptionEditor((current) => ({
      ...current,
      selectedValue: value,
      value,
    }));
  };

  const handleSaveProductOption = async () => {
    const value = normalizeProductOptionValue(productOptionEditor.value);

    if (!value) {
      setMessage({
        kind: "error",
        text: copy.productOptionRequiredError,
      });
      return;
    }

    setSavingProductOption(true);
    setMessage(null);

    try {
      const isUpdate = Boolean(productOptionEditor.selectedValue);
      const data = await readJson<{
        items: StorefrontProductOption[];
        products?: StorefrontProductRecord[];
      }>("/api/admin/product-options", {
        method: isUpdate ? "PATCH" : "POST",
        body: JSON.stringify({
          group: productOptionEditor.group,
          nextValue: value,
          value: productOptionEditor.selectedValue || value,
        }),
      });

      setProductOptions(createProductOptionMap(data.items));

      if (data.products) {
        setProducts(data.products);
      }

      const field = getProductOptionField(productOptionEditor.group);

      setProductEditor((current) => ({
        ...current,
        [field]: current[field] === productOptionEditor.selectedValue ? value : current[field],
      }) as StorefrontProductInput);
      setProductOptionEditor((current) => ({
        ...current,
        selectedValue: value,
        value,
      }));
      setMessage({
        kind: "success",
        text: copy.productOptionSaved,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setSavingProductOption(false);
    }
  };

  const handleDeleteProductOption = async () => {
    if (
      !productOptionEditor.selectedValue ||
      !window.confirm(copy.productOptionDeleteConfirm)
    ) {
      return;
    }

    setDeletingProductOption(true);
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontProductOption[] }>(
        "/api/admin/product-options",
        {
          method: "DELETE",
          body: JSON.stringify({
            group: productOptionEditor.group,
            value: productOptionEditor.selectedValue,
          }),
        },
      );

      setProductOptions(createProductOptionMap(data.items));
      setProductOptionEditor((current) => ({
        ...current,
        selectedValue: "",
        value: "",
      }));
      setMessage({
        kind: "success",
        text: copy.productOptionDeleted,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.saveError,
      });
    } finally {
      setDeletingProductOption(false);
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
            deliveredAt: fromDateTimeLocalValue(orderEditor.deliveredAt),
            fulfillmentStaff: orderEditor.fulfillmentStaff,
            receivedBy: orderEditor.receivedBy,
            shippingCarrier: orderEditor.shippingCarrier,
            shipperName: orderEditor.shipperName,
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
            <div className={styles.staticAccount}>
              <span>{copy.adminLoginUsernameLabel}</span>
              <strong>{adminUsername}</strong>
            </div>
            <label className={styles.field}>
              <span>{copy.adminLoginPasswordLabel}</span>
              <div className={styles.passwordInputRow}>
                <input
                  autoComplete="off"
                  inputMode="numeric"
                  name="mushroom-admin-passcode"
                  required
                  type={showAdminPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                />
                <button
                  aria-label={
                    showAdminPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                  className={styles.passwordToggle}
                  type="button"
                  onClick={() =>
                    setShowAdminPassword((currentValue) => !currentValue)
                  }
                >
                  {showAdminPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
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
                    <div className={styles.productTable}>
                      {products.map((product) => {
                        const inventoryTone =
                          product.inventoryCount <= 0
                            ? "danger"
                            : product.inventoryCount <= product.lowStockThreshold
                              ? "warning"
                              : "success";
                        const isAdminProduct = !product.sourceProductId;

                        return (
                          <button
                            key={product.id}
                            type="button"
                            className={styles.productTableRow}
                            data-active={selectedProductId === product.id}
                            onClick={() => handleSelectProduct(product)}
                          >
                            <div className={styles.productTableProduct}>
                              <ProductThumbnail
                                accent={product.accent}
                                compact
                                imageUrl={product.imageUrl || undefined}
                                name={product.name}
                                productId={product.id}
                              />
                              <div className={styles.selectionTitle}>
                                <strong>{product.name}</strong>
                                <span>{product.sku || product.slug}</span>
                              </div>
                            </div>
                            <div className={styles.productTableStatus}>
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
                              <span className={styles.statusChip} data-tone={isAdminProduct ? "accent" : "neutral"}>
                                {isAdminProduct
                                  ? copy.productCustomLabel
                                  : copy.productSystemLabel}
                              </span>
                            </div>
                            <div className={styles.productTableMeta}>
                              <span>
                                <small>{copy.priceLabel}</small>
                                <strong>{formatPi(product.pricePi)}</strong>
                              </span>
                              <span>
                                <small>{copy.inventoryLabel}</small>
                                <strong>{product.inventoryCount} / {product.lowStockThreshold}</strong>
                              </span>
                              <span>
                                <small>{copy.totalSoldCountLabel}</small>
                                <strong>{getDisplayedSoldCount(product)}</strong>
                              </span>
                              <span>
                                <small>{copy.featuredProductLabel}</small>
                                <strong>
                                  {product.isFeatured ? copy.featuredProductsLabel : "-"}
                                </strong>
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
                    <form
                      className={styles.formStack}
                      noValidate
                      onSubmit={handleSaveProduct}
                    >
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
                          <select
                            value={productEditor.category}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "category",
                                readFieldValue(event),
                              )
                            }
                          >
                            {productSelectOptions.category.map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
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
                          <span>{copy.baseSoldCountLabel}</span>
                          <input
                            min="0"
                            step="1"
                            type="number"
                            value={productEditor.baseSoldCount}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "baseSoldCount",
                                readFieldValue(event),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.actualSoldCountLabel}</span>
                          <input
                            readOnly
                            type="number"
                            value={productEditor.actualSoldCount}
                          />
                        </label>
                        <label className={`${styles.field} ${styles.fullField}`}>
                          <span>{copy.totalSoldCountLabel}</span>
                          <input
                            readOnly
                            value={getDisplayedSoldCount(productEditor)}
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.packagingLabel}</span>
                          <select
                            value={productEditor.packaging}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "packaging",
                                readFieldValue(event),
                              )
                            }
                          >
                            <option value="">--</option>
                            {productSelectOptions.packaging.map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className={styles.field}>
                          <span>{copy.productFormatLabel}</span>
                          <select
                            value={productEditor.format}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "format",
                                readFieldValue(event),
                              )
                            }
                          >
                            {productSelectOptions.format.map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
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
                          <select
                            value={productEditor.weightUnit ?? ""}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "weightUnit",
                                readFieldValue(event) === ""
                                  ? null
                                  : readFieldValue(event),
                              )
                            }
                          >
                            <option value="">--</option>
                            {productSelectOptions.weightUnit.map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </label>
                        <div className={styles.field}>
                          <span>{copy.imageUrlLabel}</span>
                          <label className={styles.uploadDropzone}>
                            <input
                              accept="image/jpeg,image/png,image/webp"
                              disabled={uploadingMediaKind !== null}
                              type="file"
                              onChange={(event) => {
                                const files = Array.from(
                                  event.currentTarget.files ?? [],
                                );
                                event.currentTarget.value = "";
                                void handleProductMediaUpload("cover", files);
                              }}
                            />
                            <strong>
                              {uploadingMediaKind === "cover"
                                ? copy.mediaUploadingLabel
                                : copy.uploadCoverImageLabel}
                            </strong>
                            <small>{copy.coverImageHelp}</small>
                          </label>
                          {productEditor.imageUrl ? (
                            <div className={styles.mediaFileRow}>
                              <span>{getMediaFileName(productEditor.imageUrl)}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleProductEditorChange("imageUrl", "")
                                }
                              >
                                {copy.removeMediaButton}
                              </button>
                            </div>
                          ) : null}
                        </div>
                        <div className={`${styles.field} ${styles.fullField}`}>
                          <span>{copy.galleryImagesLabel}</span>
                          <label className={styles.uploadDropzone}>
                            <input
                              accept="image/jpeg,image/png,image/webp"
                              disabled={uploadingMediaKind !== null}
                              multiple
                              type="file"
                              onChange={(event) => {
                                const files = Array.from(
                                  event.currentTarget.files ?? [],
                                );
                                event.currentTarget.value = "";
                                void handleProductMediaUpload("gallery", files);
                              }}
                            />
                            <strong>
                              {uploadingMediaKind === "gallery"
                                ? copy.mediaUploadingLabel
                                : copy.uploadGalleryImagesLabel}
                            </strong>
                            <small>{copy.galleryImagesHelp}</small>
                          </label>
                          {(productEditor.galleryImageUrls ?? []).length > 0 ? (
                            <div className={styles.mediaList}>
                              {(productEditor.galleryImageUrls ?? []).map((url, index) => (
                                <div key={`${url}-${index}`} className={styles.mediaFileRow}>
                                  <span>{getMediaFileName(url)}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(url)}
                                  >
                                    {copy.removeMediaButton}
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <div className={`${styles.field} ${styles.fullField}`}>
                          <span>{copy.videoUrlLabel}</span>
                          <label className={styles.uploadDropzone}>
                            <input
                              accept="video/mp4,video/webm,video/quicktime"
                              disabled={uploadingMediaKind !== null}
                              type="file"
                              onChange={(event) => {
                                const files = Array.from(
                                  event.currentTarget.files ?? [],
                                );
                                event.currentTarget.value = "";
                                void handleProductMediaUpload("video", files);
                              }}
                            />
                            <strong>
                              {uploadingMediaKind === "video"
                                ? copy.mediaUploadingLabel
                                : copy.uploadProductVideoLabel}
                            </strong>
                            <small>{copy.videoUrlHelp}</small>
                          </label>
                          {productEditor.videoUrl ? (
                            <div className={styles.mediaFileRow}>
                              <span>{getMediaFileName(productEditor.videoUrl)}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleProductEditorChange("videoUrl", "")
                                }
                              >
                                {copy.removeMediaButton}
                              </button>
                            </div>
                          ) : null}
                        </div>
                        <label className={`${styles.field} ${styles.fullField}`}>
                          <span>{copy.mediaNoteLabel}</span>
                          <textarea
                            rows={3}
                            value={productEditor.mediaNote}
                            onChange={(event) =>
                              handleProductEditorChange(
                                "mediaNote",
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
                        {productMode === "edit" && selectedProductId ? (
                          <button
                            type="button"
                            className={styles.dangerButton}
                            disabled={deletingProduct}
                            onClick={() => {
                              void handleDeleteProduct();
                            }}
                          >
                            {deletingProduct
                              ? copy.savingLabel
                              : copy.deleteProductButton}
                          </button>
                        ) : null}
                      </div>
                      {message ? (
                        <div
                          className={styles.inlineFormMessage}
                          data-kind={message.kind}
                        >
                          {message.text}
                        </div>
                      ) : null}
                    </form>
                  )}
                </article>

                <article className={`${styles.panel} ${styles.widePanel}`}>
                  <div className={styles.panelHeader}>
                    <div>
                      <p className={styles.sectionEyebrow}>{copy.productsTab}</p>
                      <h4>{copy.productOptionTitle}</h4>
                      <p className={styles.sectionLead}>{copy.productOptionLead}</p>
                    </div>
                  </div>

                  <div className={styles.optionManager}>
                    <label className={styles.field}>
                      <span>{copy.productOptionGroupLabel}</span>
                      <select
                        value={productOptionEditor.group}
                        onChange={(event) =>
                          handleProductOptionGroupChange(
                            event.currentTarget
                              .value as StorefrontProductOptionGroup,
                          )
                        }
                      >
                        {PRODUCT_OPTION_GROUPS.map((group) => (
                          <option key={group} value={group}>
                            {productOptionGroupLabels[group]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={styles.field}>
                      <span>{copy.productOptionExistingLabel}</span>
                      <select
                        value={productOptionEditor.selectedValue}
                        onChange={(event) =>
                          handleProductOptionSelectionChange(
                            event.currentTarget.value,
                          )
                        }
                      >
                        <option value="">--</option>
                        {productOptions[productOptionEditor.group].map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={styles.field}>
                      <span>{copy.productOptionValueLabel}</span>
                      <input
                        value={productOptionEditor.value}
                        onChange={(event) =>
                          setProductOptionEditor((current) => ({
                            ...current,
                            value: String(readFieldValue(event)),
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.primaryButton}
                      disabled={savingProductOption}
                      onClick={() => {
                        void handleSaveProductOption();
                      }}
                    >
                      {savingProductOption
                        ? copy.savingLabel
                        : productOptionEditor.selectedValue
                          ? copy.productOptionUpdateButton
                          : copy.productOptionAddButton}
                    </button>
                    <button
                      type="button"
                      className={styles.dangerButton}
                      disabled={
                        deletingProductOption || !productOptionEditor.selectedValue
                      }
                      onClick={() => {
                        void handleDeleteProductOption();
                      }}
                    >
                      {deletingProductOption
                        ? copy.savingLabel
                        : copy.productOptionDeleteButton}
                    </button>
                  </div>
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
                      <span>{orderCopy.pendingPayment}: {orderCounts.pending_payment}</span>
                      <span>{orderCopy.paid}: {orderCounts.paid}</span>
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
                                <strong>#{order.id}</strong>
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
                              {order.fulfillmentStaff ? (
                                <span>{copy.fulfillmentStaffLabel}: {order.fulfillmentStaff}</span>
                              ) : null}
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
                          ? `#${selectedOrder.id}`
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
                          <span>{copy.statusLabel}</span>
                          <strong>{statusLabelByKey[resolveOrderStatus(selectedOrder)]}</strong>
                        </div>
                        <div className={styles.summaryCard}>
                          <span>{copy.latestSync}</span>
                          <strong>
                            {dateFormatter.format(
                              new Date(selectedOrder.statusUpdatedAt ?? selectedOrder.createdAt),
                            )}
                          </strong>
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
                          <span>{copy.fulfillmentStaffLabel}</span>
                          <input
                            value={orderEditor.fulfillmentStaff}
                            onChange={(event) =>
                              handleOrderEditorChange(
                                "fulfillmentStaff",
                                String(readFieldValue(event)),
                              )
                            }
                          />
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
                          <span>{copy.shipperNameLabel}</span>
                          <input
                            value={orderEditor.shipperName}
                            onChange={(event) =>
                              handleOrderEditorChange(
                                "shipperName",
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
                        <label className={styles.field}>
                          <span>{copy.deliveredAtLabel}</span>
                          <input
                            type="datetime-local"
                            value={orderEditor.deliveredAt}
                            onChange={(event) =>
                              handleOrderEditorChange(
                                "deliveredAt",
                                String(readFieldValue(event)),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          <span>{copy.receivedByLabel}</span>
                          <input
                            value={orderEditor.receivedBy}
                            onChange={(event) =>
                              handleOrderEditorChange(
                                "receivedBy",
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

                      <div className={styles.infoBlock}>
                        <strong>{copy.orderPaymentTitle}</strong>
                        <div className={styles.infoGrid}>
                          <span>{copy.paymentIdLabel}: {selectedOrder.paymentId ?? "--"}</span>
                          <span>{copy.txidLabel}: {selectedOrder.txid ?? "--"}</span>
                          <span>{copy.priceLabel}: {formatPi(selectedOrder.totalPi)}</span>
                          <span>
                            {copy.orderCodeLabel}: {selectedOrder.id}
                          </span>
                        </div>
                      </div>

                      <div className={styles.infoBlock}>
                        <strong>{copy.deliveryProgressTitle}</strong>
                        <div className={styles.infoGrid}>
                          <span>
                            {copy.fulfillmentStaffLabel}:{" "}
                            {selectedOrder.fulfillmentStaff ?? "--"}
                          </span>
                          <span>
                            {copy.shipperNameLabel}: {selectedOrder.shipperName ?? "--"}
                          </span>
                          <span>
                            {copy.shippingCarrierLabel}:{" "}
                            {selectedOrder.shippingCarrier ?? "--"}
                          </span>
                          <span>
                            {copy.trackingCodeLabel}: {selectedOrder.trackingCode ?? "--"}
                          </span>
                          <span>
                            {copy.deliveredAtLabel}:{" "}
                            {selectedOrder.deliveredAt
                              ? dateFormatter.format(new Date(selectedOrder.deliveredAt))
                              : "--"}
                          </span>
                          <span>
                            {copy.receivedByLabel}: {selectedOrder.receivedBy ?? "--"}
                          </span>
                        </div>
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
                          {selectedOrder.locationVerification ? (
                            <span>
                              GPS: {selectedOrder.locationVerification.status} |{" "}
                              {selectedOrder.locationVerification.countryName ??
                                "--"}
                              {selectedOrder.locationVerification.countryCode
                                ? ` (${selectedOrder.locationVerification.countryCode})`
                                : ""}{" "}
                              | {selectedOrder.locationVerification.message ?? ""}
                            </span>
                          ) : null}
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
