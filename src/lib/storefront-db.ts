import "server-only";

import type { PiVerifiedUser } from "@/lib/pi-types";
import { getSql, isDatabaseConfigured } from "@/lib/db";
import {
  emptyStorefrontState,
  mergeStorefrontState,
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

declare global {
  var __mushroomStorefrontSchemaPromise: Promise<void> | undefined;
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

    globalThis.__mushroomStorefrontSchemaPromise = (async () => {
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
      });
    })();
  }

  try {
    await globalThis.__mushroomStorefrontSchemaPromise;
    return true;
  } catch (error) {
    globalThis.__mushroomStorefrontSchemaPromise = undefined;
    throw error;
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
      username = excluded.username,
      wallet_address = excluded.wallet_address,
      scopes = excluded.scopes,
      updated_at = now()
  `;
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
        product_id,
        product_name,
        quantity,
        total_pi,
        created_at::text,
        txid,
        payment_id,
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
    orders: orderRows.map((row) => ({
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      totalPi: Number(row.total_pi),
      createdAt: row.created_at,
      txid: row.txid ?? undefined,
      paymentId: row.payment_id ?? undefined,
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
