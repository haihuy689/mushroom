"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useStorefront } from "@/components/storefront-provider";
import type { StorefrontStaffMember } from "@/lib/admin-access";
import type { AdminCenterCopy } from "@/lib/admin-center-copy";
import type { SiteLocale } from "@/lib/i18n";
import type { OrderCenterCopy } from "@/lib/order-center-copy";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";
import { getOrderStatusCounts, resolveOrderStatus } from "@/lib/order-tracking";
import {
  createEmptyStorefrontProductInput,
  normalizeStorefrontProductInput,
  type StorefrontProductInput,
  type StorefrontProductRecord,
} from "@/lib/storefront-product";
import type { StorefrontOrder } from "@/lib/storefront-state";
import styles from "./page.module.css";

type AdminPageClientProps = {
  copy: AdminCenterCopy;
  locale: SiteLocale;
  orderCopy: OrderCenterCopy;
};

type MessageState =
  | { kind: "error"; text: string }
  | { kind: "success"; text: string }
  | null;

async function readJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Request failed.",
    );
  }

  return data;
}

function getAdminUiText(locale: SiteLocale) {
  if (locale === "vi") {
    return {
      checkingAccess: "Dang dong bo quyen quan tri...",
      loadingData: "Dang tai du lieu quan tri...",
    };
  }

  return {
    checkingAccess: "Syncing admin access...",
    loadingData: "Loading admin data...",
  };
}

function updateProductValue(
  products: StorefrontProductRecord[],
  productId: string,
  patch: Partial<StorefrontProductRecord>,
) {
  return products.map((product) =>
    product.id === productId ? { ...product, ...patch } : product,
  );
}

export function AdminPageClient({
  copy,
  locale,
  orderCopy,
}: AdminPageClientProps) {
  const {
    adminAccess,
    adminAccessReady,
    authBusy,
    hydrated,
    sessionChecked,
    viewer,
  } = useStorefront();
  const [orders, setOrders] = useState<StorefrontOrder[]>([]);
  const [products, setProducts] = useState<StorefrontProductRecord[]>([]);
  const [staff, setStaff] = useState<StorefrontStaffMember[]>([]);
  const [staffIdentity, setStaffIdentity] = useState("");
  const [productDraft, setProductDraft] = useState<StorefrontProductInput>(
    createEmptyStorefrontProductInput(),
  );
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);
  const [refreshingOrders, setRefreshingOrders] = useState(false);
  const [refreshingProducts, setRefreshingProducts] = useState(false);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [savingStaff, setSavingStaff] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const canAccessAdmin = adminAccess.canAccessAdmin;
  const canManageStaff = adminAccess.canManageStaff;
  const orderCounts = getOrderStatusCounts(orders);
  const productCounts = useMemo(
    () => ({
      hidden: products.filter((product) => !product.isActive).length,
      outOfStock: products.filter((product) => product.inventoryCount <= 0).length,
      visible: products.filter((product) => product.isActive).length,
    }),
    [products],
  );
  const uiText = getAdminUiText(locale);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  const statusLabelByKey: Record<OrderStatus, string> = {
    delivered: orderCopy.delivered,
    processing: orderCopy.processing,
    shipping: orderCopy.shipping,
  };

  const panelLabel = adminAccess.role === "owner" ? copy.ownerPanel : copy.staffPanel;
  const resolvingAccess =
    !hydrated ||
    !sessionChecked ||
    authBusy ||
    (Boolean(viewer) && !adminAccessReady);
  const showLoadingState =
    resolvingAccess || (canAccessAdmin && loadingData);

  useEffect(() => {
    if (!canAccessAdmin) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setLoadingData(true);

      try {
        const [ordersResponse, staffResponse, productsResponse] = await Promise.all([
          readJson<{ items: StorefrontOrder[] }>("/api/admin/orders"),
          canManageStaff
            ? readJson<{ items: StorefrontStaffMember[] }>("/api/admin/staff")
            : Promise.resolve({ items: [] as StorefrontStaffMember[] }),
          canManageStaff
            ? readJson<{ items: StorefrontProductRecord[] }>("/api/admin/products")
            : Promise.resolve({ items: [] as StorefrontProductRecord[] }),
        ]);

        if (cancelled) {
          return;
        }

        setOrders(ordersResponse.items);
        setStaff(staffResponse.items);
        setProducts(productsResponse.items);
      } catch (error) {
        if (!cancelled) {
          setMessage({
            kind: "error",
            text: error instanceof Error ? error.message : copy.saveError,
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingData(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [canAccessAdmin, canManageStaff, copy.saveError]);

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

  const handleAddStaff = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!staffIdentity.trim()) {
      return;
    }

    setSavingStaff(true);
    setMessage(null);

    try {
      const data = await readJson<{ items: StorefrontStaffMember[] }>(
        "/api/admin/staff",
        {
          method: "POST",
          body: JSON.stringify({
            identity: staffIdentity,
          }),
        },
      );

      setStaff(data.items);
      setStaffIdentity("");
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

  const handleRemoveStaff = async (identity: string) => {
    setSavingStaff(true);
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

      setStaff(data.items);
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

  const handleDraftChange = (
    field: keyof StorefrontProductInput,
    value: boolean | number | string | null,
  ) => {
    setProductDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleProductChange = (
    productId: string,
    field: keyof StorefrontProductRecord,
    value: boolean | number | string | null,
  ) => {
    setProducts((current) =>
      updateProductValue(current, productId, {
        [field]: value,
      } as Partial<StorefrontProductRecord>),
    );
  };

  const handleCreateProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setCreatingProduct(true);
    setMessage(null);

    try {
      const data = await readJson<{
        item: StorefrontProductRecord;
        items: StorefrontProductRecord[];
      }>("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(
          normalizeStorefrontProductInput({
            ...productDraft,
            sourceProductId: null,
          }),
        ),
      });

      setProducts(data.items);
      setProductDraft(createEmptyStorefrontProductInput());
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
      setCreatingProduct(false);
    }
  };

  const handleSaveProduct = async (product: StorefrontProductRecord) => {
    setSavingProductId(product.id);
    setMessage(null);

    try {
      const data = await readJson<{
        item: StorefrontProductRecord;
        items: StorefrontProductRecord[];
      }>("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(normalizeStorefrontProductInput(product)),
      });

      setProducts(data.items);
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
      setSavingProductId(null);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    setBusyOrderId(orderId);
    setMessage(null);

    try {
      const data = await readJson<{ order: StorefrontOrder }>(
        `/api/admin/orders/${orderId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? data.order : order)),
      );
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
      setBusyOrderId(null);
    }
  };

  const productFieldValue = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = event.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      return target.checked;
    }

    if (target instanceof HTMLInputElement && target.type === "number") {
      return target.value === "" ? "" : Number(target.value);
    }

    return target.value;
  };

  return (
    <div className={styles.page}>
      {message ? (
        <div className={styles.message} data-kind={message.kind}>
          {message.text}
        </div>
      ) : null}

      {showLoadingState ? (
        <section className={styles.layout}>
          <article className={`${styles.card} ${styles.accessCard}`}>
            <h2>{copy.adminTitle}</h2>
            <p>
              {resolvingAccess
                ? uiText.checkingAccess
                : uiText.loadingData}
            </p>
          </article>
        </section>
      ) : null}

      {!showLoadingState && !canAccessAdmin ? (
        <section className={styles.layout}>
          <article className={`${styles.card} ${styles.accessCard}`}>
            <h2>{copy.noAccessTitle}</h2>
            <p>{copy.noAccessBody}</p>
          </article>
        </section>
      ) : null}

      {canAccessAdmin && !loadingData ? (
        <>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{panelLabel}</p>
              <h1>{copy.adminTitle}</h1>
              <p className={styles.lead}>{copy.adminLead}</p>
              <p className={styles.notes}>{copy.notes}</p>
            </div>

            <div className={styles.statsGrid}>
              <article className={styles.statCard}>
                <strong>{orders.length}</strong>
                <span>{orderCopy.orders}</span>
              </article>
              <article className={styles.statCard}>
                <strong>{orderCounts.processing}</strong>
                <span>{orderCopy.processing}</span>
              </article>
              {canManageStaff ? (
                <>
                  <article className={styles.statCard}>
                    <strong>{products.length}</strong>
                    <span>{copy.catalogManagerTitle}</span>
                  </article>
                  <article className={styles.statCard}>
                    <strong>{productCounts.visible}</strong>
                    <span>{copy.liveProductsLabel}</span>
                  </article>
                  <article className={styles.statCard}>
                    <strong>{productCounts.hidden}</strong>
                    <span>{copy.hiddenProductsLabel}</span>
                  </article>
                  <article className={styles.statCard}>
                    <strong>{productCounts.outOfStock}</strong>
                    <span>{copy.outOfStockProductsLabel}</span>
                  </article>
                  <article className={styles.statCard}>
                    <strong>{staff.length}</strong>
                    <span>{copy.staffManagerTitle}</span>
                  </article>
                </>
              ) : null}
            </div>
          </section>

          <section className={styles.layout}>
          {canManageStaff ? (
            <>
              <article className={styles.card}>
                <div className={styles.cardHeading}>
                  <div>
                    <p className={styles.cardLabel}>{copy.addStaff}</p>
                    <h2>{copy.staffManagerTitle}</h2>
                  </div>
                </div>

                <p className={styles.cardLead}>{copy.staffManagerLead}</p>

                <form className={styles.staffForm} onSubmit={handleAddStaff}>
                  <label className={styles.field}>
                    <span>{copy.staffIdentityLabel}</span>
                    <input
                      value={staffIdentity}
                      onChange={(event) => setStaffIdentity(event.target.value)}
                      placeholder="pi-user-id-or-username"
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={savingStaff}
                  >
                    {savingStaff ? copy.addStaff : copy.addStaffButton}
                  </button>
                </form>

                {staff.length === 0 ? (
                  <p className={styles.emptyState}>{copy.emptyStaff}</p>
                ) : (
                  <div className={styles.staffList}>
                    {staff.map((member) => (
                      <article key={member.identityKey} className={styles.staffCard}>
                        <div>
                          <strong>{member.identity}</strong>
                          <span>
                            {copy.staffAddedBy}: {member.addedBy}
                          </span>
                          <span>{formatter.format(new Date(member.addedAt))}</span>
                        </div>

                        <button
                          type="button"
                          className={styles.secondaryButton}
                          disabled={savingStaff}
                          onClick={() => handleRemoveStaff(member.identity)}
                        >
                          {copy.removeStaff}
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </article>

              <article className={styles.card}>
                <div className={styles.cardHeading}>
                  <div>
                    <p className={styles.cardLabel}>{copy.addProduct}</p>
                    <h2>{copy.customProductTitle}</h2>
                  </div>
                </div>

                <p className={styles.cardLead}>{copy.customProductLead}</p>

                <form className={styles.productForm} onSubmit={handleCreateProduct}>
                  <div className={styles.productGrid}>
                    <label className={styles.field}>
                      <span>{copy.productNameLabel}</span>
                      <input
                        value={productDraft.name}
                        onChange={(event) =>
                          handleDraftChange("name", productFieldValue(event))
                        }
                        required
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{copy.productSlugLabel}</span>
                      <input
                        value={productDraft.slug}
                        onChange={(event) =>
                          handleDraftChange("slug", productFieldValue(event))
                        }
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{copy.priceLabel}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.0001"
                        value={productDraft.pricePi}
                        onChange={(event) =>
                          handleDraftChange("pricePi", productFieldValue(event))
                        }
                        required
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{copy.inventoryLabel}</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={productDraft.inventoryCount}
                        onChange={(event) =>
                          handleDraftChange("inventoryCount", productFieldValue(event))
                        }
                        required
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{copy.packagingLabel}</span>
                      <input
                        value={productDraft.packaging}
                        onChange={(event) =>
                          handleDraftChange("packaging", productFieldValue(event))
                        }
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{copy.productFormatLabel}</span>
                      <input
                        value={productDraft.format}
                        onChange={(event) =>
                          handleDraftChange("format", productFieldValue(event))
                        }
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{copy.weightValueLabel}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={productDraft.weightValue ?? ""}
                        onChange={(event) =>
                          handleDraftChange("weightValue", productFieldValue(event))
                        }
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{copy.weightUnitLabel}</span>
                      <input
                        value={productDraft.weightUnit ?? ""}
                        onChange={(event) =>
                          handleDraftChange("weightUnit", productFieldValue(event))
                        }
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{copy.productCategoryLabel}</span>
                      <input
                        value={productDraft.category}
                        onChange={(event) =>
                          handleDraftChange("category", productFieldValue(event))
                        }
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{copy.productBadgeLabel}</span>
                      <input
                        value={productDraft.badge}
                        onChange={(event) =>
                          handleDraftChange("badge", productFieldValue(event))
                        }
                      />
                    </label>
                    <label className={styles.field}>
                      <span>{copy.productAccentLabel}</span>
                      <input
                        value={productDraft.accent}
                        onChange={(event) =>
                          handleDraftChange("accent", productFieldValue(event))
                        }
                      />
                    </label>
                    <label className={`${styles.field} ${styles.toggleField}`}>
                      <span>{copy.productActiveLabel}</span>
                      <input
                        type="checkbox"
                        checked={productDraft.isActive}
                        onChange={(event) =>
                          handleDraftChange("isActive", productFieldValue(event))
                        }
                      />
                    </label>
                    <label className={`${styles.field} ${styles.fullField}`}>
                      <span>{copy.productTaglineLabel}</span>
                      <input
                        value={productDraft.tagline}
                        onChange={(event) =>
                          handleDraftChange("tagline", productFieldValue(event))
                        }
                      />
                    </label>
                    <label className={`${styles.field} ${styles.fullField}`}>
                      <span>{copy.productDescriptionLabel}</span>
                      <textarea
                        rows={4}
                        value={productDraft.description}
                        onChange={(event) =>
                          handleDraftChange("description", productFieldValue(event))
                        }
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={creatingProduct}
                  >
                    {creatingProduct
                      ? copy.savingProductButton
                      : copy.createProductButton}
                  </button>
                </form>
              </article>

              <article className={styles.card}>
                <div className={styles.cardHeading}>
                  <div>
                    <p className={styles.cardLabel}>{copy.catalogManagerTitle}</p>
                    <h2>{copy.catalogManagerTitle}</h2>
                  </div>

                  <button
                    type="button"
                    className={styles.secondaryButton}
                    disabled={refreshingProducts}
                    onClick={() => {
                      void handleRefreshProducts();
                    }}
                  >
                    {refreshingProducts ? copy.productsRefresh : copy.productsRefresh}
                  </button>
                </div>

                <p className={styles.cardLead}>{copy.catalogManagerLead}</p>

                {products.length === 0 ? (
                  <p className={styles.emptyState}>{copy.emptyProducts}</p>
                ) : (
                  <div className={styles.productList}>
                    {products.map((product) => {
                      const isCustomProduct = !product.sourceProductId;
                      const inventoryAvailable = product.inventoryCount > 0;
                      const visibilityLabel = product.isActive
                        ? copy.productLiveStatus
                        : copy.productHiddenStatus;
                      const inventoryLabel = inventoryAvailable
                        ? copy.productInStockStatus
                        : copy.productOutOfStockStatus;

                      return (
                        <article key={product.id} className={styles.productCard}>
                          <div className={styles.productHeader}>
                            <div className={styles.productTitleBlock}>
                              <p className={styles.productCode}>{product.id}</p>
                              <h3>{product.name}</h3>
                              <div className={styles.productStatusRow}>
                                <span
                                  className={styles.productChip}
                                  data-tone={isCustomProduct ? "custom" : "system"}
                                >
                                  {isCustomProduct
                                    ? copy.productCustomLabel
                                    : copy.productSystemLabel}
                                </span>
                                <span
                                  className={styles.productChip}
                                  data-tone={product.isActive ? "live" : "hidden"}
                                >
                                  {visibilityLabel}
                                </span>
                                <span
                                  className={styles.productChip}
                                  data-tone={inventoryAvailable ? "stock" : "empty"}
                                >
                                  {inventoryLabel}
                                </span>
                              </div>
                              <span className={styles.productSubtle}>
                                {isCustomProduct
                                  ? product.slug
                                  : copy.productSourceLabel}
                              </span>
                            </div>

                            <div className={styles.productHeaderActions}>
                              <span className={styles.productSubtle}>
                                {copy.latestSync}:{" "}
                                {formatter.format(new Date(product.updatedAt))}
                              </span>
                              <button
                                type="button"
                                className={styles.primaryButton}
                                disabled={savingProductId === product.id}
                                onClick={() => {
                                  void handleSaveProduct(product);
                                }}
                              >
                                {savingProductId === product.id
                                  ? copy.savingProductButton
                                  : copy.saveProductButton}
                              </button>
                            </div>
                          </div>

                          <div className={styles.productGrid}>
                            {isCustomProduct ? (
                              <>
                                <label className={styles.field}>
                                  <span>{copy.productNameLabel}</span>
                                  <input
                                    value={product.name}
                                    onChange={(event) =>
                                      handleProductChange(
                                        product.id,
                                        "name",
                                        productFieldValue(event),
                                      )
                                    }
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>{copy.productSlugLabel}</span>
                                  <input
                                    value={product.slug}
                                    onChange={(event) =>
                                      handleProductChange(
                                        product.id,
                                        "slug",
                                        productFieldValue(event),
                                      )
                                    }
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>{copy.productCategoryLabel}</span>
                                  <input
                                    value={product.category}
                                    onChange={(event) =>
                                      handleProductChange(
                                        product.id,
                                        "category",
                                        productFieldValue(event),
                                      )
                                    }
                                  />
                                </label>
                                <label className={styles.field}>
                                  <span>{copy.productFormatLabel}</span>
                                  <input
                                    value={product.format}
                                    onChange={(event) =>
                                      handleProductChange(
                                        product.id,
                                        "format",
                                        productFieldValue(event),
                                      )
                                    }
                                  />
                                </label>
                              </>
                            ) : null}

                            <label className={styles.field}>
                              <span>{copy.priceLabel}</span>
                              <input
                                type="number"
                                min="0"
                                step="0.0001"
                                value={product.pricePi}
                                onChange={(event) =>
                                  handleProductChange(
                                    product.id,
                                    "pricePi",
                                    productFieldValue(event),
                                  )
                                }
                              />
                            </label>
                            <label className={styles.field}>
                              <span>{copy.inventoryLabel}</span>
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={product.inventoryCount}
                                onChange={(event) =>
                                  handleProductChange(
                                    product.id,
                                    "inventoryCount",
                                    productFieldValue(event),
                                  )
                                }
                              />
                            </label>
                            <label className={styles.field}>
                              <span>{copy.packagingLabel}</span>
                              <input
                                value={product.packaging}
                                onChange={(event) =>
                                  handleProductChange(
                                    product.id,
                                    "packaging",
                                    productFieldValue(event),
                                  )
                                }
                              />
                            </label>
                            <label className={styles.field}>
                              <span>{copy.weightValueLabel}</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={product.weightValue ?? ""}
                                onChange={(event) =>
                                  handleProductChange(
                                    product.id,
                                    "weightValue",
                                    productFieldValue(event) === ""
                                      ? null
                                      : productFieldValue(event),
                                  )
                                }
                              />
                            </label>
                            <label className={styles.field}>
                              <span>{copy.weightUnitLabel}</span>
                              <input
                                value={product.weightUnit ?? ""}
                                onChange={(event) =>
                                  handleProductChange(
                                    product.id,
                                    "weightUnit",
                                    productFieldValue(event) === ""
                                      ? null
                                      : productFieldValue(event),
                                  )
                                }
                              />
                            </label>
                            <label className={styles.field}>
                              <span>{copy.productBadgeLabel}</span>
                              <input
                                value={product.badge}
                                onChange={(event) =>
                                  handleProductChange(
                                    product.id,
                                    "badge",
                                    productFieldValue(event),
                                  )
                                }
                              />
                            </label>
                            <label className={styles.field}>
                              <span>{copy.productAccentLabel}</span>
                              <input
                                value={product.accent}
                                onChange={(event) =>
                                  handleProductChange(
                                    product.id,
                                    "accent",
                                    productFieldValue(event),
                                  )
                                }
                              />
                            </label>
                            <label className={`${styles.field} ${styles.toggleField}`}>
                              <span>{copy.productActiveLabel}</span>
                              <input
                                type="checkbox"
                                checked={product.isActive}
                                onChange={(event) =>
                                  handleProductChange(
                                    product.id,
                                    "isActive",
                                    productFieldValue(event),
                                  )
                                }
                              />
                            </label>

                            {isCustomProduct ? (
                              <>
                                <label className={`${styles.field} ${styles.fullField}`}>
                                  <span>{copy.productTaglineLabel}</span>
                                  <input
                                    value={product.tagline}
                                    onChange={(event) =>
                                      handleProductChange(
                                        product.id,
                                        "tagline",
                                        productFieldValue(event),
                                      )
                                    }
                                  />
                                </label>
                                <label className={`${styles.field} ${styles.fullField}`}>
                                  <span>{copy.productDescriptionLabel}</span>
                                  <textarea
                                    rows={4}
                                    value={product.description}
                                    onChange={(event) =>
                                      handleProductChange(
                                        product.id,
                                        "description",
                                        productFieldValue(event),
                                      )
                                    }
                                  />
                                </label>
                              </>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </article>
            </>
          ) : null}

          <article className={styles.card}>
            <div className={styles.cardHeading}>
              <div>
                <p className={styles.cardLabel}>{copy.statusLabel}</p>
                <h2>{copy.orderManagerTitle}</h2>
              </div>

              <button
                type="button"
                className={styles.secondaryButton}
                disabled={refreshingOrders}
                onClick={() => {
                  void handleRefreshOrders();
                }}
              >
                {refreshingOrders ? copy.refreshOrders : copy.refreshOrders}
              </button>
            </div>

            {orders.length === 0 ? (
              <p className={styles.emptyState}>{copy.emptyOrders}</p>
            ) : (
              <div className={styles.orderList}>
                {orders.map((order) => {
                  const resolvedStatus = resolveOrderStatus(order);

                  return (
                    <article key={order.id} className={styles.orderCard}>
                      <div className={styles.orderTop}>
                        <div>
                          <span className={styles.orderCode}>
                            #{order.id.slice(-8).toUpperCase()}
                          </span>
                          <h3>{order.productName}</h3>
                          <p>
                            {copy.customerLabel}: {order.username ?? order.shopperUid ?? "--"}
                          </p>
                          <p>
                            {order.quantity} x / {order.totalPi} Pi
                          </p>
                        </div>

                        <span className={styles.statusPill} data-status={resolvedStatus}>
                          {statusLabelByKey[resolvedStatus]}
                        </span>
                      </div>

                      {order.shippingAddress ? (
                        <div className={styles.infoBlock}>
                          <strong>{copy.orderAddress}</strong>
                          <span>
                            {order.shippingAddress.fullName} | {order.shippingAddress.phone}
                          </span>
                          <span>
                            {[
                              order.shippingAddress.line1,
                              order.shippingAddress.line2,
                              order.shippingAddress.ward,
                              order.shippingAddress.district,
                              order.shippingAddress.city,
                              order.shippingAddress.country,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                      ) : null}

                      {order.items && order.items.length > 0 ? (
                        <div className={styles.infoBlock}>
                          <strong>{copy.orderItems}</strong>
                          <ul className={styles.itemList}>
                            {order.items.map((item) => (
                              <li key={`${order.id}-${item.productId}`}>
                                <span>{item.productName}</span>
                                <strong>
                                  {item.quantity} x / {item.totalPi} Pi
                                </strong>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <div className={styles.metaRow}>
                        <span>{formatter.format(new Date(order.createdAt))}</span>
                        <span>
                          {copy.latestSync}:{" "}
                          {formatter.format(
                            new Date(order.statusUpdatedAt ?? order.createdAt),
                          )}
                        </span>
                      </div>

                      <div className={styles.statusButtons}>
                        {ORDER_STATUSES.map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={styles.statusButton}
                            data-active={resolvedStatus === status}
                            disabled={busyOrderId === order.id}
                            onClick={() => {
                              void handleStatusUpdate(order.id, status);
                            }}
                          >
                            {busyOrderId === order.id && resolvedStatus === status
                              ? copy.updateStatus
                              : statusLabelByKey[status]}
                          </button>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </article>
          </section>
        </>
      ) : null}
    </div>
  );
}
