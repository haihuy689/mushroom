"use client";

import { useEffect, useState } from "react";
import { useStorefront } from "@/components/storefront-provider";
import styles from "./storefront-action.module.css";

type AddToCartButtonProps = {
  addLabel: string;
  addedLabel: string;
  cancelLabel: string;
  confirmLabel: string;
  disabled?: boolean;
  disabledLabel?: string;
  fullWidth?: boolean;
  lead: string;
  maxQuantity?: number;
  pricePi: number;
  productId: string;
  productImageUrl?: string;
  productName: string;
  quantityLabel: string;
  title: string;
};

const CART_TARGET_SELECTOR = "[data-cart-target]";
const FLYER_SIZE = 52;

function getVisibleCartTargets() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(CART_TARGET_SELECTOR),
  )
    .map((element) => ({
      element,
      rect: element.getBoundingClientRect(),
    }))
    .filter(({ element, rect }) => {
      const style = window.getComputedStyle(element);

      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= window.innerHeight &&
        rect.left <= window.innerWidth &&
        style.display !== "none" &&
        style.visibility !== "hidden"
      );
    });
}

function getClosestCartTarget(sourceRect: DOMRect) {
  const sourceX = sourceRect.left + sourceRect.width / 2;
  const sourceY = sourceRect.top + sourceRect.height / 2;

  return getVisibleCartTargets().sort((first, second) => {
    const firstX = first.rect.left + first.rect.width / 2;
    const firstY = first.rect.top + first.rect.height / 2;
    const secondX = second.rect.left + second.rect.width / 2;
    const secondY = second.rect.top + second.rect.height / 2;

    return (
      (firstX - sourceX) ** 2 +
      (firstY - sourceY) ** 2 -
      ((secondX - sourceX) ** 2 + (secondY - sourceY) ** 2)
    );
  })[0];
}

function getProductInitials(productName: string) {
  return (
    productName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "+1"
  );
}

function pulseCartTarget(element: HTMLElement) {
  if (typeof element.animate !== "function") {
    return;
  }

  element.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.16)", offset: 0.42 },
      { transform: "scale(1)" },
    ],
    {
      duration: 520,
      easing: "cubic-bezier(.2,.82,.24,1)",
    },
  );
}

function launchCartFlight({
  productImageUrl,
  productName,
  quantity,
  sourceElement,
}: {
  productImageUrl?: string;
  productName: string;
  quantity: number;
  sourceElement: HTMLElement;
}) {
  const sourceRect = sourceElement.getBoundingClientRect();
  const target = getClosestCartTarget(sourceRect);

  if (!target) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    pulseCartTarget(target.element);
    return;
  }

  const startX = sourceRect.left + sourceRect.width / 2 - FLYER_SIZE / 2;
  const startY = sourceRect.top + sourceRect.height / 2 - FLYER_SIZE / 2;
  const endX = target.rect.left + target.rect.width / 2 - FLYER_SIZE / 2;
  const endY = target.rect.top + target.rect.height / 2 - FLYER_SIZE / 2;
  const arcLift = Math.max(60, Math.min(150, Math.abs(startY - endY) * 0.32));
  const midX = startX + (endX - startX) * 0.52;
  const midY = Math.min(startY, endY) - arcLift;
  const flyer = document.createElement("div");

  flyer.className = styles.cartFlight;
  flyer.setAttribute("aria-hidden", "true");
  flyer.dataset.hasImage = productImageUrl ? "true" : "false";

  if (productImageUrl) {
    const image = document.createElement("img");
    image.alt = "";
    image.src = productImageUrl;
    flyer.append(image);
  } else {
    flyer.textContent = quantity > 1 ? `+${quantity}` : getProductInitials(productName);
  }

  document.body.append(flyer);

  const animation = flyer.animate(
    [
      {
        opacity: 0,
        transform: `translate3d(${startX}px, ${startY + 8}px, 0) scale(.72)`,
      },
      {
        opacity: 1,
        transform: `translate3d(${startX}px, ${startY - 24}px, 0) scale(1.08)`,
        offset: 0.16,
      },
      {
        opacity: 0.94,
        transform: `translate3d(${midX}px, ${midY}px, 0) scale(.96)`,
        offset: 0.58,
      },
      {
        opacity: 0,
        transform: `translate3d(${endX}px, ${endY}px, 0) scale(.34)`,
      },
    ],
    {
      duration: 780,
      easing: "cubic-bezier(.18,.84,.22,1)",
      fill: "forwards",
    },
  );

  window.setTimeout(() => {
    pulseCartTarget(target.element);
  }, 470);

  animation.onfinish = () => {
    flyer.remove();
  };
  animation.oncancel = () => {
    flyer.remove();
  };
}

export function AddToCartButton({
  addLabel,
  addedLabel,
  cancelLabel,
  confirmLabel,
  disabled = false,
  disabledLabel,
  fullWidth = false,
  lead,
  maxQuantity = 99,
  pricePi,
  productId,
  productImageUrl,
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
  const normalizedMaxQuantity = Math.max(1, Math.min(99, maxQuantity));

  return (
    <>
      <button
        type="button"
        className={styles.addButton}
        data-added={recentlyAdded}
        data-full={fullWidth}
        disabled={disabled}
        onClick={() => {
          if (disabled) {
            return;
          }

          setQuantity(1);
          setIsOpen(true);
        }}
      >
        {disabled ? disabledLabel ?? addLabel : recentlyAdded ? addedLabel : addLabel}
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
                  onClick={() =>
                    setQuantity((current) =>
                      Math.min(normalizedMaxQuantity, current + 1),
                    )
                  }
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
                onClick={(event) => {
                  addToCart(productId, quantity);
                  launchCartFlight({
                    productImageUrl,
                    productName,
                    quantity,
                    sourceElement: event.currentTarget,
                  });
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
