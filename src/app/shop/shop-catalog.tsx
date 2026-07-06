"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { PiNetworkIcon } from "@/components/brand-icons";
import type { SiteLocale } from "@/lib/i18n";
import type { Product } from "@/lib/pi-types";
import type { StorefrontCopy } from "@/lib/storefront-copy";
import { formatProductWeight } from "@/lib/storefront-product";
import styles from "./page.module.css";

type ProductGroup = "all" | "fresh" | "dried" | "combo" | "nutrition";
type SortMode = "featured" | "priceAsc" | "priceDesc";

type ShopCatalogProps = {
  copy: StorefrontCopy;
  locale: SiteLocale;
  products: Product[];
};

const labels: Record<
  SiteLocale,
  {
    all: string;
    combo: string;
    dried: string;
    empty: string;
    favorite: string;
    filter: string;
    fresh: string;
    nutrition: string;
    paymentBannerLead: string;
    paymentBannerTitle: string;
    search: string;
    sort: string;
    sortFeatured: string;
    sortHigh: string;
    sortLow: string;
    sold: string;
  }
> = {
  en: {
    all: "All",
    combo: "Combo",
    dried: "Dried",
    empty: "No matching products yet.",
    favorite: "Add to favorites",
    filter: "In stock",
    fresh: "Fresh",
    nutrition: "Nutrition",
    paymentBannerLead: "Safe, fast checkout for the Pi community",
    paymentBannerTitle: "Fast Pi payment in Pi Browser",
    search: "Search mushrooms, combo, dried products...",
    sort: "Sort",
    sortFeatured: "Featured",
    sortHigh: "Price high",
    sortLow: "Price low",
    sold: "Sold",
  },
  vi: {
    all: "Tất cả",
    combo: "Combo",
    dried: "Nấm khô",
    empty: "Chưa có sản phẩm phù hợp.",
    favorite: "Yêu thích",
    filter: "Còn hàng",
    fresh: "Nấm tươi",
    nutrition: "Dinh dưỡng",
    paymentBannerLead: "An toàn, nhanh chóng cho cộng đồng Pi",
    paymentBannerTitle: "Thanh toán nhanh bằng Pi trên Pi Browser",
    search: "Tìm nấm, combo...",
    sort: "Sắp xếp",
    sortFeatured: "Nổi bật",
    sortHigh: "Giá cao",
    sortLow: "Giá thấp",
    sold: "Đã bán",
  },
  es: {
    all: "Todo",
    combo: "Combo",
    dried: "Secos",
    empty: "No hay productos que coincidan.",
    favorite: "Agregar a favoritos",
    filter: "En stock",
    fresh: "Frescos",
    nutrition: "Nutrición",
    paymentBannerLead: "Pago seguro y rápido para la comunidad Pi",
    paymentBannerTitle: "Pago rápido con Pi en Pi Browser",
    search: "Buscar hongos, combos, productos secos...",
    sort: "Ordenar",
    sortFeatured: "Destacados",
    sortHigh: "Precio alto",
    sortLow: "Precio bajo",
    sold: "Vendidos",
  },
  fr: {
    all: "Tout",
    combo: "Combo",
    dried: "Séchés",
    empty: "Aucun produit correspondant.",
    favorite: "Ajouter aux favoris",
    filter: "En stock",
    fresh: "Frais",
    nutrition: "Nutrition",
    paymentBannerLead: "Paiement sûr et rapide pour la communauté Pi",
    paymentBannerTitle: "Paiement Pi rapide dans Pi Browser",
    search: "Chercher champignons, combos, produits séchés...",
    sort: "Trier",
    sortFeatured: "En avant",
    sortHigh: "Prix haut",
    sortLow: "Prix bas",
    sold: "Vendus",
  },
  zh: {
    all: "全部",
    combo: "组合",
    dried: "干货",
    empty: "没有匹配的商品。",
    favorite: "加入收藏",
    filter: "有库存",
    fresh: "鲜菇",
    nutrition: "营养",
    paymentBannerLead: "为 Pi 社区提供安全快速的结账",
    paymentBannerTitle: "在 Pi Browser 中快速用 Pi 支付",
    search: "搜索蘑菇、组合、干货...",
    sort: "排序",
    sortFeatured: "推荐",
    sortHigh: "价格高",
    sortLow: "价格低",
    sold: "已售",
  },
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function productText(product: Product) {
  return normalize(
    [
      product.name,
      product.tagline,
      product.description,
      product.category,
      product.format,
      product.packaging,
      product.badge,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function getProductGroup(product: Product): ProductGroup {
  const text = productText(product);

  if (/(combo|bundle|mix|set|hop qua|goi)/.test(text)) {
    return "combo";
  }

  if (
    /(dinh duong|nutrition|wellness|focus|tonic|drops|cordyceps|reishi|linh chi|lion|nam nam)/.test(
      text,
    )
  ) {
    return "nutrition";
  }

  if (/(kho|dry|dried|huong|shiitake|meo|moc nhi|nam moi)/.test(text)) {
    return "dried";
  }

  return "fresh";
}

function getDefaultImageUrl(product: Product) {
  const key = normalize(`${product.id} ${product.name} ${product.category}`);

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

function getRating(product: Product) {
  const seed = product.id.split("").reduce((sum, letter) => sum + letter.charCodeAt(0), 0);
  return seed % 4 === 0 ? "4.7" : seed % 3 === 0 ? "4.8" : "4.9";
}

function getSoldCount(product: Product) {
  const baseSoldCount =
    typeof product.baseSoldCount === "number" ? product.baseSoldCount : 0;
  const actualSoldCount =
    typeof product.actualSoldCount === "number" ? product.actualSoldCount : 0;

  return Math.max(0, Math.round(baseSoldCount + actualSoldCount));
}

function sortProducts(products: Product[], sortMode: SortMode) {
  return [...products].sort((left, right) => {
    if (sortMode === "priceAsc") {
      return left.pricePi - right.pricePi;
    }

    if (sortMode === "priceDesc") {
      return right.pricePi - left.pricePi;
    }

    const featuredDelta = Number(right.isFeatured === true) - Number(left.isFeatured === true);

    if (featuredDelta !== 0) {
      return featuredDelta;
    }

    return left.name.localeCompare(right.name);
  });
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.8 18.1A7.3 7.3 0 1 1 18.1 10.8 7.3 7.3 0 0 1 10.8 18.1Zm5.1-2.2 4 4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16M7 12h10M10 17h4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 4v16m0 0-3-3m3 3 3-3M16 20V4m0 0-3 3m3-3 3 3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20s-7-4.4-8.7-9A4.7 4.7 0 0 1 12 6.9 4.7 4.7 0 0 1 20.7 11C19 15.6 12 20 12 20Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      />
    </svg>
  );
}

export function ShopCatalog({ copy, locale, products }: ShopCatalogProps) {
  const text = labels[locale] ?? labels.en;
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<ProductGroup>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalize(deferredQuery.trim());
  const groups: Array<{ id: ProductGroup; label: string }> = [
    { id: "all", label: text.all },
    { id: "fresh", label: text.fresh },
    { id: "dried", label: text.dried },
    { id: "combo", label: text.combo },
    { id: "nutrition", label: text.nutrition },
  ];

  const visibleProducts = sortProducts(
    products.filter((product) => {
      const inStock =
        typeof product.inventoryCount === "number" ? product.inventoryCount > 0 : true;

      if (inStockOnly && !inStock) {
        return false;
      }

      if (activeGroup !== "all" && getProductGroup(product) !== activeGroup) {
        return false;
      }

      if (normalizedQuery && !productText(product).includes(normalizedQuery)) {
        return false;
      }

      return true;
    }),
    sortMode,
  );

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>{copy.shopTitle}</h1>
          <p>{copy.shopLead}</p>

          <label className={styles.searchBox}>
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={text.search}
            />
          </label>

          <div className={styles.categoryTabs} aria-label={copy.shopTitle}>
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                data-active={activeGroup === group.id}
                onClick={() => setActiveGroup(group.id)}
              >
                {group.label}
              </button>
            ))}
          </div>

          <div className={styles.shopTools}>
            <button
              type="button"
              data-active={inStockOnly}
              onClick={() => setInStockOnly((current) => !current)}
            >
              <FilterIcon />
              {text.filter}
            </button>

            <label>
              <SortIcon />
              <span>{text.sort}</span>
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
              >
                <option value="featured">{text.sortFeatured}</option>
                <option value="priceAsc">{text.sortLow}</option>
                <option value="priceDesc">{text.sortHigh}</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <Link href="/cart" className={styles.piPaymentBanner}>
        <span className={styles.piBannerIcon}>
          <PiNetworkIcon className={styles.piBannerImage} />
        </span>
        <span>
          <strong>{text.paymentBannerTitle}</strong>
          <small>{text.paymentBannerLead}</small>
        </span>
        <span className={styles.bannerArrow}>›</span>
      </Link>

      <section className={styles.productGrid} aria-label={copy.shopTitle}>
        {visibleProducts.map((product) => {
          const availableInventory =
            typeof product.inventoryCount === "number" ? product.inventoryCount : 0;
          const inStock = availableInventory > 0;
          const productWeight = formatProductWeight(product);
          const discountPercent =
            product.compareAtPi && product.compareAtPi > product.pricePi
              ? Math.round(((product.compareAtPi - product.pricePi) / product.compareAtPi) * 100)
              : null;

          return (
            <article
              key={product.id}
              className={styles.productCard}
              data-sold-out={!inStock}
            >
              <div className={styles.productMedia}>
                <img
                  alt=""
                  loading="lazy"
                  src={product.imageUrl || getDefaultImageUrl(product)}
                />
                {discountPercent ? (
                  <span className={styles.discountBadge}>-{discountPercent}%</span>
                ) : null}
                <button
                  type="button"
                  className={styles.favoriteButton}
                  aria-label={text.favorite}
                >
                  <HeartIcon />
                </button>
              </div>

              <div className={styles.productBody}>
                <span className={styles.productBadge}>{product.badge}</span>
                <h2>{product.name}</h2>
                <p>{product.tagline || product.description}</p>

                <div className={styles.productMeta}>
                  <span>{product.packaging || product.format}</span>
                  {productWeight ? <span>{productWeight}</span> : null}
                </div>

                <strong className={styles.price}>{product.pricePi} Pi</strong>

                <div className={styles.productFooter}>
                  <span className={styles.rating}>★ {getRating(product)}</span>
                  <span>·</span>
                  <span>
                    {text.sold} {getSoldCount(product).toLocaleString(locale)}
                  </span>
                  <span>
                    {inStock
                      ? `${copy.inventoryLabel}: ${availableInventory}`
                      : copy.outOfStock}
                  </span>
                </div>

                <AddToCartButton
                  addLabel={copy.addToCart}
                  addedLabel={copy.addedToCart}
                  cancelLabel={copy.quantityPickerCancel}
                  confirmLabel={copy.quantityPickerConfirm}
                  disabled={!inStock}
                  disabledLabel={copy.outOfStock}
                  fullWidth
                  lead={copy.quantityPickerLead}
                  maxQuantity={availableInventory}
                  pricePi={product.pricePi}
                  productId={product.id}
                  productImageUrl={product.imageUrl}
                  productName={product.name}
                  quantityLabel={copy.quantity}
                  title={copy.quantityPickerTitle}
                />
              </div>
            </article>
          );
        })}
      </section>

      {visibleProducts.length === 0 ? (
        <p className={styles.emptyState}>{text.empty}</p>
      ) : null}

    </>
  );
}
