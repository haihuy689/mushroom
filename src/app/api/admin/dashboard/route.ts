import { NextResponse } from "next/server";
import postgres from "postgres";
import type { StorefrontStaffMember } from "@/lib/admin-access";
import { isOrderStatus } from "@/lib/order-status";
import type { StorefrontProductRecord } from "@/lib/storefront-product";
import type { StorefrontOrder } from "@/lib/storefront-state";
import { ensureStorefrontSchema } from "@/lib/storefront-db";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";
import { getDatabaseUrl } from "@/lib/db";

const ADMIN_DASHBOARD_TIMEOUT_MS = 20000;

export const preferredRegion = "sin1";

type StaffRow = {
  added_by: string;
  can_manage_orders: boolean;
  can_manage_products: boolean;
  can_manage_staff: boolean;
  created_at: string;
  display_identity: string;
  full_name: string;
  identity_key: string;
  is_active: boolean;
  note: string;
  role: string;
};

type ProductRow = {
  accent: string;
  badge: string;
  category: string;
  compare_at_pi: string | number | null;
  cost_pi: string | number | null;
  actual_sold_count: number;
  base_sold_count: number;
  created_at: string;
  description: string;
  format: string;
  gallery_image_urls: unknown;
  id: string;
  image_url: string;
  inventory_count: number;
  is_active: boolean;
  is_featured: boolean;
  low_stock_threshold: number;
  name: string;
  packaging: string;
  price_pi: string | number;
  media_note: string;
  slug: string;
  source_product_id: string | null;
  sku: string;
  tagline: string;
  updated_at: string;
  video_url: string;
  weight_unit: string | null;
  weight_value: string | number | null;
};

type OrderRow = {
  admin_note: string | null;
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  delivered_at: string | null;
  total_pi: string | number;
  created_at: string;
  txid: string | null;
  payment_id: string | null;
  assigned_staff: string | null;
  pi_uid: string;
  received_by: string | null;
  fulfillment_status: string | null;
  shipping_carrier: string | null;
  shipper_name: string | null;
  status_updated_at: string | null;
  status_updated_by: string | null;
  tracking_code: string | null;
  username: string | null;
  shipping_full_name: string | null;
  shipping_phone: string | null;
  shipping_line1: string | null;
  shipping_line2: string | null;
  shipping_ward: string | null;
  shipping_district: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  shipping_note: string | null;
  location_accuracy_meters: number | null;
  location_address_country: string | null;
  location_checked_at: string | null;
  location_country_code: string | null;
  location_country_name: string | null;
  location_latitude: string | number | null;
  location_longitude: string | number | null;
  location_message: string | null;
  location_status: string | null;
};

type OrderItemRow = {
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  total_pi: string | number;
};

function withDashboardTimeout<T>(promise: Promise<T>) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          "Admin data is responding slowly. Please reload in a few seconds.",
        ),
      );
    }, ADMIN_DASHBOARD_TIMEOUT_MS);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function mapStaffRows(rows: StaffRow[]): StorefrontStaffMember[] {
  return rows.map((row) => ({
    addedAt: row.created_at,
    addedBy: row.added_by,
    canManageOrders: row.can_manage_orders,
    canManageProducts: row.can_manage_products,
    canManageStaff: row.can_manage_staff,
    fullName: row.full_name,
    identity: row.display_identity,
    identityKey: row.identity_key,
    isActive: row.is_active,
    note: row.note,
    role: row.role,
  }));
}

function normalizeProductMediaList(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  return [];
}

function mapProductRows(rows: ProductRow[]): StorefrontProductRecord[] {
  return rows.map((row) => ({
    accent: row.accent,
    badge: row.badge,
    category: row.category,
    compareAtPi:
      row.compare_at_pi === null ? null : Number(row.compare_at_pi),
    costPi: row.cost_pi === null ? null : Number(row.cost_pi),
    actualSoldCount: row.actual_sold_count,
    baseSoldCount: row.base_sold_count,
    createdAt: row.created_at,
    description: row.description,
    format: row.format,
    galleryImageUrls: normalizeProductMediaList(row.gallery_image_urls),
    id: row.id,
    imageUrl: row.image_url,
    inventoryCount: row.inventory_count,
    isActive: row.is_active,
    isFeatured: row.is_featured,
    lowStockThreshold: row.low_stock_threshold,
    name: row.name,
    packaging: row.packaging,
    pricePi: Number(row.price_pi),
    mediaNote: row.media_note,
    slug: row.slug,
    sourceProductId: row.source_product_id,
    sku: row.sku,
    tagline: row.tagline,
    updatedAt: row.updated_at,
    videoUrl: row.video_url,
    weightUnit: row.weight_unit,
    weightValue:
      row.weight_value === null ? null : Number(row.weight_value),
  }));
}

function mapOrderRows(
  orderRows: OrderRow[],
  orderItemRows: OrderItemRow[],
): StorefrontOrder[] {
  const itemsByOrderId = new Map<string, StorefrontOrder["items"]>();

  for (const itemRow of orderItemRows) {
    const items = itemsByOrderId.get(itemRow.order_id) ?? [];

    items.push({
      productId: itemRow.product_id,
      productName: itemRow.product_name,
      quantity: itemRow.quantity,
      totalPi: Number(itemRow.total_pi),
    });

    itemsByOrderId.set(itemRow.order_id, items);
  }

  return orderRows.map((row) => ({
    adminNote: row.admin_note ?? undefined,
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: row.quantity,
    totalPi: Number(row.total_pi),
    createdAt: row.created_at,
    deliveredAt: row.delivered_at ?? undefined,
    fulfillmentStaff: row.assigned_staff ?? undefined,
    shopperUid: row.pi_uid,
    txid: row.txid ?? undefined,
    paymentId: row.payment_id ?? undefined,
    receivedBy: row.received_by ?? undefined,
    shippingCarrier: row.shipping_carrier ?? undefined,
    shipperName: row.shipper_name ?? undefined,
    status: isOrderStatus(row.fulfillment_status)
      ? row.fulfillment_status
      : undefined,
    statusUpdatedAt: row.status_updated_at ?? undefined,
    statusUpdatedBy: row.status_updated_by ?? undefined,
    trackingCode: row.tracking_code ?? undefined,
    username: row.username ?? undefined,
    items: itemsByOrderId.get(row.id) ?? [],
    shippingAddress: row.shipping_full_name
      ? {
          fullName: row.shipping_full_name,
          phone: row.shipping_phone ?? "",
          line1: row.shipping_line1 ?? "",
          line2: row.shipping_line2 ?? "",
          ward: row.shipping_ward ?? "",
          district: row.shipping_district ?? "",
          city: row.shipping_city ?? "",
          country: row.shipping_country ?? "",
          note: row.shipping_note ?? "",
        }
      : undefined,
    locationVerification: row.location_status
      ? {
          accuracyMeters: row.location_accuracy_meters ?? undefined,
          addressCountry: row.location_address_country ?? "",
          checkedAt: row.location_checked_at ?? row.created_at,
          countryCode: row.location_country_code ?? undefined,
          countryName: row.location_country_name ?? undefined,
          latitude:
            row.location_latitude === null
              ? undefined
              : Number(row.location_latitude),
          longitude:
            row.location_longitude === null
              ? undefined
              : Number(row.location_longitude),
          message: row.location_message ?? undefined,
          status:
            row.location_status === "matched" ||
            row.location_status === "mismatch"
              ? row.location_status
              : "unverified",
        }
      : undefined,
  }));
}

export async function GET() {
  const { access } = await getStorefrontAdminContext();

  if (!access.canAccessAdmin) {
    return NextResponse.json(
      {
        error: "Admin session is required.",
      },
      { status: 403 },
    );
  }

  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return NextResponse.json({
      orders: [] satisfies StorefrontOrder[],
      products: [] satisfies StorefrontProductRecord[],
      staff: [] satisfies StorefrontStaffMember[],
    });
  }

  await ensureStorefrontSchema();

  const sql = postgres(databaseUrl, {
    connect_timeout: 5,
    idle_timeout: 5,
    max: 4,
    prepare: false,
  });

  try {
    if (access.canManageProducts) {
      await withDashboardTimeout(sql`
        delete from storefront_products
        where source_product_id is not null
      `);
    }

    const [orderRows, orderItemRows, staffRows, productRows] =
      await withDashboardTimeout(
        Promise.all([
          sql<OrderRow[]>`
            select
              admin_note,
              id,
              pi_uid,
              product_id,
              product_name,
              quantity,
              total_pi,
              created_at::text,
              delivered_at::text,
              txid,
              payment_id,
              assigned_staff,
              fulfillment_status,
              received_by,
              shipping_carrier,
              shipper_name,
              status_updated_at::text,
              status_updated_by,
              tracking_code,
              username,
              shipping_full_name,
              shipping_phone,
              shipping_line1,
              shipping_line2,
              shipping_ward,
              shipping_district,
              shipping_city,
              shipping_country,
              shipping_note,
              location_status,
              location_checked_at::text,
              location_country_code,
              location_country_name,
              location_address_country,
              location_latitude,
              location_longitude,
              location_accuracy_meters,
              location_message
            from storefront_orders
            order by created_at desc
            limit 80
          `,
          sql<OrderItemRow[]>`
            select
              item.order_id,
              item.product_id,
              item.product_name,
              item.quantity,
              item.total_pi
            from storefront_order_items item
            inner join storefront_orders parent on parent.id = item.order_id
            order by parent.created_at desc, item.product_name asc
          `,
          access.canManageStaff
            ? sql<StaffRow[]>`
                select
                  username_key as identity_key,
                  display_username as display_identity,
                  added_by,
                  created_at::text,
                  full_name,
                  note,
                  role,
                  is_active,
                  can_manage_orders,
                  can_manage_products,
                  can_manage_staff
                from storefront_staff_members
                order by is_active desc, created_at desc
              `
            : Promise.resolve([]),
          access.canManageProducts
            ? sql<ProductRow[]>`
                select
                  id,
                  source_product_id,
                  slug,
                  name,
                  sku,
                  tagline,
                  description,
                  category,
                  format,
                  price_pi,
                  compare_at_pi,
                  cost_pi,
                  base_sold_count,
                  actual_sold_count,
                  badge,
                  accent,
                  packaging,
                  image_url,
                  gallery_image_urls,
                  video_url,
                  media_note,
                  weight_value,
                  weight_unit,
                  inventory_count,
                  low_stock_threshold,
                  is_active,
                  is_featured,
                  created_at::text,
                  updated_at::text
                from storefront_products
                order by source_product_id nulls first, updated_at desc, name asc
              `
            : Promise.resolve([]),
        ]),
      );

    return NextResponse.json({
      orders: mapOrderRows(orderRows, orderItemRows),
      products: mapProductRows(productRows),
      staff: mapStaffRows(staffRows),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Admin data is responding slowly. Please reload in a few seconds.",
      },
      { status: 503 },
    );
  } finally {
    await sql.end({ timeout: 1 });
  }
}
