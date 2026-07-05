import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import {
  deleteStorefrontProductOption,
  listStorefrontProductOptions,
  listStorefrontProductRecords,
  renameStorefrontProductOption,
  saveStorefrontProductOption,
} from "@/lib/storefront-db";
import { STOREFRONT_PRODUCT_RECORDS_TAG } from "@/lib/storefront-catalog";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

export const preferredRegion = "sin1";

function forbiddenResponse() {
  return NextResponse.json(
    {
      error: "Admin session is required to manage product options.",
    },
    { status: 403 },
  );
}

function refreshCatalogPages() {
  revalidateTag(STOREFRONT_PRODUCT_RECORDS_TAG, "max");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/cart");
  revalidatePath("/admin");
}

export async function GET() {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageProducts) {
    return forbiddenResponse();
  }

  return NextResponse.json({
    items: await listStorefrontProductOptions(),
  });
}

export async function POST(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageProducts) {
    return forbiddenResponse();
  }

  try {
    const body = (await request.json()) as {
      group?: string;
      value?: string;
    };

    const items = await saveStorefrontProductOption(body.group, body.value);

    refreshCatalogPages();

    return NextResponse.json({
      items,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save product option right now.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageProducts) {
    return forbiddenResponse();
  }

  try {
    const body = (await request.json()) as {
      group?: string;
      nextValue?: string;
      value?: string;
    };

    const items = await renameStorefrontProductOption(
      body.group,
      body.value,
      body.nextValue,
    );

    refreshCatalogPages();

    return NextResponse.json({
      items,
      products: await listStorefrontProductRecords(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update product option right now.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageProducts) {
    return forbiddenResponse();
  }

  try {
    const body = (await request.json()) as {
      group?: string;
      value?: string;
    };

    const items = await deleteStorefrontProductOption(body.group, body.value);

    refreshCatalogPages();

    return NextResponse.json({
      items,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete product option right now.",
      },
      { status: 500 },
    );
  }
}
