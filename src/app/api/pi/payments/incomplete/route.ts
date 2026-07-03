import { NextResponse } from "next/server";
import {
  PiApiError,
  reconcileIncompletePiPayment,
} from "@/lib/pi-server";
import type { PiPaymentDto } from "@/lib/pi-types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { payment?: PiPaymentDto };

    if (!body.payment) {
      return NextResponse.json(
        {
          error: "Missing payment payload.",
        },
        { status: 400 },
      );
    }

    const result = await reconcileIncompletePiPayment(body.payment);

    return NextResponse.json({
      ok: true,
      ...result,
    });
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
        error: "Unexpected Pi incomplete-payment error.",
      },
      { status: 500 },
    );
  }
}
