"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { SiteLocale } from "@/lib/i18n";
import type { MessageCenterCopy } from "@/lib/message-center-copy";
import type { StorefrontMessage } from "@/lib/storefront-message-types";
import { useStorefront } from "@/components/storefront-provider";
import styles from "./page.module.css";

type MessagesPageClientProps = {
  copy: MessageCenterCopy;
  initialOrderId: string;
  locale: SiteLocale;
};

async function readMessagesJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers:
      init?.method && init.method !== "GET"
        ? {
            "Content-Type": "application/json",
            ...(init.headers ?? {}),
          }
        : init?.headers,
    cache: "no-store",
  });
  const rawResponse = await response.text();
  const data = rawResponse
    ? ((JSON.parse(rawResponse) as T & { error?: string }) ?? null)
    : ({} as T & { error?: string });

  if (!response.ok) {
    throw new Error(
      data && typeof data.error === "string"
        ? data.error
        : rawResponse || `Request failed with status ${response.status}.`,
    );
  }

  return data;
}

function getSenderLabel(copy: MessageCenterCopy, message: StorefrontMessage) {
  if (message.senderType === "user") {
    return copy.user;
  }

  if (message.senderType === "shop") {
    return copy.shop;
  }

  return copy.system;
}

export function MessagesPageClient({
  copy,
  initialOrderId,
  locale,
}: MessagesPageClientProps) {
  const {
    hydrated,
    orders,
    refreshStorefrontState,
    signInWithPi,
    viewer,
  } = useStorefront();
  const [messages, setMessages] = useState<StorefrontMessage[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<
    { kind: "error" | "success"; text: string } | null
  >(null);
  const refreshInFlightRef = useRef(false);
  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const visibleMessages = useMemo(() => {
    if (!selectedOrderId) {
      return messages;
    }

    return messages.filter((message) => message.orderId === selectedOrderId);
  }, [messages, selectedOrderId]);

  const refreshMessages = useCallback(async () => {
    if (!viewer || refreshInFlightRef.current) {
      return;
    }

    refreshInFlightRef.current = true;
    setLoading(true);

    try {
      try {
        const data = await readMessagesJson<{ items: StorefrontMessage[] }>(
          "/api/storefront/messages",
        );
        setMessages(data.items);
        return;
      } catch (error) {
        const synced = await refreshStorefrontState(undefined, undefined, {
          allowPiAuthFallback: true,
        });

        if (!synced) {
          throw error;
        }
      }

      const data = await readMessagesJson<{ items: StorefrontMessage[] }>(
        "/api/storefront/messages",
      );
      setMessages(data.items);
    } catch {
      setNotice({
        kind: "error",
        text: copy.sendFailed,
      });
    } finally {
      refreshInFlightRef.current = false;
      setLoading(false);
    }
  }, [copy.sendFailed, refreshStorefrontState, viewer]);

  useEffect(() => {
    if (!hydrated || !viewer) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      void refreshMessages();
    });

    const handleFocus = () => {
      void refreshMessages();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void refreshMessages();
      }
    };
    const interval = window.setInterval(() => {
      void refreshMessages();
    }, 15000);

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hydrated, refreshMessages, viewer]);

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.trim()) {
      return;
    }

    setSending(true);
    setNotice(null);

    try {
      const data = await readMessagesJson<{ item: StorefrontMessage }>(
        "/api/storefront/messages",
        {
          body: JSON.stringify({
            body: draft,
            orderId: selectedOrderId || undefined,
          }),
          method: "POST",
        },
      );

      setMessages((currentMessages) => [...currentMessages, data.item]);
      setDraft("");
      setNotice({
        kind: "success",
        text: copy.sendSuccess,
      });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : copy.sendFailed,
      });
    } finally {
      setSending(false);
    }
  };

  if (!hydrated) {
    return (
      <main className={styles.page}>
        <section className={styles.panel}>
          <p className={styles.eyebrow}>{copy.messages}</p>
          <h1>{copy.loading}</h1>
        </section>
      </main>
    );
  }

  if (!viewer) {
    return (
      <main className={styles.page}>
        <section className={styles.signInPanel}>
          <p className={styles.eyebrow}>{copy.messages}</p>
          <h1>{copy.signInTitle}</h1>
          <p>{copy.signInBody}</p>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              void signInWithPi();
            }}
          >
            {copy.signInButton}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{copy.messages}</p>
          <h1>{copy.userTitle}</h1>
          <p>{copy.userLead}</p>
        </div>
        <div className={styles.heroMeta}>
          <span>{copy.customer}</span>
          <strong>{viewer.username ?? viewer.uid}</strong>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <label className={styles.field}>
            <span>{copy.orderSelectLabel}</span>
            <select
              value={selectedOrderId}
              onChange={(event) => setSelectedOrderId(event.target.value)}
            >
              <option value="">{copy.noLinkedOrder}</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  #{order.id.slice(-10).toUpperCase()} - {order.productName}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className={styles.secondaryButton}
            disabled={loading}
            onClick={() => {
              void refreshMessages();
            }}
          >
            {loading ? copy.loading : copy.refresh}
          </button>
        </div>

        {notice ? (
          <div className={styles.notice} data-kind={notice.kind}>
            {notice.text}
          </div>
        ) : null}

        <div className={styles.messageList}>
          {visibleMessages.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>{copy.emptyTitle}</h2>
              <p>{copy.emptyBody}</p>
              <Link href="/orders" className={styles.secondaryButton}>
                {copy.linkedOrder}
              </Link>
            </div>
          ) : (
            visibleMessages.map((message) => (
              <article
                key={message.id}
                className={styles.messageBubble}
                data-sender={message.senderType}
              >
                <div className={styles.messageMeta}>
                  <strong>{getSenderLabel(copy, message)}</strong>
                  <span>{formatter.format(new Date(message.createdAt))}</span>
                </div>
                {message.orderId ? (
                  <span className={styles.orderTag}>
                    {copy.linkedOrder}: #{message.orderId.slice(-10).toUpperCase()}
                  </span>
                ) : null}
                <p>{message.body}</p>
              </article>
            ))
          )}
        </div>

        <form className={styles.composer} onSubmit={handleSend}>
          <label className={styles.field}>
            <span>{copy.messageBodyLabel}</span>
            <textarea
              rows={4}
              value={draft}
              placeholder={copy.userPlaceholder}
              onChange={(event) => setDraft(event.target.value)}
            />
          </label>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={sending || !draft.trim()}
          >
            {sending ? copy.sending : copy.send}
          </button>
        </form>
      </section>
    </main>
  );
}
