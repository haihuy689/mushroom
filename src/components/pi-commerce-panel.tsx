"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  PiAuthResult,
  PiVerifiedUser,
  Product,
} from "@/lib/pi-types";
import styles from "./pi-commerce-panel.module.css";

type CommercePanelProps = {
  products: Product[];
  serverConfigured: boolean;
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

async function postJson<T>(path: string, payload: Record<string, unknown>) {
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
      typeof data.error === "string" ? data.error : "Request failed";
    throw new Error(errorMessage);
  }

  return data;
}

export function PiCommercePanel({
  products,
  serverConfigured,
  compact = false,
}: CommercePanelProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [purchaseBusy, setPurchaseBusy] = useState<string | null>(null);
  const [viewer, setViewer] = useState<PiVerifiedUser | null>(null);
  const [message, setMessage] = useState<MessageState>(null);
  const [timeline, setTimeline] = useState<string[]>([
    "Pi SDK panel loaded. Open this page in Pi Browser or Pi Sandbox to test native sign-in and checkout.",
  ]);

  const initializedRef = useRef(false);
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

  const handleAuthenticate = async () => {
    if (!window.Pi) {
      setMessage({
        kind: "error",
        text: "Pi SDK is not available yet. Open the app in Pi Browser or wait for the script to finish loading.",
      });
      return;
    }

    setAuthBusy(true);
    setMessage(null);

    try {
      const authResult: PiAuthResult = await window.Pi.authenticate(
        [...scopes],
        async (payment) => {
          appendTimeline(
            `Incomplete payment found: ${payment.identifier}. Trying to reconcile it on the server.`,
          );

          try {
            await postJson("/api/pi/payments/incomplete", { payment });
            appendTimeline(
              `Incomplete payment ${payment.identifier} was handed off to the server.`,
            );
          } catch (error) {
            appendTimeline(
              error instanceof Error
                ? error.message
                : "Failed to reconcile an incomplete payment.",
            );
          }
        },
      );

      const verified = await postJson<{ user: PiVerifiedUser }>("/api/pi/auth", {
        accessToken: authResult.accessToken,
      });

      setViewer(verified.user);
      setMessage({
        kind: "success",
        text: `Connected as ${verified.user.username ?? authResult.user.uid}. Server-side verification with /me succeeded.`,
      });
      appendTimeline("Pi account authenticated and verified through the Pi Platform API.");
    } catch (error) {
      setMessage({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "Pi authentication failed.",
      });
    } finally {
      setAuthBusy(false);
    }
  };

  const handlePurchase = (product: Product) => {
    if (!window.Pi) {
      setMessage({
        kind: "error",
        text: "Pi SDK is not available in this browser session.",
      });
      return;
    }

    if (!viewer) {
      setMessage({
        kind: "error",
        text: "Authenticate with your Pi account before starting a Test-Pi payment.",
      });
      return;
    }

    if (!serverConfigured) {
      setMessage({
        kind: "error",
        text: "PI_API_KEY is not configured on the server yet, so payment approval cannot continue.",
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
            appendTimeline(`Payment ${paymentId} is ready for server approval.`);
            await postJson("/api/pi/payments/approve", {
              paymentId,
              productId: product.id,
            });
            appendTimeline(`Payment ${paymentId} was approved by the backend.`);
          } catch (error) {
            setPurchaseBusy(null);
            setMessage({
              kind: "error",
              text:
                error instanceof Error
                  ? error.message
                  : "Server-side approval failed.",
            });
            appendTimeline(
              error instanceof Error
                ? error.message
                : "Server-side approval failed.",
            );
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          try {
            appendTimeline(
              `Blockchain transaction received for ${paymentId}. Completing with txid ${txid}.`,
            );

            await postJson("/api/pi/payments/complete", {
              paymentId,
              txid,
              productId: product.id,
            });

            setMessage({
              kind: "success",
              text: `${product.name} reached the server-completion phase successfully. This is the core Pi payment flow you will later connect to real fulfillment.`,
            });
            appendTimeline(`Payment ${paymentId} was completed on the backend.`);
            setPurchaseBusy(null);
          } catch (error) {
            setPurchaseBusy(null);
            setMessage({
              kind: "error",
              text:
                error instanceof Error
                  ? error.message
                  : "Server-side completion failed.",
            });
            appendTimeline(
              error instanceof Error
                ? error.message
                : "Server-side completion failed.",
            );
          }
        },
        onCancel: (paymentId) => {
          setPurchaseBusy(null);
          setMessage({
            kind: "error",
            text: `Payment ${paymentId} was cancelled before completion.`,
          });
          appendTimeline(`Payment ${paymentId} was cancelled by the user or the SDK.`);
        },
        onError: (error, payment) => {
          setPurchaseBusy(null);
          setMessage({
            kind: "error",
            text: error.message,
          });
          appendTimeline(
            payment
              ? `Payment error on ${payment.identifier}: ${error.message}`
              : `Payment error: ${error.message}`,
          );
        },
      },
    );
  };

  return (
    <section className={panelClassName}>
      <div className={styles.top}>
        <div>
          <h3>Pi Commerce Lab</h3>
          <p>
            This panel is wired for Pi sign-in, user verification through
            `/me`, and Test-Pi payment approval/completion callbacks. It is the
            commerce bridge for Mushroom.Pi.
          </p>
        </div>

        <div className={styles.statusPills}>
          <span className={styles.pill}>{networkLabel}</span>
          <span className={styles.pill}>
            {sandboxEnabled ? "Sandbox enabled" : "Browser runtime"}
          </span>
          <span className={`${styles.pill} ${styles.pillMuted}`}>
            {serverConfigured ? "Server key configured" : "Server key pending"}
          </span>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.connectButton}
          onClick={handleAuthenticate}
          disabled={!sdkReady || authBusy}
        >
          {authBusy ? "Connecting..." : "Sign in with Pi"}
        </button>
      </div>

      <div className={styles.hint}>
        Pi login and payment dialogs are expected to work inside Pi Browser or
        Pi Sandbox. On a regular browser, the SDK may load but the native flow
        can still be unavailable.
      </div>

      {viewer ? (
        <div className={styles.userCard}>
          <span className={styles.userLabel}>Verified Pioneer</span>
          <span className={styles.userName}>
            {viewer.username ?? viewer.uid}
          </span>
          <span>
            Granted scopes: {viewer.credentials?.scopes.join(", ") ?? "unknown"}
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
                <span className={styles.priceLabel}>Test-Pi amount</span>
                <span className={styles.priceValue}>{product.pricePi} Pi</span>
              </div>

              <button
                type="button"
                className={styles.buyButton}
                disabled={purchaseBusy !== null && purchaseBusy !== product.id}
                onClick={() => handlePurchase(product)}
              >
                {purchaseBusy === product.id
                  ? "Processing..."
                  : "Pay with Pi Testnet"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.log}>
        <h4>Recent flow events</h4>
        <ul className={styles.logList}>
          {timeline.map((entry, index) => (
            <li key={`${index}-${entry}`}>{entry}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
