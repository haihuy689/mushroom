import "server-only";

import {
  buildStorefrontAdminAccess,
  getUserAdminIdentityKeys,
  isStorefrontOwner,
  normalizeUsernameKey,
  type StorefrontAdminAccess,
  type StorefrontStaffMember,
} from "@/lib/admin-access";
import { defaultLocale } from "@/lib/i18n";
import { isOrderStatus, type OrderStatus } from "@/lib/order-status";
import type { PiVerifiedUser } from "@/lib/pi-types";
import {
  normalizeStorefrontProductInput,
  type StorefrontProductInput,
  type StorefrontProductRecord,
} from "@/lib/storefront-product";
import { getProducts } from "@/lib/site-data";
import { getSql, isDatabaseConfigured } from "@/lib/db";
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

type StaffRow = {
  added_by: string;
  created_at: string;
  display_identity: string;
  identity_key: string;
};

type StorefrontUserRow = {
  username: string | null;
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

declare global {
  var __mushroomStorefrontSchemaPromise: Promise<boolean> | undefined;
  var __mushroomStorefrontProductSeedPromise: Promise<boolean> | undefined;
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
    const rows = await sql<{ table_name: string }[]>`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
        and table_name in ${sql(STOREFRONT_REQUIRED_TABLES)}
    `;

    return rows.length === STOREFRONT_REQUIRED_TABLES.length;
  } catch {
    return false;
  }
}

async function hasStorefrontSeedProducts(sql: NonNullable<ReturnType<typeof getSql>>) {
  try {
    const rows = await sql<{ exists: boolean }[]>`
      select exists (
        select 1
        from storefront_products
        limit 1
      ) as exists
    `;

    return rows[0]?.exists === true;
  } catch {
    return false;
  }
}

async function ensureStorefrontSchema() {
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
            create table if not exists storefront_products (
              id text primary key,
              source_product_id text unique,
              slug text not null,
              name text not null,
              tagline text not null default '',
              description text not null default '',
              category text not null default '',
              format text not null default '',
              price_pi numeric(18, 4) not null,
              badge text not null default '',
              accent text not null default '#c38a33',
              packaging text not null default '',
              weight_value numeric(10, 2),
              weight_unit text,
              inventory_count integer not null default 0,
              is_active boolean not null default true,
              created_at timestamptz not null default now(),
              updated_at timestamptz not null default now()
            )
          `;
          await transaction`
            create index if not exists storefront_products_active_updated_idx
            on storefront_products (is_active, updated_at desc)
          `;
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

function mapProductRow(row: ProductRow): StorefrontProductRecord {
  return {
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
  };
}

function getFallbackStorefrontProductRecords() {
  const timestamp = new Date().toISOString();

  return getProducts(defaultLocale).map((product) => {
    const normalized = normalizeStorefrontProductInput({
      accent: product.accent,
      badge: product.badge,
      category: product.category,
      description: product.description,
      format: product.format,
      id: product.id,
      inventoryCount:
        typeof product.inventoryCount === "number" ? product.inventoryCount : 24,
      isActive: product.isActive !== false,
      name: product.name,
      packaging: product.packaging ?? product.format,
      pricePi: product.pricePi,
      slug: product.slug,
      sourceProductId: product.id,
      tagline: product.tagline,
      weightUnit: product.weightUnit ?? "g",
      weightValue: product.weightValue ?? null,
    });

    return {
      ...normalized,
      createdAt: timestamp,
      updatedAt: timestamp,
    } satisfies StorefrontProductRecord;
  });
}

async function ensureDefaultStorefrontProductsSeeded() {
  if (!(await ensureStorefrontSchema())) {
    return false;
  }

  if (!globalThis.__mushroomStorefrontProductSeedPromise) {
    const sql = getSql();

    if (!sql) {
      return false;
    }

    const seedProducts = getProducts(defaultLocale).map((product) =>
      normalizeStorefrontProductInput({
        accent: product.accent,
        badge: product.badge,
        category: product.category,
        description: product.description,
        format: product.format,
        id: product.id,
        inventoryCount:
          typeof product.inventoryCount === "number" ? product.inventoryCount : 24,
        isActive: product.isActive !== false,
        name: product.name,
        packaging: product.packaging ?? product.format,
        pricePi: product.pricePi,
        slug: product.slug,
        sourceProductId: product.id,
        tagline: product.tagline,
        weightUnit: product.weightUnit ?? "g",
        weightValue: product.weightValue ?? null,
      }),
    );

    globalThis.__mushroomStorefrontProductSeedPromise = withStorefrontTimeout(
      (async () => {
        if (await hasStorefrontSeedProducts(sql)) {
          return true;
        }

        await sql.begin(async (transaction) => {
          for (const product of seedProducts) {
            await transaction`
              insert into storefront_products (
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
                created_at,
                updated_at
              )
              values (
                ${product.id},
                ${product.sourceProductId},
                ${product.slug},
                ${product.name},
                ${product.tagline},
                ${product.description},
                ${product.category},
                ${product.format},
                ${product.pricePi},
                ${product.badge},
                ${product.accent},
                ${product.packaging},
                ${product.weightValue},
                ${product.weightUnit},
                ${product.inventoryCount},
                ${product.isActive},
                now(),
                now()
              )
              on conflict (id) do nothing
            `;
          }
        });

        return true;
      })(),
      "Storefront product seed",
    );
  }

  try {
    await globalThis.__mushroomStorefrontProductSeedPromise;
    return true;
  } catch {
    globalThis.__mushroomStorefrontProductSeedPromise = undefined;
    return false;
  }
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
        status_updated_at,
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
        ${order.statusUpdatedAt ?? null},
        ${order.statusUpdatedBy ?? null},
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
        status_updated_at = excluded.status_updated_at,
        status_updated_by = excluded.status_updated_by,
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
    return false;
  }

  const rows = await sql<{ username_key: string }[]>`
    select username_key
    from storefront_staff_members
    where username_key in ${sql(identityKeys)}
      and is_active = true
    limit 1
  `;

  return rows.length > 0;
}

export async function getStorefrontAdminAccess(
  user: PiVerifiedUser | null,
): Promise<StorefrontAdminAccess> {
  if (!user?.username && !user?.uid) {
    return buildStorefrontAdminAccess(null, false);
  }

  const resolvedUser = await hydrateStorefrontUserIdentity(user);

  if (isStorefrontOwner(resolvedUser)) {
    return buildStorefrontAdminAccess(resolvedUser, false);
  }

  if (!(await ensureStorefrontSchema())) {
    return buildStorefrontAdminAccess(resolvedUser, false);
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
        created_at::text
      from storefront_staff_members
      where is_active = true
      order by created_at desc
    `;

    return rows.map((row) => ({
      addedAt: row.created_at,
      addedBy: row.added_by,
      identity: row.display_identity,
      identityKey: row.identity_key,
    }));
  } catch {
    return [] as StorefrontStaffMember[];
  }
}

export async function addStorefrontStaffMember(
  owner: PiVerifiedUser,
  identity: string,
) {
  if (!(await ensureStorefrontSchema())) {
    throw new Error("Database is not configured.");
  }

  const identityKey = normalizeUsernameKey(identity);
  const displayIdentity = identity.trim();

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
      created_at,
      updated_at,
      is_active
    )
    values (
      ${identityKey},
      ${displayIdentity},
      ${owner.username ?? owner.uid},
      now(),
      now(),
      true
    )
    on conflict (username_key) do update
    set
      display_username = excluded.display_username,
      added_by = excluded.added_by,
      updated_at = now(),
      is_active = true
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
    delete from storefront_staff_members
    where username_key = ${usernameKey}
  `;

  return listStorefrontStaffMembers();
}

export async function listStorefrontProductRecords() {
  const sql = getSql();

  if (!sql) {
    return getFallbackStorefrontProductRecords();
  }

  try {
    const rows = await sql<ProductRow[]>`
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
    `;

    return rows.map(mapProductRow);
  } catch {
    return getFallbackStorefrontProductRecords();
  }
}

export async function listStorefrontActiveProductRecords() {
  return (await listStorefrontProductRecords()).filter((product) => product.isActive);
}

export async function saveStorefrontProduct(input: Partial<StorefrontProductInput>) {
  if (!(await ensureDefaultStorefrontProductsSeeded())) {
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
      created_at,
      updated_at
    )
    values (
      ${product.id},
      ${product.sourceProductId},
      ${product.slug},
      ${product.name},
      ${product.tagline},
      ${product.description},
      ${product.category},
      ${product.format},
      ${product.pricePi},
      ${product.badge},
      ${product.accent},
      ${product.packaging},
      ${product.weightValue},
      ${product.weightUnit},
      ${product.inventoryCount},
      ${product.isActive},
      now(),
      now()
    )
    on conflict (id) do update
    set
      source_product_id = excluded.source_product_id,
      slug = excluded.slug,
      name = excluded.name,
      tagline = excluded.tagline,
      description = excluded.description,
      category = excluded.category,
      format = excluded.format,
      price_pi = excluded.price_pi,
      badge = excluded.badge,
      accent = excluded.accent,
      packaging = excluded.packaging,
      weight_value = excluded.weight_value,
      weight_unit = excluded.weight_unit,
      inventory_count = excluded.inventory_count,
      is_active = excluded.is_active,
      updated_at = now()
    returning
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
  `;

  return mapProductRow(rows[0]);
}

export async function listStorefrontOrdersForAdmin() {
  return readAllStorefrontOrders();
}

export async function updateStorefrontOrderStatus(
  orderId: string,
  status: OrderStatus,
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
      fulfillment_status = ${status},
      status_updated_at = now(),
      status_updated_by = ${actorUsername}
    where id = ${orderId}
    returning
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
