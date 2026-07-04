"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { useStorefront } from "@/components/storefront-provider";
import type { SiteCopy } from "@/lib/site-data";
import type {
  Product,
} from "@/lib/pi-types";
import styles from "./pi-commerce-panel.module.css";

type CommercePanelProps = {
  products: Product[];
  serverConfigured: boolean;
  copy: SiteCopy["piPanel"];
  compact?: boolean;
  onPaymentCompleted?: (product: Product) => void;
};

type MessageState =
  | { kind: "success"; text: string }
  | { kind: "error"; text: string }
  | null;

const networkLabel =
  process.env.NEXT_PUBLIC_PI_NETWORK_LABEL?.trim() || "Pi Testnet";
const sandboxEnabled = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

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
    const errorMessage =
      typeof data.error === "string" ? data.error : fallbackError;
    throw new Error(errorMessage);
  }

  return data;
}

export function PiCommercePanel({
  products,
  serverConfigured,
  copy,
  compact = false,
  onPaymentCompleted,
}: CommercePanelProps) {
  const { authBusy, authError, recordOrder, sdkReady, signInWithPi, viewer } =
    useStorefront();
  const [purchaseBusy, setPurchaseBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageState>(null);
  const [timeline, setTimeline] = useState<string[]>([copy.initialTimeline]);

  const panelClassName = useMemo(() => {
    return compact ? `${styles.panel} ${styles.compact}` : styles.panel;
  }, [compact]);

  const appendTimeline = (entry: string) => {
    setTimeline((current) => [entry, ...current].slice(0, 6));
  };

  const authenticate = async () => {
    if (!sdkReady) {
      setMessage({
        kind: "error",
        text: copy.sdkNotReady,
      });
      return;
    }

    setMessage(null);

    try {
      const verified = await signInWithPi();
      const displayName = verified?.username ?? verified?.uid;

      if (!displayName) {
        setMessage({
          kind: "error",
          text: authError ?? copy.authFailed,
        });
        return;
      }

      const successText = `${copy.authSuccessPrefix} ${displayName}.`;

      setMessage({
        kind: "success",
        text: successText,
      });
      appendTimeline(successText);
    } catch (error) {
      setMessage({
        kind: "error",
        text: error instanceof Error ? error.message : copy.authFailed,
      });
    }
  };

  const handlePurchase = (product: Product) => {
    if (!window.Pi) {
      setMessage({
        kind: "error",
        text: copy.sdkUnavailable,
      });
      return;
    }

    if (!viewer) {
      setMessage({
        kind: "error",
        text: copy.authRequired,
      });
      return;
    }

    if (!serverConfigured) {
      setMessage({
        kind: "error",
        text: copy.missingServerKey,
      });
      return;
    }

    setPurchaseBusy(product.id);
    setMessage(null);

    window.Pi.createPayment(
      {
        amount: product.pricePi,
        memo: `Mushroom.Pi testnet order for ${product.name}`,
        metadata: {
          productId: product.id,
          productName: product.name,
          surface: "mushroom-pi-storefront",
          testMode: true,
        },
      },
      {
        onReadyForServerApproval: async (paymentId) => {
          try {
            appendTimeline(`[${paymentId}] ${copy.approvalReady}`);
            await postJson(
              "/api/pi/payments/approve",
              {
                paymentId,
                productId: product.id,
              },
              copy.approvalFailed,
            );
            appendTimeline(`[${paymentId}] ${copy.approvalDone}`);
          } catch (error) {
            setPurchaseBusy(null);
            setMessage({
              kind: "error",
              text: error instanceof Error ? error.message : copy.approvalFailed,
            });
            appendTimeline(
              error instanceof Error ? error.message : copy.approvalFailed,
            );
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          try {
            appendTimeline(
              `[${paymentId}] ${copy.completionReady} Txid: ${txid}.`,
            );

            await postJson(
              "/api/pi/payments/complete",
              {
                paymentId,
                txid,
                productId: product.id,
              },
              copy.completionFailed,
            );

            setMessage({
              kind: "success",
              text: `${product.name} ${copy.completionSuccessSuffix}`,
            });
            recordOrder({
              paymentId,
              productId: product.sourceProductId ?? product.id,
              productName: product.name,
              quantity: product.quantity ?? 1,
              totalPi: product.pricePi,
              txid,
              username: viewer?.username,
            });
            appendTimeline(`[${paymentId}] ${copy.completionDone}`);
            onPaymentCompleted?.(product);
            setPurchaseBusy(null);
          } catch (error) {
            setPurchaseBusy(null);
            setMessage({
              kind: "error",
              text: error instanceof Error ? error.message : copy.completionFailed,
            });
            appendTimeline(
              error instanceof Error ? error.message : copy.completionFailed,
            );
          }
        },
        onCancel: (paymentId) => {
          setPurchaseBusy(null);
          setMessage({
            kind: "error",
            text: `[${paymentId}] ${copy.cancelled}`,
          });
          appendTimeline(`[${paymentId}] ${copy.cancelledTimeline}`);
        },
        onError: (error, payment) => {
          setPurchaseBusy(null);
          setMessage({
            kind: "error",
            text: `${copy.paymentError}: ${error.message}`,
          });
          appendTimeline(
            payment
              ? `[${payment.identifier}] ${copy.paymentError}: ${error.message}`
              : `${copy.paymentError}: ${error.message}`,
          );
        },
      },
    );
  };

  return (
    <section className={panelClassName}>
      <div className={styles.top}>
        <div>
          <h3>{copy.title}</h3>
          <p>{copy.description}</p>
        </div>

        <div className={styles.statusPills}>
          <span className={styles.pill}>{networkLabel}</span>
          <span className={styles.pill}>
            {sandboxEnabled ? copy.sandboxEnabled : copy.browserRuntime}
          </span>
          <span className={`${styles.pill} ${styles.pillMuted}`}>
            {serverConfigured ? copy.serverConfigured : copy.serverPending}
          </span>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.connectButton}
          onClick={() => {
            void authenticate();
          }}
          disabled={!sdkReady || authBusy}
        >
          {authBusy ? copy.connectBusy : copy.connectReady}
        </button>
      </div>

      <div className={styles.hint}>{copy.hint}</div>

      {viewer ? (
        <div className={styles.userCard}>
          <span className={styles.userLabel}>{copy.verifiedViewerLabel}</span>
          <span className={styles.userName}>
            {viewer.username ?? viewer.uid}
          </span>
          <span>
            {copy.grantedScopesLabel}:{" "}
            {viewer.credentials?.scopes.join(", ") ?? copy.unknownScopes}
          </span>
        </div>
      ) : null}

      {message ? (
        <div
          className={`${styles.message} ${
            message.kind === "success" ? styles.success : styles.error
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <div className={styles.catalog}>
        {products.map((product) => (
          <article
            key={product.id}
            className={styles.productCard}
            style={{ "--product-accent": product.accent } as CSSProperties}
          >
            <div className={styles.productTop}>
              <div>
                <div className={styles.productName}>{product.name}</div>
                <p className={styles.productTagline}>{product.tagline}</p>
              </div>
              <span className={styles.badge}>{product.badge}</span>
            </div>

            <div className={styles.productMeta}>
              <span>{product.category}</span>
              <span>{product.format}</span>
            </div>

            <div className={styles.productBottom}>
              <div className={styles.price}>
                <span className={styles.priceLabel}>{copy.testAmountLabel}</span>
                <span className={styles.priceValue}>{product.pricePi} Pi</span>
              </div>

              <button
                type="button"
                className={styles.buyButton}
                disabled={purchaseBusy !== null && purchaseBusy !== product.id}
                onClick={() => handlePurchase(product)}
              >
                {purchaseBusy === product.id ? copy.processing : copy.payAction}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.log}>
        <h4>{copy.recentFlowTitle}</h4>
        <ul className={styles.logList}>
          {timeline.map((entry, index) => (
            <li key={`${index}-${entry}`}>{entry}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
