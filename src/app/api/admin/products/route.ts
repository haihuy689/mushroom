import { NextResponse } from "next/server";
import type { StorefrontProductInput } from "@/lib/storefront-product";
import {
  listStorefrontProductRecords,
  saveStorefrontProduct,
} from "@/lib/storefront-db";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

function forbiddenResponse() {
  return NextResponse.json(
    {
      error: "Only the owner can manage products.",
    },
    { status: 403 },
  );
}

export async function GET() {
  const { access } = await getStorefrontAdminContext();

  if (!access.canAccessAdmin) {
    return forbiddenResponse();
  }

  return NextResponse.json({
    items: access.canManageStaff ? await listStorefrontProductRecords() : [],
  });
}

export async function POST(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageStaff) {
    return forbiddenResponse();
  }

  const body = (await request.json()) as Partial<StorefrontProductInput>;

  return NextResponse.json({
    item: await saveStorefrontProduct(body),
    items: await listStorefrontProductRecords(),
  });
}
