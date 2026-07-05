import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { StorefrontProductInput } from "@/lib/storefront-product";
import {
  listStorefrontProductRecords,
  saveStorefrontProduct,
} from "@/lib/storefront-db";
import { STOREFRONT_PRODUCT_RECORDS_TAG } from "@/lib/storefront-catalog";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

export const preferredRegion = "sin1";

function forbiddenResponse() {
  return NextResponse.json(
    {
      error: "Admin session is required to manage products.",
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
    items: access.canManageProducts ? await listStorefrontProductRecords() : [],
  });
}

export async function POST(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageProducts) {
    return forbiddenResponse();
  }

  try {
    const body = (await request.json()) as Partial<StorefrontProductInput>;
    const item = await saveStorefrontProduct(body);

    revalidateTag(STOREFRONT_PRODUCT_RECORDS_TAG, "max");
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/cart");
    revalidatePath("/admin");

    return NextResponse.json({
      item,
      items: await listStorefrontProductRecords(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save product right now.",
      },
      { status: 500 },
    );
  }
}
