"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStorefront, type StorefrontAddress } from "@/components/storefront-provider";
import type { Product } from "@/lib/pi-types";
import type { PiCheckoutCopy } from "@/lib/public-site-copy";
import type { StorefrontCopy } from "@/lib/storefront-copy";
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
    recordOrder,
    sdkReady,
    signInWithPi,
    viewer,
  } = useStorefront();
  const [message, setMessage] = useState<MessageState>(null);
  const [paymentBusy, setPaymentBusy] = useState(false);

  const totalPi = Number(
    lines.reduce((sum, line) => sum + line.lineTotalPi, 0).toFixed(4),
  );
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);

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

    setPaymentBusy(true);
    setMessage(null);

    window.Pi.createPayment(
      {
        amount: totalPi,
        memo: `Mushroom.Pi cart order (${totalItems} items)`,
        metadata: {
          lineCount: lines.length,
          itemCount: totalItems,
          productId: "mushroom-cart",
          productName: "Mushroom.Pi Cart",
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
          } catch (error) {
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

            recordOrder({
              paymentId,
              productId: lines.length === 1 ? lines[0].product.id : "mushroom-cart",
              productName:
                lines.length === 1 ? lines[0].product.name : "Mushroom.Pi Cart",
              quantity: totalItems,
              totalPi,
              txid,
              username: viewer.username,
              items: lines.map((line) => ({
                productId: line.product.id,
                productName: line.product.name,
                quantity: line.quantity,
                totalPi: line.lineTotalPi,
              })),
              shippingAddress: {
                fullName: selectedAddress.fullName,
                phone: selectedAddress.phone,
                line1: selectedAddress.line1,
                line2: selectedAddress.line2,
                ward: selectedAddress.ward,
                district: selectedAddress.district,
                city: selectedAddress.city,
                country: selectedAddress.country,
                note: selectedAddress.note,
              },
            });

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
          }
        },
        onCancel: (paymentId) => {
          setPaymentBusy(false);
          setMessage({
            kind: "error",
            text: `[${paymentId}] ${piCopy.cancelled}`,
          });
        },
        onError: (error) => {
          setPaymentBusy(false);
          setMessage({
            kind: "error",
            text: `${piCopy.paymentError}: ${error.message}`,
          });
        },
      },
    );
  };

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <div>
          <p className={styles.eyebrow}>{copy.checkoutTitle}</p>
          <h2>{copy.cartSummaryTitle}</h2>
        </div>
      </div>

      <div className={styles.summaryBlock}>
        <div className={styles.summaryRow}>
          <span>{copy.total}</span>
          <strong>{totalPi} Pi</strong>
        </div>
        <div className={styles.summaryMeta}>
          {lines.length} {copy.linesLabel} / {totalItems} {copy.itemsLabel}
        </div>
      </div>

      <p className={styles.lead}>{copy.checkoutLead}</p>

      {viewer ? (
        <div className={styles.viewerCard}>
          <span>{copy.checkoutSignedInAs}</span>
          <strong>{viewer.username ?? viewer.uid}</strong>
        </div>
      ) : null}

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

      <p className={styles.hint}>{copy.checkoutHint}</p>
    </section>
  );
}
