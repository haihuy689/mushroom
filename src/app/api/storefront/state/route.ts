import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { PiApiError, verifyPiUser } from "@/lib/pi-server";
import type { PiAuthUser, PiVerifiedUser } from "@/lib/pi-types";
import {
  applyStorefrontSession,
  getStorefrontSessionUser,
} from "@/lib/storefront-session";
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
import { STOREFRONT_PRODUCT_RECORDS_TAG } from "@/lib/storefront-catalog";

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
  (
    | SyncSessionRequest
    | SetCartRequest
    | SetAddressesRequest
    | RecordOrderRequest
  ) & {
    accessToken?: string;
    user?: PiAuthUser;
  };

type ResolvedStorefrontUser = {
  fromAccessToken: boolean;
  user: PiVerifiedUser;
};

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

function mergePiIdentity(
  verifiedUser: PiVerifiedUser,
  fallbackUser?: PiAuthUser,
): PiVerifiedUser {
  if (!fallbackUser?.uid || fallbackUser.uid !== verifiedUser.uid) {
    return verifiedUser;
  }

  return {
    ...verifiedUser,
    username: fallbackUser.username ?? verifiedUser.username,
    wallet_address: fallbackUser.wallet_address ?? verifiedUser.wallet_address,
  };
}

async function resolveStorefrontUser(
  body: StorefrontRequestBody,
): Promise<ResolvedStorefrontUser | null> {
  const sessionUser = await getStorefrontSessionUser();

  if (sessionUser) {
    return {
      fromAccessToken: false,
      user: sessionUser,
    };
  }

  if (!body.accessToken) {
    return null;
  }

  return {
    fromAccessToken: true,
    user: mergePiIdentity(await verifyPiUser(body.accessToken), body.user),
  };
}

function storefrontJson(
  payload: Record<string, unknown>,
  resolvedUser: ResolvedStorefrontUser,
) {
  const response = NextResponse.json(payload);

  if (!resolvedUser.fromAccessToken) {
    return response;
  }

  return applyStorefrontSession(response, resolvedUser.user);
}

function isCartItemsPayload(value: unknown): value is StorefrontCartItem[] {
  return Array.isArray(value) && value.every(isStorefrontCartItem);
}

function isAddressesPayload(value: unknown): value is StorefrontAddress[] {
  return Array.isArray(value) && value.every(isStorefrontAddress);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StorefrontRequestBody;
    const resolvedUser = await resolveStorefrontUser(body);

    if (!resolvedUser) {
      return unauthorizedResponse();
    }

    const sessionUser = resolvedUser.user;

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

        return storefrontJson(response, resolvedUser);
      }

      case "setCart": {
        if (!isCartItemsPayload(body.cartItems)) {
          return badRequestResponse("Invalid cart payload.");
        }

        const response = await persistStorefrontCart(
          sessionUser,
          body.cartItems,
        );

        return storefrontJson(
          {
            ok: true,
            ...response,
          },
          resolvedUser,
        );
      }

      case "setAddresses": {
        if (!isAddressesPayload(body.addresses)) {
          return badRequestResponse("Invalid address payload.");
        }

        const response = await persistStorefrontAddresses(
          sessionUser,
          body.addresses,
        );

        return storefrontJson(
          {
            ok: true,
            ...response,
          },
          resolvedUser,
        );
      }

      case "recordOrder": {
        if (!body.order || !isStorefrontOrder(body.order)) {
          return badRequestResponse("Invalid order payload.");
        }

        const response = await persistStorefrontOrder(
          sessionUser,
          createStorefrontOrder(body.order),
        );

        if (!response.databaseConfigured) {
          return NextResponse.json(
            {
              error: "Database is not configured.",
            },
            { status: 503 },
          );
        }

        revalidateTag(STOREFRONT_PRODUCT_RECORDS_TAG, "max");
        revalidatePath("/");
        revalidatePath("/shop");

        return storefrontJson(
          {
            ok: true,
            ...response,
          },
          resolvedUser,
        );
      }

      default:
        return badRequestResponse("Unsupported storefront action.");
    }
  } catch (error) {
    if (error instanceof PiApiError) {
      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        error: "Unexpected storefront sync error.",
      },
      { status: 500 },
    );
  }
}
