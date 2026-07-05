import { NextResponse } from "next/server";
import {
  isProductMediaKind,
  uploadProductMediaFile,
  validateProductMediaFile,
} from "@/lib/media-storage";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

export const preferredRegion = "sin1";
export const runtime = "nodejs";

function forbiddenResponse() {
  return NextResponse.json(
    {
      error: "Admin session is required to upload product media.",
    },
    { status: 403 },
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

export async function POST(request: Request) {
  const { access } = await getStorefrontAdminContext();

  if (!access.canManageProducts) {
    return forbiddenResponse();
  }

  try {
    const formData = await request.formData();
    const kind = formData.get("kind");
    const file = formData.get("file");

    if (!isProductMediaKind(kind)) {
      return badRequestResponse("Invalid media type.");
    }

    if (!(file instanceof File)) {
      return badRequestResponse("Please choose a file to upload.");
    }

    try {
      validateProductMediaFile(file, kind);
    } catch (error) {
      return badRequestResponse(
        error instanceof Error ? error.message : "Invalid product media file.",
      );
    }

    const media = await uploadProductMediaFile(file, kind);

    return NextResponse.json({
      item: media,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to upload product media.",
      },
      { status: 500 },
    );
  }
}
