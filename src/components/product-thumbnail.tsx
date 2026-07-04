"use client";

import type { CSSProperties } from "react";
import styles from "./product-thumbnail.module.css";

type ProductThumbnailProps = {
  accent: string;
  compact?: boolean;
  imageUrl?: string;
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

function getDefaultImageUrl(productId: string, name: string) {
  const key = `${productId} ${name}`.toLowerCase();

  if (key.includes("lions") || key.includes("lion")) {
    return "/images/mushroom-pi/product-lions-mane.webp";
  }

  if (key.includes("reishi") || key.includes("linh chi")) {
    return "/images/mushroom-pi/product-reishi.webp";
  }

  if (key.includes("cordyceps") || key.includes("dong trung")) {
    return "/images/mushroom-pi/product-cordyceps.webp";
  }

  if (key.includes("shiitake") || key.includes("huong")) {
    return "/images/mushroom-pi/product-shiitake.webp";
  }

  if (key.includes("oyster") || key.includes("bao ngu")) {
    return "/images/mushroom-pi/product-oyster.webp";
  }

  if (key.includes("enoki") || key.includes("kim cham")) {
    return "/images/mushroom-pi/product-enoki.webp";
  }

  if (key.includes("combo") || key.includes("mix")) {
    return "/images/mushroom-pi/product-combo.webp";
  }

  return "/images/mushroom-pi/product-combo.webp";
}

export function ProductThumbnail({
  accent,
  compact = false,
  imageUrl,
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
  const resolvedImageUrl = imageUrl || getDefaultImageUrl(productId, name);

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
      {resolvedImageUrl ? (
        <img
          alt=""
          className={styles.photo}
          loading="lazy"
          src={resolvedImageUrl}
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
