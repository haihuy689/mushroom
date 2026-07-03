import { NextResponse } from "next/server";
import { PiApiError, cancelPiPayment } from "@/lib/pi-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { paymentId?: string };

    if (!body.paymentId) {
      return NextResponse.json(
        {
          error: "Missing paymentId.",
        },
        { status: 400 },
      );
    }

    const payment = await cancelPiPayment(body.paymentId);

    return NextResponse.json({
      ok: true,
      payment,
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
        error: "Unexpected Pi cancel error.",
      },
      { status: 500 },
    );
  }
}
