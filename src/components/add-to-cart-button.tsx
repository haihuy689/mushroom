"use client";

import { useEffect, useState } from "react";
import { useStorefront } from "@/components/storefront-provider";
import styles from "./storefront-action.module.css";

type AddToCartButtonProps = {
  addLabel: string;
  addedLabel: string;
  cancelLabel: string;
  confirmLabel: string;
  fullWidth?: boolean;
  lead: string;
  pricePi: number;
  productId: string;
  productName: string;
  quantityLabel: string;
  title: string;
};

export function AddToCartButton({
  addLabel,
  addedLabel,
  cancelLabel,
  confirmLabel,
  fullWidth = false,
  lead,
  pricePi,
  productId,
  productName,
  quantityLabel,
  title,
}: AddToCartButtonProps) {
  const { addToCart } = useStorefront();
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [recentlyAdded, setRecentlyAdded] = useState(false);

  useEffect(() => {
    if (!recentlyAdded) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setRecentlyAdded(false);
    }, 1600);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [recentlyAdded]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const totalPi = Number((pricePi * quantity).toFixed(4));

  return (
    <>
      <button
        type="button"
        className={styles.addButton}
        data-added={recentlyAdded}
        data-full={fullWidth}
        onClick={() => {
          setQuantity(1);
          setIsOpen(true);
        }}
      >
        {recentlyAdded ? addedLabel : addLabel}
      </button>

      {isOpen ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalTop}>
              <div>
                <p className={styles.modalEyebrow}>{title}</p>
                <h3>{productName}</h3>
              </div>
              <strong>{pricePi} Pi</strong>
            </div>

            <p className={styles.modalLead}>{lead}</p>

            <div className={styles.modalRow}>
              <span>{quantityLabel}</span>
              <div className={styles.quantityStepper}>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  -
                </button>
                <strong>{quantity}</strong>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(99, current + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.modalSummary}>
              <span>{confirmLabel}</span>
              <strong>{totalPi} Pi</strong>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => setIsOpen(false)}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => {
                  addToCart(productId, quantity);
                  setIsOpen(false);
                  setRecentlyAdded(true);
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
