import { NextResponse } from "next/server";
import { getStorefrontSessionUser } from "@/lib/storefront-session";
import {
  persistStorefrontAddresses,
  persistStorefrontCart,
  persistStorefrontOrder,
  syncStorefrontSession,
} from "@/lib/storefront-db";
import {
  createStorefrontOrder,
  isStorefrontAddress,
  isStorefrontCartItem,
  isStorefrontOrder,
  normalizeStorefrontState,
  type StorefrontAddress,
  type StorefrontCartItem,
  type StorefrontOrder,
} from "@/lib/storefront-state";

type SyncSessionRequest = {
  action: "syncSession";
  cartItems?: StorefrontCartItem[];
  addresses?: StorefrontAddress[];
  orders?: StorefrontOrder[];
};

type SetCartRequest = {
  action: "setCart";
  cartItems?: StorefrontCartItem[];
};

type SetAddressesRequest = {
  action: "setAddresses";
  addresses?: StorefrontAddress[];
};

type RecordOrderRequest = {
  action: "recordOrder";
  order?: StorefrontOrder;
};

type StorefrontRequestBody =
  | SyncSessionRequest
  | SetCartRequest
  | SetAddressesRequest
  | RecordOrderRequest;

function unauthorizedResponse() {
  return NextResponse.json(
    {
      error: "Pi sign-in is required for storefront sync.",
    },
    { status: 401 },
  );
}

function badRequestResponse(message: string) {
  return NextResponse.json(
    {
      error: message,
    },
    { status: 400 },
  );
}

function isCartItemsPayload(value: unknown): value is StorefrontCartItem[] {
  return Array.isArray(value) && value.every(isStorefrontCartItem);
}

function isAddressesPayload(value: unknown): value is StorefrontAddress[] {
  return Array.isArray(value) && value.every(isStorefrontAddress);
}

export async function POST(request: Request) {
  const sessionUser = await getStorefrontSessionUser();

  if (!sessionUser) {
    return unauthorizedResponse();
  }

  try {
    const body = (await request.json()) as StorefrontRequestBody;

    switch (body.action) {
      case "syncSession": {
        if (
          (body.cartItems !== undefined && !isCartItemsPayload(body.cartItems)) ||
          (body.addresses !== undefined && !isAddressesPayload(body.addresses)) ||
          (body.orders !== undefined &&
            (!Array.isArray(body.orders) || !body.orders.every(isStorefrontOrder)))
        ) {
          return badRequestResponse("Invalid storefront sync payload.");
        }

        const state = normalizeStorefrontState({
          cartItems: body.cartItems,
          addresses: body.addresses,
          orders: body.orders,
        });

        const response = await syncStorefrontSession(sessionUser, state);

        return NextResponse.json(response);
      }

      case "setCart": {
        if (!isCartItemsPayload(body.cartItems)) {
          return badRequestResponse("Invalid cart payload.");
        }

        const response = await persistStorefrontCart(
          sessionUser,
          body.cartItems,
        );

        return NextResponse.json({
          ok: true,
          ...response,
        });
      }

      case "setAddresses": {
        if (!isAddressesPayload(body.addresses)) {
          return badRequestResponse("Invalid address payload.");
        }

        const response = await persistStorefrontAddresses(
          sessionUser,
          body.addresses,
        );

        return NextResponse.json({
          ok: true,
          ...response,
        });
      }

      case "recordOrder": {
        if (!body.order || !isStorefrontOrder(body.order)) {
          return badRequestResponse("Invalid order payload.");
        }

        const response = await persistStorefrontOrder(
          sessionUser,
          createStorefrontOrder(body.order),
        );

        return NextResponse.json({
          ok: true,
          ...response,
        });
      }

      default:
        return badRequestResponse("Unsupported storefront action.");
    }
  } catch {
    return NextResponse.json(
      {
        error: "Unexpected storefront sync error.",
      },
      { status: 500 },
    );
  }
}
