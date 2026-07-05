import "server-only";

import postgres, { type TransactionSql } from "postgres";
import {
  buildStorefrontAdminAccess,
  getUserAdminIdentityKeys,
  isStorefrontOwner,
  normalizeUsernameKey,
  type StorefrontAdminAccess,
  type StorefrontStaffMember,
} from "@/lib/admin-access";
import { isOrderStatus, type OrderStatus } from "@/lib/order-status";
import type { PiVerifiedUser } from "@/lib/pi-types";
import {
  DEFAULT_PRODUCT_OPTIONS,
  PRODUCT_OPTION_GROUPS,
  isProductOptionGroup,
  normalizeProductOptionValue,
  type StorefrontProductOption,
  type StorefrontProductOptionGroup,
} from "@/lib/product-options";
import {
  normalizeStorefrontProductInput,
  type StorefrontProductInput,
  type StorefrontProductRecord,
} from "@/lib/storefront-product";
import { getDatabaseUrl, getSql, isDatabaseConfigured } from "@/lib/db";
import {
  emptyStorefrontState,
  mergeStorefrontState,
  normalizeOrders,
  normalizeStorefrontState,
  type StorefrontOrder,
  type StorefrontStateResponse,
  type StorefrontStateSnapshot,
} from "@/lib/storefront-state";

type CartRow = {
  product_id: string;
  quantity: number;
};

type AddressRow = {
  id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  note: string;
  is_default: boolean;
  created_at: string;
};

type OrderRow = {
  admin_note: string | null;
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
  shipping_carrier: string | null;
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
};

type OrderItemRow = {
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  total_pi: string | number;
};

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

type StorefrontUserRow = {
  username: string | null;
};

type StorefrontStaffInput = {
  canManageOrders?: boolean;
  canManageProducts?: boolean;
  canManageStaff?: boolean;
  fullName?: string | null;
  identity: string;
  isActive?: boolean;
  note?: string | null;
  role?: string | null;
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

type ProductOptionRow = {
  created_at: string;
  option_group: string;
  updated_at: string;
  value: string;
};

declare global {
  var __mushroomStorefrontSchemaPromise: Promise<boolean> | undefined;
}

const STOREFRONT_DB_TIMEOUT_MS = 8000;
const STOREFRONT_REQUIRED_TABLES = [
  "storefront_users",
  "storefront_cart_items",
  "storefront_addresses",
  "storefront_orders",
  "storefront_order_items",
  "storefront_staff_members",
  "storefront_products",
  "storefront_product_options",
] as const;

const STOREFRONT_REQUIRED_COLUMNS = [
  { table: "storefront_orders", column: "fulfillment_status" },
  { table: "storefront_orders", column: "status_updated_at" },
  { table: "storefront_orders", column: "status_updated_by" },
  { table: "storefront_orders", column: "shipping_carrier" },
  { table: "storefront_orders", column: "tracking_code" },
  { table: "storefront_orders", column: "admin_note" },
  { table: "storefront_staff_members", column: "updated_at" },
  { table: "storefront_staff_members", column: "is_active" },
  { table: "storefront_staff_members", column: "role" },
  { table: "storefront_staff_members", column: "full_name" },
  { table: "storefront_staff_members", column: "note" },
  { table: "storefront_staff_members", column: "can_manage_products" },
  { table: "storefront_staff_members", column: "can_manage_orders" },
  { table: "storefront_staff_members", column: "can_manage_staff" },
  { table: "storefront_products", column: "sku" },
  { table: "storefront_products", column: "compare_at_pi" },
  { table: "storefront_products", column: "cost_pi" },
  { table: "storefront_products", column: "image_url" },
  { table: "storefront_products", column: "is_featured" },
  { table: "storefront_products", column: "low_stock_threshold" },
  { table: "storefront_products", column: "base_sold_count" },
  { table: "storefront_products", column: "actual_sold_count" },
  { table: "storefront_products", column: "gallery_image_urls" },
  { table: "storefront_products", column: "video_url" },
  { table: "storefront_products", column: "media_note" },
] as const;

function withStorefrontTimeout<T>(promise: Promise<T>, label: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out.`));
    }, STOREFRONT_DB_TIMEOUT_MS);

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

async function hasStorefrontCoreSchema(sql: NonNullable<ReturnType<typeof getSql>>) {
  try {
    const [tableRows, columnRows] = await Promise.all([
      sql<{ table_name: string }[]>`
        select table_name
        from information_schema.tables
        where table_schema = 'public'
          and table_name in ${sql(STOREFRONT_REQUIRED_TABLES)}
      `,
      sql<{ table_name: string; column_name: string }[]>`
        select table_name, column_name
        from information_schema.columns
        where table_schema = 'public'
          and table_name in ${sql(
            Array.from(
              new Set(STOREFRONT_REQUIRED_COLUMNS.map((entry) => entry.table)),
            ),
          )}
      `,
    ]);

    const columnSet = new Set(
      columnRows.map((row) => `${row.table_name}:${row.column_name}`),
    );

    return (
      tableRows.length === STOREFRONT_REQUIRED_TABLES.length &&
      STOREFRONT_REQUIRED_COLUMNS.every((entry) =>
        columnSet.has(`${entry.table}:${entry.column}`),
      )
    );
  } catch {
    return false;
  }
}

export async function ensureStorefrontSchema() {
  if (!isDatabaseConfigured()) {
    return false;
  }

  if (!globalThis.__mushroomStorefrontSchemaPromise) {
    const sql = getSql();

    if (!sql) {
      return false;
    }

    globalThis.__mushroomStorefrontSchemaPromise = withStorefrontTimeout(
      (async () => {
        if (await hasStorefrontCoreSchema(sql)) {
          return true;
        }

        await sql.begin(async (transaction) => {
          await transaction`
            create table if not exists storefront_users (
              pi_uid text primary key,
              username text,
              wallet_address text,
              scopes jsonb not null default '[]'::jsonb,
              created_at timestamptz not null default now(),
              updated_at timestamptz not null default now()
            )
          `;
          await transaction`
            create table if not exists storefront_cart_items (
              pi_uid text not null references storefront_users (pi_uid) on delete cascade,
              product_id text not null,
              quantity integer not null,
              updated_at timestamptz not null default now(),
              primary key (pi_uid, product_id)
            )
          `;
          await transaction`
            create table if not exists storefront_addresses (
              id text primary key,
              pi_uid text not null references storefront_users (pi_uid) on delete cascade,
              full_name text not null,
              phone text not null,
              line1 text not null,
              line2 text not null default '',
              ward text not null,
              district text not null,
              city text not null,
              country text not null,
              note text not null default '',
              is_default boolean not null default false,
              created_at timestamptz not null,
              updated_at timestamptz not null default now()
            )
          `;
          await transaction`
            create table if not exists storefront_orders (
              id text primary key,
              pi_uid text not null references storefront_users (pi_uid) on delete cascade,
              product_id text not null,
              product_name text not null,
              quantity integer not null,
              total_pi numeric(18, 4) not null,
              created_at timestamptz not null,
              txid text,
              payment_id text,
              username text,
              shipping_full_name text,
              shipping_phone text,
              shipping_line1 text,
              shipping_line2 text,
              shipping_ward text,
              shipping_district text,
              shipping_city text,
              shipping_country text,
              shipping_note text
            )
          `;
          await transaction`
            alter table storefront_orders
            add column if not exists fulfillment_status text
          `;
          await transaction`
            alter table storefront_orders
            add column if not exists status_updated_at timestamptz
          `;
          await transaction`
            alter table storefront_orders
            add column if not exists status_updated_by text
          `;
          await transaction`
            alter table storefront_orders
            add column if not exists shipping_carrier text
          `;
          await transaction`
            alter table storefront_orders
            add column if not exists tracking_code text
          `;
          await transaction`
            alter table storefront_orders
            add column if not exists admin_note text
          `;
          await transaction`
            create table if not exists storefront_order_items (
              order_id text not null references storefront_orders (id) on delete cascade,
              product_id text not null,
              product_name text not null,
              quantity integer not null,
              total_pi numeric(18, 4) not null,
              primary key (order_id, product_id)
            )
          `;
          await transaction`
            create index if not exists storefront_orders_pi_uid_created_at_idx
            on storefront_orders (pi_uid, created_at desc)
          `;
          await transaction`
            create table if not exists storefront_staff_members (
              username_key text primary key,
              display_username text not null,
              added_by text not null,
              created_at timestamptz not null default now(),
              updated_at timestamptz not null default now(),
              is_active boolean not null default true
            )
          `;
          await transaction`
            alter table storefront_staff_members
            add column if not exists role text not null default 'staff'
          `;
          await transaction`
            alter table storefront_staff_members
            add column if not exists full_name text not null default ''
          `;
          await transaction`
            alter table storefront_staff_members
            add column if not exists note text not null default ''
          `;
          await transaction`
            alter table storefront_staff_members
            add column if not exists can_manage_products boolean not null default false
          `;
          await transaction`
            alter table storefront_staff_members
            add column if not exists can_manage_orders boolean not null default true
          `;
          await transaction`
            alter table storefront_staff_members
            add column if not exists can_manage_staff boolean not null default false
          `;
          await transaction`
            create table if not exists storefront_products (
              id text primary key,
              source_product_id text unique,
              slug text not null,
              name text not null,
              sku text not null default '',
              tagline text not null default '',
              description text not null default '',
              category text not null default '',
              format text not null default '',
              price_pi numeric(18, 4) not null,
              compare_at_pi numeric(18, 4),
              cost_pi numeric(18, 4),
              base_sold_count integer not null default 0,
              actual_sold_count integer not null default 0,
              badge text not null default '',
              accent text not null default '#c38a33',
              packaging text not null default '',
              image_url text not null default '',
              gallery_image_urls jsonb not null default '[]'::jsonb,
              video_url text not null default '',
              media_note text not null default '',
              weight_value numeric(10, 2),
              weight_unit text,
              inventory_count integer not null default 0,
              low_stock_threshold integer not null default 5,
              is_active boolean not null default true,
              is_featured boolean not null default false,
              created_at timestamptz not null default now(),
              updated_at timestamptz not null default now()
            )
          `;
          await transaction`
            alter table storefront_products
            add column if not exists sku text not null default ''
          `;
          await transaction`
            alter table storefront_products
            add column if not exists compare_at_pi numeric(18, 4)
          `;
          await transaction`
            alter table storefront_products
            add column if not exists cost_pi numeric(18, 4)
          `;
          await transaction`
            alter table storefront_products
            add column if not exists image_url text not null default ''
          `;
          await transaction`
            alter table storefront_products
            add column if not exists base_sold_count integer not null default 0
          `;
          await transaction`
            alter table storefront_products
            add column if not exists actual_sold_count integer not null default 0
          `;
          await transaction`
            alter table storefront_products
            add column if not exists gallery_image_urls jsonb not null default '[]'::jsonb
          `;
          await transaction`
            alter table storefront_products
            add column if not exists video_url text not null default ''
          `;
          await transaction`
            alter table storefront_products
            add column if not exists media_note text not null default ''
          `;
          await transaction`
            alter table storefront_products
            add column if not exists low_stock_threshold integer not null default 5
          `;
          await transaction`
            alter table storefront_products
            add column if not exists is_featured boolean not null default false
          `;
          await transaction`
            create index if not exists storefront_products_active_updated_idx
            on storefront_products (is_active, updated_at desc)
          `;
          await transaction`
            create table if not exists storefront_product_options (
              option_group text not null,
              value text not null,
              created_at timestamptz not null default now(),
              updated_at timestamptz not null default now(),
              primary key (option_group, value)
            )
          `;

          for (const group of PRODUCT_OPTION_GROUPS) {
            for (const value of DEFAULT_PRODUCT_OPTIONS[group]) {
              await transaction`
                insert into storefront_product_options (
                  option_group,
                  value,
                  updated_at
                )
                values (
                  ${group},
                  ${value},
                  now()
                )
                on conflict (option_group, value) do nothing
              `;
            }
          }
        });

        return true;
      })(),
      "Storefront schema initialization",
    );
  }

  try {
    await globalThis.__mushroomStorefrontSchemaPromise;
    return true;
  } catch {
    globalThis.__mushroomStorefrontSchemaPromise = undefined;
    return false;
  }
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

function mapProductRow(row: ProductRow): StorefrontProductRecord {
  return {
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
  };
}

function mapProductOptionRow(row: ProductOptionRow): StorefrontProductOption {
  const group = isProductOptionGroup(row.option_group)
    ? row.option_group
    : "category";

  return {
    createdAt: row.created_at,
    group,
    updatedAt: row.updated_at,
    value: row.value,
  };
}

function normalizeProductOptionInput(
  group: string | null | undefined,
  value: unknown,
) {
  if (!isProductOptionGroup(group)) {
    throw new Error("Invalid product option group.");
  }

  const normalizedValue = normalizeProductOptionValue(value);

  if (!normalizedValue) {
    throw new Error("Product option value is required.");
  }

  return {
    group,
    value: normalizedValue,
  };
}

async function updateProductsForOptionRename(
  sql: TransactionSql,
  group: StorefrontProductOptionGroup,
  currentValue: string,
  nextValue: string,
) {
  switch (group) {
    case "category":
      await sql`
        update storefront_products
        set category = ${nextValue}, updated_at = now()
        where category = ${currentValue}
      `;
      return;
    case "format":
      await sql`
        update storefront_products
        set format = ${nextValue}, updated_at = now()
        where format = ${currentValue}
      `;
      return;
    case "packaging":
      await sql`
        update storefront_products
        set packaging = ${nextValue}, updated_at = now()
        where packaging = ${currentValue}
      `;
      return;
    case "weightUnit":
      await sql`
        update storefront_products
        set weight_unit = ${nextValue}, updated_at = now()
        where weight_unit = ${currentValue}
      `;
      return;
  }
}

function mapStaffRow(row: StaffRow): StorefrontStaffMember {
  return {
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
  };
}

async function upsertStorefrontUser(user: PiVerifiedUser) {
  const sql = getSql();

  if (!sql) {
    return;
  }

  await sql`
    insert into storefront_users (
      pi_uid,
      username,
      wallet_address,
      scopes,
      updated_at
    )
    values (
      ${user.uid},
      ${user.username ?? null},
      ${user.wallet_address ?? null},
      ${JSON.stringify(user.credentials?.scopes ?? [])}::jsonb,
      now()
    )
    on conflict (pi_uid) do update
    set
      username = coalesce(excluded.username, storefront_users.username),
      wallet_address = excluded.wallet_address,
      scopes = excluded.scopes,
      updated_at = now()
  `;
}

async function hydrateStorefrontUserIdentity(user: PiVerifiedUser) {
  if (user.username || !(await ensureStorefrontSchema())) {
    return user;
  }

  const sql = getSql();

  if (!sql) {
    return user;
  }

  const rows = await sql<StorefrontUserRow[]>`
    select username
    from storefront_users
    where pi_uid = ${user.uid}
    limit 1
  `;

  const storedUsername = rows[0]?.username?.trim();

  if (!storedUsername) {
    return user;
  }

  return {
    ...user,
    username: storedUsername,
  } satisfies PiVerifiedUser;
}

async function readStorefrontState(piUid: string) {
  const sql = getSql();

  if (!sql) {
    return emptyStorefrontState();
  }

  const [cartRows, addressRows, orderRows, orderItemRows] = await Promise.all([
    sql<CartRow[]>`
      select product_id, quantity
      from storefront_cart_items
      where pi_uid = ${piUid}
      order by updated_at desc, product_id asc
    `,
    sql<AddressRow[]>`
      select
        id,
        full_name,
        phone,
        line1,
        line2,
        ward,
        district,
        city,
        country,
        note,
        is_default,
        created_at::text
      from storefront_addresses
      where pi_uid = ${piUid}
      order by is_default desc, created_at desc
    `,
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
        txid,
        payment_id,
        fulfillment_status,
        shipping_carrier,
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
        shipping_note
      from storefront_orders
      where pi_uid = ${piUid}
      order by created_at desc
      limit 24
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
      where parent.pi_uid = ${piUid}
      order by parent.created_at desc, item.product_name asc
    `,
  ]);

  return normalizeStorefrontState({
    cartItems: cartRows.map((row) => ({
      productId: row.product_id,
      quantity: row.quantity,
    })),
    addresses: addressRows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      phone: row.phone,
      line1: row.line1,
      line2: row.line2,
      ward: row.ward,
      district: row.district,
      city: row.city,
      country: row.country,
      note: row.note,
      isDefault: row.is_default,
      createdAt: row.created_at,
    })),
    orders: mapOrderRows(orderRows, orderItemRows, 24),
  });
}

async function replaceCartItems(
  piUid: string,
  cartItems: StorefrontStateSnapshot["cartItems"],
) {
  const sql = getSql();

  if (!sql) {
    return;
  }

  await sql.begin(async (transaction) => {
    await transaction`
      delete from storefront_cart_items
      where pi_uid = ${piUid}
    `;

    for (const item of cartItems) {
      await transaction`
        insert into storefront_cart_items (
          pi_uid,
          product_id,
          quantity,
          updated_at
        )
        values (
          ${piUid},
          ${item.productId},
          ${item.quantity},
          now()
        )
      `;
    }
  });
}

async function replaceAddresses(
  piUid: string,
  addresses: StorefrontStateSnapshot["addresses"],
) {
  const sql = getSql();

  if (!sql) {
    return;
  }

  await sql.begin(async (transaction) => {
    await transaction`
      delete from storefront_addresses
      where pi_uid = ${piUid}
    `;

    for (const address of addresses) {
      await transaction`
        insert into storefront_addresses (
          id,
          pi_uid,
          full_name,
          phone,
          line1,
          line2,
          ward,
          district,
          city,
          country,
          note,
          is_default,
          created_at,
          updated_at
        )
        values (
          ${address.id},
          ${piUid},
          ${address.fullName},
          ${address.phone},
          ${address.line1},
          ${address.line2 ?? ""},
          ${address.ward},
          ${address.district},
          ${address.city},
          ${address.country},
          ${address.note ?? ""},
          ${address.isDefault},
          ${address.createdAt},
          now()
        )
      `;
    }
  });
}

async function upsertOrder(piUid: string, order: StorefrontOrder) {
  const sql = getSql();

  if (!sql) {
    return;
  }

  await sql.begin(async (transaction) => {
    const existingRows = await transaction<{ id: string }[]>`
      select id
      from storefront_orders
      where id = ${order.id}
      limit 1
    `;
    const shouldIncrementSoldCount = existingRows.length === 0;

    await transaction`
      insert into storefront_orders (
        id,
        pi_uid,
        product_id,
        product_name,
        quantity,
        total_pi,
        created_at,
        txid,
        payment_id,
        fulfillment_status,
        shipping_carrier,
        status_updated_at,
        status_updated_by,
        tracking_code,
        admin_note,
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
      )
      values (
        ${order.id},
        ${piUid},
        ${order.productId},
        ${order.productName},
        ${order.quantity},
        ${order.totalPi},
        ${order.createdAt},
        ${order.txid ?? null},
        ${order.paymentId ?? null},
        ${order.status ?? null},
        ${order.shippingCarrier ?? null},
        ${order.statusUpdatedAt ?? null},
        ${order.statusUpdatedBy ?? null},
        ${order.trackingCode ?? null},
        ${order.adminNote ?? null},
        ${order.username ?? null},
        ${order.shippingAddress?.fullName ?? null},
        ${order.shippingAddress?.phone ?? null},
        ${order.shippingAddress?.line1 ?? null},
        ${order.shippingAddress?.line2 ?? null},
        ${order.shippingAddress?.ward ?? null},
        ${order.shippingAddress?.district ?? null},
        ${order.shippingAddress?.city ?? null},
        ${order.shippingAddress?.country ?? null},
        ${order.shippingAddress?.note ?? null}
      )
      on conflict (id) do update
      set
        product_id = excluded.product_id,
        product_name = excluded.product_name,
        quantity = excluded.quantity,
        total_pi = excluded.total_pi,
        created_at = excluded.created_at,
        txid = excluded.txid,
        payment_id = excluded.payment_id,
        fulfillment_status = excluded.fulfillment_status,
        shipping_carrier = coalesce(storefront_orders.shipping_carrier, excluded.shipping_carrier),
        status_updated_at = excluded.status_updated_at,
        status_updated_by = excluded.status_updated_by,
        tracking_code = coalesce(storefront_orders.tracking_code, excluded.tracking_code),
        admin_note = coalesce(storefront_orders.admin_note, excluded.admin_note),
        username = excluded.username,
        shipping_full_name = excluded.shipping_full_name,
        shipping_phone = excluded.shipping_phone,
        shipping_line1 = excluded.shipping_line1,
        shipping_line2 = excluded.shipping_line2,
        shipping_ward = excluded.shipping_ward,
        shipping_district = excluded.shipping_district,
        shipping_city = excluded.shipping_city,
        shipping_country = excluded.shipping_country,
        shipping_note = excluded.shipping_note
    `;

    await transaction`
      delete from storefront_order_items
      where order_id = ${order.id}
    `;

    for (const item of order.items ?? []) {
      await transaction`
        insert into storefront_order_items (
          order_id,
          product_id,
          product_name,
          quantity,
          total_pi
        )
        values (
          ${order.id},
          ${item.productId},
          ${item.productName},
          ${item.quantity},
          ${item.totalPi}
        )
      `;
    }

    if (shouldIncrementSoldCount) {
      for (const item of order.items ?? []) {
        if (item.quantity <= 0) {
          continue;
        }

        await transaction`
          update storefront_products
          set
            actual_sold_count = actual_sold_count + ${item.quantity},
            updated_at = now()
          where id = ${item.productId}
        `;
      }
    }
  });
}

function mapOrderRows(
  orderRows: OrderRow[],
  orderItemRows: OrderItemRow[],
  limit = 24,
): StorefrontOrder[] {
  const itemsByOrderId = new Map<
    string,
    Array<{
      productId: string;
      productName: string;
      quantity: number;
      totalPi: number;
    }>
  >();

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

  return normalizeOrders(
    orderRows.map((row) => ({
      adminNote: row.admin_note ?? undefined,
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      totalPi: Number(row.total_pi),
      createdAt: row.created_at,
      shopperUid: row.pi_uid,
      txid: row.txid ?? undefined,
      paymentId: row.payment_id ?? undefined,
      shippingCarrier: row.shipping_carrier ?? undefined,
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
    })),
    limit,
  );
}

async function readAllStorefrontOrders() {
  const sql = getSql();

  if (!sql) {
    return [] as StorefrontOrder[];
  }

  try {
    const [orderRows, orderItemRows] = await Promise.all([
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
          txid,
          payment_id,
          fulfillment_status,
          shipping_carrier,
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
    ]);

    return mapOrderRows(orderRows, orderItemRows, 80);
  } catch {
    return [] as StorefrontOrder[];
  }
}

async function isStorefrontStaff(user: PiVerifiedUser | null) {
  const identityKeys = getUserAdminIdentityKeys(user);
  const sql = getSql();

  if (!sql || identityKeys.length === 0) {
    return null;
  }

  const rows = await sql<StaffRow[]>`
    select username_key as identity_key
      , display_username as display_identity
      , added_by
      , created_at::text
      , full_name
      , note
      , role
      , is_active
      , can_manage_orders
      , can_manage_products
      , can_manage_staff
    from storefront_staff_members
    where username_key in ${sql(identityKeys)}
      and is_active = true
    limit 1
  `;

  return rows[0] ? mapStaffRow(rows[0]) : null;
}

export async function getStorefrontAdminAccess(
  user: PiVerifiedUser | null,
): Promise<StorefrontAdminAccess> {
  if (!user?.username && !user?.uid) {
    return buildStorefrontAdminAccess(null, null);
  }

  const resolvedUser = await hydrateStorefrontUserIdentity(user);

  if (isStorefrontOwner(resolvedUser)) {
    return buildStorefrontAdminAccess(resolvedUser, null);
  }

  if (!(await ensureStorefrontSchema())) {
    return buildStorefrontAdminAccess(resolvedUser, null);
  }

  return buildStorefrontAdminAccess(
    resolvedUser,
    await isStorefrontStaff(resolvedUser),
  );
}

export async function listStorefrontStaffMembers() {
  const sql = getSql();

  if (!sql) {
    return [] as StorefrontStaffMember[];
  }

  try {
    const rows = await sql<StaffRow[]>`
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
    `;

    return rows.map(mapStaffRow);
  } catch {
    return [] as StorefrontStaffMember[];
  }
}

export async function saveStorefrontStaffMember(
  owner: PiVerifiedUser,
  input: StorefrontStaffInput,
) {
  if (!(await ensureStorefrontSchema())) {
    throw new Error("Database is not configured.");
  }

  const identityKey = normalizeUsernameKey(input.identity);
  const displayIdentity = input.identity.trim();

  if (!identityKey || !displayIdentity) {
    throw new Error("Staff identity is required.");
  }

  const sql = getSql();

  if (!sql) {
    throw new Error("Database is not configured.");
  }

  await sql`
    insert into storefront_staff_members (
      username_key,
      display_username,
      added_by,
      role,
      full_name,
      note,
      can_manage_products,
      can_manage_orders,
      can_manage_staff,
      created_at,
      updated_at,
      is_active
    )
    values (
      ${identityKey},
      ${displayIdentity},
      ${owner.username ?? owner.uid},
      ${input.role?.trim() || "staff"},
      ${input.fullName?.trim() || ""},
      ${input.note?.trim() || ""},
      ${input.canManageProducts === true},
      ${input.canManageOrders !== false},
      ${input.canManageStaff === true},
      now(),
      now(),
      ${input.isActive !== false}
    )
    on conflict (username_key) do update
    set
      display_username = excluded.display_username,
      added_by = excluded.added_by,
      role = excluded.role,
      full_name = excluded.full_name,
      note = excluded.note,
      can_manage_products = excluded.can_manage_products,
      can_manage_orders = excluded.can_manage_orders,
      can_manage_staff = excluded.can_manage_staff,
      updated_at = now(),
      is_active = excluded.is_active
  `;

  return listStorefrontStaffMembers();
}

export async function removeStorefrontStaffMember(username: string) {
  if (!(await ensureStorefrontSchema())) {
    throw new Error("Database is not configured.");
  }

  const usernameKey = normalizeUsernameKey(username);
  const sql = getSql();

  if (!sql || !usernameKey) {
    return listStorefrontStaffMembers();
  }

  await sql`
    update storefront_staff_members
    set
      is_active = false,
      updated_at = now()
    where username_key = ${usernameKey}
  `;

  return listStorefrontStaffMembers();
}

export async function listStorefrontProductRecords() {
  const directRecords = await readStorefrontProductRecordsDirect();

  if (directRecords !== null) {
    return directRecords;
  }

  return [];
}

export async function readStorefrontProductRecordsDirect() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return null as StorefrontProductRecord[] | null;
  }

  if (!(await ensureStorefrontSchema())) {
    return null as StorefrontProductRecord[] | null;
  }

  const sql = postgres(databaseUrl, {
    connect_timeout: 5,
    idle_timeout: 5,
    max: 1,
    prepare: false,
  });

  try {
    await withStorefrontTimeout(
      sql`
        delete from storefront_products
        where source_product_id is not null
      `,
      "Legacy storefront product cleanup",
    );

    const rows = await withStorefrontTimeout(
      sql<ProductRow[]>`
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
      `,
      "Storefront catalog read",
    );

    return rows.map(mapProductRow);
  } catch {
    return null as StorefrontProductRecord[] | null;
  } finally {
    await sql.end({ timeout: 1 }).catch(() => undefined);
  }
}

export async function listStorefrontActiveProductRecords() {
  return (await listStorefrontProductRecords()).filter((product) => product.isActive);
}

export async function saveStorefrontProduct(input: Partial<StorefrontProductInput>) {
  if (!(await ensureStorefrontSchema())) {
    throw new Error("Database is not configured.");
  }

  const sql = getSql();

  if (!sql) {
    throw new Error("Database is not configured.");
  }

  const product = normalizeStorefrontProductInput(input);

  const rows = await sql<ProductRow[]>`
    insert into storefront_products (
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
      created_at,
      updated_at
    )
    values (
      ${product.id},
      ${product.sourceProductId},
      ${product.slug},
      ${product.name},
      ${product.sku},
      ${product.tagline},
      ${product.description},
      ${product.category},
      ${product.format},
      ${product.pricePi},
      ${product.compareAtPi},
      ${product.costPi},
      ${product.baseSoldCount},
      ${product.actualSoldCount},
      ${product.badge},
      ${product.accent},
      ${product.packaging},
      ${product.imageUrl},
      ${sql.json(product.galleryImageUrls)},
      ${product.videoUrl},
      ${product.mediaNote},
      ${product.weightValue},
      ${product.weightUnit},
      ${product.inventoryCount},
      ${product.lowStockThreshold},
      ${product.isActive},
      ${product.isFeatured},
      now(),
      now()
    )
    on conflict (id) do update
    set
      source_product_id = excluded.source_product_id,
      slug = excluded.slug,
      name = excluded.name,
      sku = excluded.sku,
      tagline = excluded.tagline,
      description = excluded.description,
      category = excluded.category,
      format = excluded.format,
      price_pi = excluded.price_pi,
      compare_at_pi = excluded.compare_at_pi,
      cost_pi = excluded.cost_pi,
      base_sold_count = excluded.base_sold_count,
      actual_sold_count = storefront_products.actual_sold_count,
      badge = excluded.badge,
      accent = excluded.accent,
      packaging = excluded.packaging,
      image_url = excluded.image_url,
      gallery_image_urls = excluded.gallery_image_urls,
      video_url = excluded.video_url,
      media_note = excluded.media_note,
      weight_value = excluded.weight_value,
      weight_unit = excluded.weight_unit,
      inventory_count = excluded.inventory_count,
      low_stock_threshold = excluded.low_stock_threshold,
      is_active = excluded.is_active,
      is_featured = excluded.is_featured,
      updated_at = now()
    returning
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
  `;

  return mapProductRow(rows[0]);
}

export async function deleteStorefrontProduct(productId: string) {
  if (!(await ensureStorefrontSchema())) {
    throw new Error("Database is not configured.");
  }

  const sql = getSql();
  const normalizedProductId = productId.trim();

  if (!sql) {
    throw new Error("Database is not configured.");
  }

  if (!normalizedProductId) {
    throw new Error("Product id is required.");
  }

  const deletedRows = await sql.begin(async (transaction) => {
    await transaction`
      delete from storefront_cart_items
      where product_id = ${normalizedProductId}
    `;

    return transaction<{ id: string }[]>`
      delete from storefront_products
      where id = ${normalizedProductId}
      returning id
    `;
  });

  if (deletedRows.length === 0) {
    throw new Error("Product not found.");
  }

  return {
    id: deletedRows[0].id,
  };
}

export async function listStorefrontProductOptions() {
  if (!(await ensureStorefrontSchema())) {
    throw new Error("Database is not configured.");
  }

  const sql = getSql();

  if (!sql) {
    throw new Error("Database is not configured.");
  }

  const rows = await sql<ProductOptionRow[]>`
    select
      option_group,
      value,
      created_at::text,
      updated_at::text
    from storefront_product_options
    order by
      case option_group
        when 'category' then 1
        when 'format' then 2
        when 'packaging' then 3
        when 'weightUnit' then 4
        else 5
      end,
      value asc
  `;

  return rows.map(mapProductOptionRow);
}

export async function saveStorefrontProductOption(
  groupInput: string | null | undefined,
  valueInput: unknown,
) {
  if (!(await ensureStorefrontSchema())) {
    throw new Error("Database is not configured.");
  }

  const sql = getSql();
  const { group, value } = normalizeProductOptionInput(groupInput, valueInput);

  if (!sql) {
    throw new Error("Database is not configured.");
  }

  await sql`
    insert into storefront_product_options (
      option_group,
      value,
      updated_at
    )
    values (
      ${group},
      ${value},
      now()
    )
    on conflict (option_group, value) do update
    set updated_at = now()
  `;

  return listStorefrontProductOptions();
}

export async function renameStorefrontProductOption(
  groupInput: string | null | undefined,
  currentValueInput: unknown,
  nextValueInput: unknown,
) {
  if (!(await ensureStorefrontSchema())) {
    throw new Error("Database is not configured.");
  }

  const sql = getSql();
  const currentOption = normalizeProductOptionInput(groupInput, currentValueInput);
  const nextValue = normalizeProductOptionValue(nextValueInput);

  if (!sql) {
    throw new Error("Database is not configured.");
  }

  if (!nextValue) {
    throw new Error("Product option value is required.");
  }

  await sql.begin(async (transaction) => {
    await transaction`
      insert into storefront_product_options (
        option_group,
        value,
        updated_at
      )
      values (
        ${currentOption.group},
        ${nextValue},
        now()
      )
      on conflict (option_group, value) do update
      set updated_at = now()
    `;

    if (currentOption.value !== nextValue) {
      await transaction`
        delete from storefront_product_options
        where option_group = ${currentOption.group}
          and value = ${currentOption.value}
      `;
      await updateProductsForOptionRename(
        transaction,
        currentOption.group,
        currentOption.value,
        nextValue,
      );
    }
  });

  return listStorefrontProductOptions();
}

export async function deleteStorefrontProductOption(
  groupInput: string | null | undefined,
  valueInput: unknown,
) {
  if (!(await ensureStorefrontSchema())) {
    throw new Error("Database is not configured.");
  }

  const sql = getSql();
  const { group, value } = normalizeProductOptionInput(groupInput, valueInput);

  if (!sql) {
    throw new Error("Database is not configured.");
  }

  await sql`
    delete from storefront_product_options
    where option_group = ${group}
      and value = ${value}
  `;

  return listStorefrontProductOptions();
}

export async function listStorefrontOrdersForAdmin() {
  return readAllStorefrontOrders();
}

type StorefrontOrderAdminUpdate = {
  adminNote?: string | null;
  shippingCarrier?: string | null;
  status?: OrderStatus;
  trackingCode?: string | null;
};

export async function updateStorefrontOrderRecord(
  orderId: string,
  update: StorefrontOrderAdminUpdate,
  actorUsername: string,
) {
  if (!(await ensureStorefrontSchema())) {
    throw new Error("Database is not configured.");
  }

  const sql = getSql();

  if (!sql) {
    throw new Error("Database is not configured.");
  }

  const updatedRows = await sql<OrderRow[]>`
    update storefront_orders
    set
      fulfillment_status = ${update.status ?? null},
      shipping_carrier = ${update.shippingCarrier?.trim() || null},
      status_updated_at = now(),
      status_updated_by = ${actorUsername},
      tracking_code = ${update.trackingCode?.trim() || null},
      admin_note = ${update.adminNote?.trim() || null}
    where id = ${orderId}
    returning
      admin_note,
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
      shipping_carrier,
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
      shipping_note
  `;

  if (updatedRows.length === 0) {
    throw new Error("Order not found.");
  }

  const itemRows = await sql<OrderItemRow[]>`
    select
      order_id,
      product_id,
      product_name,
      quantity,
      total_pi
    from storefront_order_items
    where order_id = ${orderId}
    order by product_name asc
  `;

  return mapOrderRows(updatedRows, itemRows, 1)[0];
}

export async function syncStorefrontSession(
  user: PiVerifiedUser,
  localState: StorefrontStateSnapshot,
): Promise<StorefrontStateResponse> {
  const normalizedLocalState = normalizeStorefrontState(localState);

  if (!(await ensureStorefrontSchema())) {
    return {
      databaseConfigured: false,
      ...normalizedLocalState,
    };
  }

  await upsertStorefrontUser(user);

  const remoteState = await readStorefrontState(user.uid);
  const mergedState = mergeStorefrontState(remoteState, normalizedLocalState);

  await replaceCartItems(user.uid, mergedState.cartItems);
  await replaceAddresses(user.uid, mergedState.addresses);

  for (const order of mergedState.orders) {
    await upsertOrder(user.uid, order);
  }

  return {
    databaseConfigured: true,
    ...mergedState,
  };
}

export async function persistStorefrontCart(
  user: PiVerifiedUser,
  cartItems: StorefrontStateSnapshot["cartItems"],
) {
  if (!(await ensureStorefrontSchema())) {
    return { databaseConfigured: false };
  }

  await upsertStorefrontUser(user);
  await replaceCartItems(user.uid, normalizeStorefrontState({ cartItems }).cartItems);

  return { databaseConfigured: true };
}

export async function persistStorefrontAddresses(
  user: PiVerifiedUser,
  addresses: StorefrontStateSnapshot["addresses"],
) {
  if (!(await ensureStorefrontSchema())) {
    return { databaseConfigured: false };
  }

  await upsertStorefrontUser(user);
  await replaceAddresses(user.uid, normalizeStorefrontState({ addresses }).addresses);

  return { databaseConfigured: true };
}

export async function persistStorefrontOrder(
  user: PiVerifiedUser,
  order: StorefrontOrder,
) {
  if (!(await ensureStorefrontSchema())) {
    return { databaseConfigured: false };
  }

  const normalizedOrder = normalizeStorefrontState({
    orders: [order],
  }).orders[0];

  if (!normalizedOrder) {
    return { databaseConfigured: true };
  }

  await upsertStorefrontUser(user);
  await upsertOrder(user.uid, normalizedOrder);

  return { databaseConfigured: true };
}
