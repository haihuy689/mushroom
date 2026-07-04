import { NextResponse } from "next/server";
import postgres from "postgres";
import type { StorefrontStaffMember } from "@/lib/admin-access";
import { isOrderStatus } from "@/lib/order-status";
import type { StorefrontProductRecord } from "@/lib/storefront-product";
import type { StorefrontOrder } from "@/lib/storefront-state";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

const ADMIN_DASHBOARD_TIMEOUT_MS = 5000;

export const preferredRegion = "sin1";

type StaffRow = {
  added_by: string;
  created_at: string;
  display_identity: string;
  identity_key: string;
};

type ProductRow = {
  accent: string;
  badge: string;
  category: string;
  created_at: string;
  description: string;
  format: string;
  id: string;
  inventory_count: number;
  is_active: boolean;
  name: string;
  packaging: string;
  price_pi: string | number;
  slug: string;
  source_product_id: string | null;
  tagline: string;
  updated_at: string;
  weight_unit: string | null;
  weight_value: string | number | null;
};

type OrderRow = {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  total_pi: string | number;
  created_at: string;
  txid: string | null;
  payment_id: string | null;
  pi_uid: string;
  fulfillment_status: string | null;
  status_updated_at: string | null;
  status_updated_by: string | null;
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

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim() || "";
}

function mapStaffRows(rows: StaffRow[]): StorefrontStaffMember[] {
  return rows.map((row) => ({
    addedAt: row.created_at,
    addedBy: row.added_by,
    identity: row.display_identity,
    identityKey: row.identity_key,
  }));
}

function mapProductRows(rows: ProductRow[]): StorefrontProductRecord[] {
  return rows.map((row) => ({
    accent: row.accent,
    badge: row.badge,
    category: row.category,
    createdAt: row.created_at,
    description: row.description,
    format: row.format,
    id: row.id,
    inventoryCount: row.inventory_count,
    isActive: row.is_active,
    name: row.name,
    packaging: row.packaging,
    pricePi: Number(row.price_pi),
    slug: row.slug,
    sourceProductId: row.source_product_id,
    tagline: row.tagline,
    updatedAt: row.updated_at,
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
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: row.quantity,
    totalPi: Number(row.total_pi),
    createdAt: row.created_at,
    shopperUid: row.pi_uid,
    txid: row.txid ?? undefined,
    paymentId: row.payment_id ?? undefined,
    status: isOrderStatus(row.fulfillment_status)
      ? row.fulfillment_status
      : undefined,
    statusUpdatedAt: row.status_updated_at ?? undefined,
    statusUpdatedBy: row.status_updated_by ?? undefined,
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

  const sql = postgres(databaseUrl, {
    connect_timeout: 5,
    idle_timeout: 5,
    max: 4,
    prepare: false,
  });

  try {
    const [orderRows, orderItemRows, staffRows, productRows] =
      await withDashboardTimeout(
        Promise.all([
          sql<OrderRow[]>`
            select
              id,
              pi_uid,
              product_id,
              product_name,
              quantity,
              total_pi,
              created_at::text,
              txid,
              payment_id,
              fulfillment_status,
              status_updated_at::text,
              status_updated_by,
              username,
              shipping_full_name,
              shipping_phone,
              shipping_line1,
              shipping_line2,
              shipping_ward,
              shipping_district,
              shipping_city,
              shipping_country,
              shipping_note
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
                  created_at::text
                from storefront_staff_members
                where is_active = true
                order by created_at desc
              `
            : Promise.resolve([]),
          access.canManageStaff
            ? sql<ProductRow[]>`
                select
                  id,
                  source_product_id,
                  slug,
                  name,
                  tagline,
                  description,
                  category,
                  format,
                  price_pi,
                  badge,
                  accent,
                  packaging,
                  weight_value,
                  weight_unit,
                  inventory_count,
                  is_active,
                  created_at::text,
                  updated_at::text
                from storefront_products
                order by source_product_id nulls last, updated_at desc, name asc
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
