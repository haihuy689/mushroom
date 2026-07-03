import type { PiPaymentDto, PiVerifiedUser } from "@/lib/pi-types";

const PI_API_BASE = "https://api.minepi.com/v2";

export class PiApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "PiApiError";
    this.status = status;
    this.details = details;
  }
}

function getPiApiKey() {
  const apiKey = process.env.PI_API_KEY;

  if (!apiKey) {
    throw new PiApiError(
      503,
      "PI_API_KEY is missing. Add the Pi Server API Key to enable payment approval and completion.",
    );
  }

  return apiKey;
}

async function parsePiResponse<T>(response: Response): Promise<T> {
  const raw = await response.text();
  let parsed: unknown = null;

  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { raw };
    }
  }

  if (!response.ok) {
    const message =
      typeof parsed === "object" &&
      parsed !== null &&
      "message" in parsed &&
      typeof parsed.message === "string"
        ? parsed.message
        : response.statusText || "Pi API request failed";

    throw new PiApiError(response.status, message, parsed);
  }

  return parsed as T;
}

async function fetchPiApi<T>(
  path: string,
  init: RequestInit,
  authorization: string,
) {
  const response = await fetch(`${PI_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  return parsePiResponse<T>(response);
}

export async function verifyPiUser(accessToken: string) {
  return fetchPiApi<PiVerifiedUser>(
    "/me",
    {
      method: "GET",
    },
    `Bearer ${accessToken}`,
  );
}

export async function approvePiPayment(paymentId: string) {
  const apiKey = getPiApiKey();

  return fetchPiApi<PiPaymentDto>(
    `/payments/${paymentId}/approve`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
    `Key ${apiKey}`,
  );
}

export async function completePiPayment(paymentId: string, txid: string) {
  const apiKey = getPiApiKey();

  return fetchPiApi<PiPaymentDto>(
    `/payments/${paymentId}/complete`,
    {
      method: "POST",
      body: JSON.stringify({ txid }),
    },
    `Key ${apiKey}`,
  );
}

export async function cancelPiPayment(paymentId: string) {
  const apiKey = getPiApiKey();

  return fetchPiApi<PiPaymentDto>(
    `/payments/${paymentId}/cancel`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
    `Key ${apiKey}`,
  );
}

export async function reconcileIncompletePiPayment(payment: PiPaymentDto) {
  if (payment.transaction?.txid) {
    const completedPayment = await completePiPayment(
      payment.identifier,
      payment.transaction.txid,
    );

    return {
      action: "completed",
      payment: completedPayment,
    };
  }

  return {
    action: "pending",
    payment,
    message:
      "The incomplete payment does not have a blockchain transaction yet, so it cannot be completed automatically.",
  };
}
