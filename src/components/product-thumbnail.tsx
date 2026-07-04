"use client";

import type { CSSProperties } from "react";
import styles from "./product-thumbnail.module.css";

type ProductThumbnailProps = {
  accent: string;
  compact?: boolean;
  name: string;
  productId: string;
};

function getPalette(productId: string) {
  if (productId.includes("lions")) {
    return {
      primary: "#f4cb5d",
      secondary: "#b96a28",
    };
  }

  if (productId.includes("reishi")) {
    return {
      primary: "#7a3f31",
      secondary: "#d0a271",
    };
  }

  if (productId.includes("cordyceps")) {
    return {
      primary: "#d98635",
      secondary: "#55764b",
    };
  }

  return {
    primary: "#b27b41",
    secondary: "#ead08e",
  };
}

export function ProductThumbnail({
  accent,
  compact = false,
  name,
  productId,
}: ProductThumbnailProps) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const palette = getPalette(productId);

  return (
    <div
      className={styles.frame}
      data-compact={compact}
      style={
        {
          "--thumb-accent": accent,
          "--cap-primary": palette.primary,
          "--cap-secondary": palette.secondary,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <span className={styles.piPill}>Pi</span>
      <span className={styles.glow} />
      <span className={styles.ring} />

      <div className={styles.cluster}>
        <span className={styles.capLarge} />
        <span className={styles.capSmall} />
        <span className={styles.stemTall} />
        <span className={styles.stemShort} />
      </div>

      <span className={styles.initials}>{initials}</span>
    </div>
  );
}
