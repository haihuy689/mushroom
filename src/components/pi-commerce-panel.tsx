"use client";

import type { CSSProperties } from "react";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import type { SiteCopy } from "@/lib/site-data";
import type {
  PiAuthResult,
  PiVerifiedUser,
  Product,
} from "@/lib/pi-types";
import styles from "./pi-commerce-panel.module.css";

type CommercePanelProps = {
  products: Product[];
  serverConfigured: boolean;
  copy: SiteCopy["piPanel"];
  compact?: boolean;
};

type MessageState =
  | { kind: "success"; text: string }
  | { kind: "error"; text: string }
  | null;

const scopes = ["username", "payments"] as const;

const networkLabel =
  process.env.NEXT_PUBLIC_PI_NETWORK_LABEL?.trim() || "Pi Testnet";
const sandboxEnabled = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";
const autoAuthenticateEnabled = process.env.NEXT_PUBLIC_PI_AUTO_AUTH === "true";

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
}: CommercePanelProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [purchaseBusy, setPurchaseBusy] = useState<string | null>(null);
  const [viewer, setViewer] = useState<PiVerifiedUser | null>(null);
  const [message, setMessage] = useState<MessageState>(null);
  const [timeline, setTimeline] = useState<string[]>([copy.initialTimeline]);

  const initializedRef = useRef(false);
  const autoAuthStartedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tryInit = () => {
      if (!window.Pi) {
        timeoutRef.current = setTimeout(tryInit, 250);
        return;
      }

      if (!initializedRef.current) {
        window.Pi.init({
          version: "2.0",
          sandbox: sandboxEnabled,
        });
        initializedRef.current = true;
      }

      setSdkReady(true);
    };

    tryInit();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const panelClassName = useMemo(() => {
    return compact ? `${styles.panel} ${styles.compact}` : styles.panel;
  }, [compact]);

  const appendTimeline = (entry: string) => {
    setTimeline((current) => [entry, ...current].slice(0, 6));
  };

  const authenticate = async () => {
    if (!window.Pi) {
      setMessage({
        kind: "error",
        text: copy.sdkNotReady,
      });
      return;
    }

    setAuthBusy(true);
    setMessage(null);

    try {
      const authResult: PiAuthResult = await window.Pi.authenticate(
        [...scopes],
        async (payment) => {
          appendTimeline(`[${payment.identifier}] ${copy.incompleteFound}`);

          try {
            await postJson(
              "/api/pi/payments/incomplete",
              { payment },
              copy.incompleteFailed,
            );
            appendTimeline(`[${payment.identifier}] ${copy.incompleteSent}`);
          } catch (error) {
            appendTimeline(
              error instanceof Error ? error.message : copy.incompleteFailed,
            );
          }
        },
      );

      const verified = await postJson<{ user: PiVerifiedUser }>(
        "/api/pi/auth",
        { accessToken: authResult.accessToken },
        copy.authFailed,
      );

      const displayName = verified.user.username ?? authResult.user.uid;
      const successText = `${copy.authSuccessPrefix} ${displayName}.`;

      setViewer(verified.user);
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
    } finally {
      setAuthBusy(false);
    }
  };

  const runAutoAuthenticate = useEffectEvent(() => {
    void authenticate();
  });

  useEffect(() => {
    if (
      !autoAuthenticateEnabled ||
      !sdkReady ||
      viewer ||
      authBusy ||
      autoAuthStartedRef.current
    ) {
      return;
    }

    autoAuthStartedRef.current = true;

    const autoAuthTimer = setTimeout(() => {
      runAutoAuthenticate();
    }, 150);

    return () => {
      clearTimeout(autoAuthTimer);
    };
  }, [authBusy, sdkReady, viewer]);

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
            appendTimeline(`[${paymentId}] ${copy.completionDone}`);
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
