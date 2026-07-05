"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStorefront, type StorefrontAddress } from "@/components/storefront-provider";
import type { OrderStatus } from "@/lib/order-status";
import type { Product } from "@/lib/pi-types";
import type { PiCheckoutCopy } from "@/lib/public-site-copy";
import type { StorefrontCopy } from "@/lib/storefront-copy";
import type {
  StorefrontLocationVerification,
  StorefrontOrder,
} from "@/lib/storefront-state";
import { PiNetworkIcon } from "./brand-icons";
import styles from "./cart-checkout-card.module.css";

type CheckoutLine = {
  lineTotalPi: number;
  product: Product;
  quantity: number;
};

type CartCheckoutCardProps = {
  copy: StorefrontCopy;
  hasInventoryIssue?: boolean;
  lines: CheckoutLine[];
  selectedAddress: StorefrontAddress | null;
  serverConfigured: boolean;
  piCopy: PiCheckoutCopy;
};

type MessageState =
  | { kind: "success"; text: string }
  | { kind: "error"; text: string }
  | null;

type AddressLocationVerification = StorefrontLocationVerification & {
  addressId: string;
};

type ReverseGeocodeResponse = {
  countryCode?: string;
  countryName?: string;
};

const COUNTRY_CODE_BY_NAME: Record<string, string> = {
  america: "US",
  canada: "CA",
  france: "FR",
  "hong kong": "HK",
  japan: "JP",
  "south korea": "KR",
  thailand: "TH",
  uk: "GB",
  "united kingdom": "GB",
  "united states": "US",
  us: "US",
  usa: "US",
  "viet nam": "VN",
  vietnam: "VN",
  vn: "VN",
};

function normalizeCountryText(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveCountryCode(value: string | null | undefined) {
  const normalizedValue = normalizeCountryText(value);

  if (/^[a-z]{2}$/i.test((value ?? "").trim())) {
    return (value ?? "").trim().toUpperCase();
  }

  return COUNTRY_CODE_BY_NAME[normalizedValue] ?? "";
}

function countriesMatch(
  addressCountry: string,
  gpsCountryCode: string | undefined,
  gpsCountryName: string | undefined,
) {
  const addressCode = resolveCountryCode(addressCountry);
  const normalizedAddress = normalizeCountryText(addressCountry);
  const normalizedGpsCountry = normalizeCountryText(gpsCountryName);

  if (addressCode && gpsCountryCode) {
    return addressCode === gpsCountryCode.trim().toUpperCase();
  }

  return Boolean(
    normalizedAddress &&
      normalizedGpsCountry &&
      (normalizedAddress === normalizedGpsCountry ||
        normalizedGpsCountry.includes(normalizedAddress) ||
        normalizedAddress.includes(normalizedGpsCountry)),
  );
}

function getCurrentGpsPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 60_000,
      timeout: 12_000,
    });
  });
}

async function reverseGeocodeCountry(latitude: number, longitude: number) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&localityLanguage=en`,
      {
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error("Reverse geocoding failed.");
    }

    return (await response.json()) as ReverseGeocodeResponse;
  } finally {
    window.clearTimeout(timer);
  }
}

async function postJson<T>(
  path: string,
  payload: Record<string, unknown>,
  fallbackError: string,
) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : fallbackError,
    );
  }

  return data;
}

function createOrderCode() {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const timePart = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `MP-${datePart}-${timePart}-${randomPart}`;
}

function orderMatchesCheckoutLines(order: StorefrontOrder, lines: CheckoutLine[]) {
  if (!order.items || order.items.length !== lines.length) {
    return false;
  }

  return lines.every((line) =>
    order.items?.some(
      (item) =>
        item.productId === line.product.id &&
        item.quantity === line.quantity &&
        Number(item.totalPi.toFixed(4)) === Number(line.lineTotalPi.toFixed(4)),
    ),
  );
}

export function CartCheckoutCard({
  copy,
  hasInventoryIssue = false,
  lines,
  selectedAddress,
  serverConfigured,
  piCopy,
}: CartCheckoutCardProps) {
  const router = useRouter();
  const {
    authBusy,
    authError,
    clearCart,
    orders,
    recordOrder,
    sdkReady,
    signInWithPi,
    viewer,
  } = useStorefront();
  const [message, setMessage] = useState<MessageState>(null);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [locationBusy, setLocationBusy] = useState(false);
  const [locationVerification, setLocationVerification] =
    useState<AddressLocationVerification | null>(null);

  const totalPi = Number(
    lines.reduce((sum, line) => sum + line.lineTotalPi, 0).toFixed(4),
  );
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
  const activeLocationVerification =
    locationVerification?.addressId === selectedAddress?.id
      ? locationVerification
      : null;
  const locationMatched = activeLocationVerification?.status === "matched";

  const authenticate = async () => {
    if (!sdkReady) {
      setMessage({
        kind: "error",
        text: piCopy.sdkNotReady,
      });
      return;
    }

    setMessage(null);

    try {
      const verified = await signInWithPi();

      if (!verified) {
        setMessage({
          kind: "error",
          text: authError ?? piCopy.authFailed,
        });
        return;
      }

      setMessage({
        kind: "success",
        text: `${piCopy.authSuccessPrefix} ${verified.username ?? verified.uid}.`,
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : piCopy.authFailed,
      });
    }
  };

  const handleCheckout = () => {
    if (!window.Pi) {
      setMessage({
        kind: "error",
        text: piCopy.sdkUnavailable,
      });
      return;
    }

    if (!viewer) {
      setMessage({
        kind: "error",
        text: piCopy.authRequired,
      });
      return;
    }

    if (!selectedAddress) {
      setMessage({
        kind: "error",
        text: copy.addressRequired,
      });
      return;
    }

    if (!activeLocationVerification) {
      setMessage({
        kind: "error",
        text: copy.locationRequired,
      });
      return;
    }

    if (!locationMatched) {
      setMessage({
        kind: "error",
        text: copy.locationMismatch,
      });
      return;
    }

    if (hasInventoryIssue) {
      setMessage({
        kind: "error",
        text: copy.inventoryIssue,
      });
      return;
    }

    if (!serverConfigured) {
      setMessage({
        kind: "error",
        text: piCopy.missingServerKey,
      });
      return;
    }

    const reusableOrder = orders.find((order) => {
      const status = order.status;

      return (
        (status === "pending_payment" || status === "payment_failed") &&
        Number(order.totalPi.toFixed(4)) === totalPi &&
        order.quantity === totalItems &&
        orderMatchesCheckoutLines(order, lines)
      );
    });
    const orderCode = reusableOrder?.id ?? createOrderCode();
    const frozenLines = lines.map((line) => ({
      productId: line.product.id,
      productName: line.product.name,
      quantity: line.quantity,
      totalPi: line.lineTotalPi,
    }));
    const frozenAddress = selectedAddress;
    const frozenLocationVerification = activeLocationVerification;
    const baseOrder = {
      id: orderCode,
      productId: lines.length === 1 ? lines[0].product.id : "mushroom-cart",
      productName:
        reusableOrder?.productName ??
        (lines.length === 1 ? lines[0].product.name : `Mushroom.Pi ${orderCode}`),
      quantity: totalItems,
      totalPi,
      createdAt: reusableOrder?.createdAt,
      username: viewer.username,
      shopperUid: viewer.uid,
      items: frozenLines,
      locationVerification: frozenLocationVerification,
      shippingAddress: {
        fullName: frozenAddress.fullName,
        phone: frozenAddress.phone,
        line1: frozenAddress.line1,
        line2: frozenAddress.line2,
        ward: frozenAddress.ward,
        district: frozenAddress.district,
        city: frozenAddress.city,
        country: frozenAddress.country,
        note: frozenAddress.note,
      },
    };
    const recordOrderStatus = (
      status: OrderStatus,
      paymentId?: string,
      txid?: string,
    ) => {
      recordOrder({
        ...baseOrder,
        paymentId,
        status,
        statusUpdatedAt: new Date().toISOString(),
        statusUpdatedBy: "Pi Network Testnet",
        txid,
      });
    };

    recordOrderStatus("pending_payment");
    setPaymentBusy(true);
    setMessage(null);

    window.Pi.createPayment(
      {
        amount: totalPi,
        memo: orderCode,
        metadata: {
          lineCount: lines.length,
          itemCount: totalItems,
          orderCode,
          orderId: orderCode,
          productId: "mushroom-cart",
          productName: `Mushroom.Pi ${orderCode}`,
          surface: "mushroom-pi-cart",
          testMode: true,
        },
      },
      {
        onReadyForServerApproval: async (paymentId) => {
          try {
            await postJson(
              "/api/pi/payments/approve",
              { paymentId },
              piCopy.approvalFailed,
            );
            recordOrderStatus("pending_payment", paymentId);
          } catch (error) {
            recordOrderStatus("payment_failed", paymentId);
            setPaymentBusy(false);
            setMessage({
              kind: "error",
              text: error instanceof Error ? error.message : piCopy.approvalFailed,
            });
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          try {
            await postJson(
              "/api/pi/payments/complete",
              { paymentId, txid },
              piCopy.completionFailed,
            );

            recordOrderStatus("paid", paymentId, txid);

            clearCart();
            setPaymentBusy(false);
            setMessage({
              kind: "success",
              text: copy.paymentSuccess,
            });
            router.push("/orders");
          } catch (error) {
            setPaymentBusy(false);
            setMessage({
              kind: "error",
              text: error instanceof Error ? error.message : piCopy.completionFailed,
            });
            recordOrderStatus("payment_failed", paymentId);
          }
        },
        onCancel: (paymentId) => {
          recordOrderStatus("payment_failed", paymentId);
          setPaymentBusy(false);
          setMessage({
            kind: "error",
            text: `[${paymentId}] ${piCopy.cancelled}`,
          });
        },
        onError: (error) => {
          recordOrderStatus("payment_failed");
          setPaymentBusy(false);
          setMessage({
            kind: "error",
            text: `${piCopy.paymentError}: ${error.message}`,
          });
        },
      },
    );
  };

  const handleVerifyLocation = async () => {
    if (!selectedAddress) {
      setMessage({
        kind: "error",
        text: copy.addressRequired,
      });
      return;
    }

    if (!("geolocation" in navigator)) {
      setMessage({
        kind: "error",
        text: copy.locationUnavailable,
      });
      setLocationVerification({
        addressId: selectedAddress.id,
        addressCountry: selectedAddress.country,
        checkedAt: new Date().toISOString(),
        message: copy.locationUnavailable,
        status: "unverified",
      });
      return;
    }

    setLocationBusy(true);
    setMessage(null);

    try {
      const position = await getCurrentGpsPosition();
      const country = await reverseGeocodeCountry(
        position.coords.latitude,
        position.coords.longitude,
      );
      const matched = countriesMatch(
        selectedAddress.country,
        country.countryCode,
        country.countryName,
      );
      const nextVerification: AddressLocationVerification = {
        accuracyMeters: Math.round(position.coords.accuracy),
        addressId: selectedAddress.id,
        addressCountry: selectedAddress.country,
        checkedAt: new Date().toISOString(),
        countryCode: country.countryCode?.trim().toUpperCase() || undefined,
        countryName: country.countryName?.trim() || undefined,
        latitude: Number(position.coords.latitude.toFixed(6)),
        longitude: Number(position.coords.longitude.toFixed(6)),
        message: matched ? copy.locationVerified : copy.locationMismatch,
        status: matched ? "matched" : "mismatch",
      };

      setLocationVerification(nextVerification);
      setMessage({
        kind: matched ? "success" : "error",
        text: nextVerification.message ?? copy.locationGeocodeFailed,
      });
    } catch (error) {
      const permissionDenied =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 1;
      const text = permissionDenied
        ? copy.locationPermissionDenied
        : copy.locationGeocodeFailed;

      setLocationVerification({
        addressId: selectedAddress.id,
        addressCountry: selectedAddress.country,
        checkedAt: new Date().toISOString(),
        message: text,
        status: "unverified",
      });
      setMessage({
        kind: "error",
        text,
      });
    } finally {
      setLocationBusy(false);
    }
  };

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <div>
          <p className={styles.eyebrow}>{copy.checkoutTitle}</p>
        </div>
      </div>

      <div className={styles.summaryBlock}>
        <div className={styles.summaryRow}>
          <span>{copy.total}</span>
          <strong>{totalPi} Pi</strong>
        </div>
      </div>

      {selectedAddress ? (
        <div className={styles.addressCard}>
          <span>{copy.deliverTo}</span>
          <strong>{selectedAddress.fullName}</strong>
          <p>
            {selectedAddress.phone} | {selectedAddress.line1}
            {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}
            {`, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}, ${selectedAddress.country}`}
          </p>
        </div>
      ) : (
        <div className={styles.notice}>{copy.addressRequired}</div>
      )}

      <div
        className={styles.locationCard}
        data-status={activeLocationVerification?.status ?? "idle"}
      >
        <div>
          <span>{copy.locationVerifyTitle}</span>
          <strong>
            {activeLocationVerification?.status === "matched"
              ? copy.locationVerified
              : activeLocationVerification?.status === "mismatch"
                ? copy.locationMismatch
                : copy.locationRequired}
          </strong>
          {activeLocationVerification ? (
            <p>
              {activeLocationVerification.countryName ?? "--"}
              {activeLocationVerification.countryCode
                ? ` (${activeLocationVerification.countryCode})`
                : ""}{" "}
              | {copy.country}: {activeLocationVerification.addressCountry}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          className={styles.secondaryButton}
          disabled={locationBusy || !selectedAddress}
          onClick={() => {
            void handleVerifyLocation();
          }}
        >
          {locationBusy ? copy.locationVerifying : copy.locationVerifyButton}
        </button>
      </div>

      {hasInventoryIssue ? (
        <div className={styles.notice}>{copy.inventoryIssue}</div>
      ) : null}

      {message ? (
        <div
          className={styles.message}
          data-kind={message.kind}
        >
          {message.text}
        </div>
      ) : null}

      <div className={styles.actions}>
        {!viewer ? (
          <button
            type="button"
            className={styles.secondaryButton}
            disabled={!sdkReady || authBusy}
            onClick={() => {
              void authenticate();
            }}
          >
            {authBusy ? piCopy.connectBusy : copy.signInToCheckout}
          </button>
        ) : null}

        <button
          type="button"
          className={styles.primaryButton}
          disabled={
            !sdkReady ||
            paymentBusy ||
            hasInventoryIssue ||
            !locationMatched ||
            !viewer ||
            !selectedAddress ||
            !serverConfigured ||
            lines.length === 0
          }
          onClick={handleCheckout}
        >
          <PiNetworkIcon className={styles.buttonIcon} />
          {paymentBusy ? copy.placingOrder : copy.placeOrder}
        </button>
      </div>
    </section>
  );
}
