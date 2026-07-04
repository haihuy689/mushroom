"use client";

import { useEffect, useState } from "react";
import { useStorefront } from "@/components/storefront-provider";
import styles from "./storefront-action.module.css";

type AddToCartButtonProps = {
  productId: string;
  addLabel: string;
  addedLabel: string;
  fullWidth?: boolean;
};

export function AddToCartButton({
  productId,
  addLabel,
  addedLabel,
  fullWidth = false,
}: AddToCartButtonProps) {
  const { addToCart } = useStorefront();
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

  return (
    <button
      type="button"
      className={styles.addButton}
      data-added={recentlyAdded}
      data-full={fullWidth}
      onClick={() => {
        addToCart(productId);
        setRecentlyAdded(true);
      }}
    >
      {recentlyAdded ? addedLabel : addLabel}
    </button>
  );
}
