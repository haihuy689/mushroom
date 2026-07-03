import { NextResponse } from "next/server";
import { PiApiError, completePiPayment } from "@/lib/pi-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      paymentId?: string;
      txid?: string;
    };

    if (!body.paymentId || !body.txid) {
      return NextResponse.json(
        {
          error: "Missing paymentId or txid.",
        },
        { status: 400 },
      );
    }

    const payment = await completePiPayment(body.paymentId, body.txid);

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
        error: "Unexpected Pi completion error.",
      },
      { status: 500 },
    );
  }
}
