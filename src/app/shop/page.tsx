import type { Metadata } from "next";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductThumbnail } from "@/components/product-thumbnail";
import { getRequestLocale } from "@/lib/request-locale";
import { getStorefrontProducts } from "@/lib/storefront-catalog";
import { getStorefrontCopy } from "@/lib/storefront-copy";
import { formatProductWeight } from "@/lib/storefront-product";
import { getSiteCopy } from "@/lib/site-data";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const siteCopy = getSiteCopy(locale);

  return {
    title: siteCopy.metadata.shopTitle,
    description: siteCopy.metadata.shopDescription,
  };
}

export default async function ShopPage() {
  const locale = await getRequestLocale();
  const copy = getStorefrontCopy(locale);
  const products = await getStorefrontProducts(locale);

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>{copy.shopTitle}</p>
        <h1>{copy.shopTitle}</h1>
        <p className={styles.lead}>{copy.shopLead}</p>
      </section>

      <section className={styles.list}>
        {products.map((product) => {
          const availableInventory =
            typeof product.inventoryCount === "number" ? product.inventoryCount : 0;
          const inStock = availableInventory > 0;
          const productWeight = formatProductWeight(product);

          return (
            <article
              key={product.id}
              className={styles.item}
              data-sold-out={!inStock}
            >
              <ProductThumbnail
                accent={product.accent}
                imageUrl={product.imageUrl}
                name={product.name}
                productId={product.id}
              />

              <div className={styles.content}>
                <div className={styles.topRow}>
                  <div className={styles.titleWrap}>
                    <span className={styles.badge}>{product.badge}</span>
                    <h2>{product.name}</h2>
                    <p className={styles.tagline}>{product.tagline}</p>
                  </div>

                  <div className={styles.priceWrap}>
                    <strong>{product.pricePi} Pi</strong>
                    <span>{product.packaging || product.format}</span>
                  </div>
                </div>

                <p className={styles.description}>{product.description}</p>

                <div className={styles.meta}>
                  <span>{product.category}</span>
                  <span>
                    {copy.packagingLabel}: {product.packaging || product.format}
                  </span>
                  {productWeight ? (
                    <span>
                      {copy.weightLabel}: {productWeight}
                    </span>
                  ) : null}
                  <span className={styles.stockMeta} data-stocked={inStock}>
                    {inStock
                      ? `${copy.inventoryLabel}: ${availableInventory}`
                      : copy.outOfStock}
                  </span>
                </div>

                <div className={styles.actions}>
                  <AddToCartButton
                    addLabel={copy.addToCart}
                    addedLabel={copy.addedToCart}
                    cancelLabel={copy.quantityPickerCancel}
                    confirmLabel={copy.quantityPickerConfirm}
                    disabled={!inStock}
                    disabledLabel={copy.outOfStock}
                    lead={copy.quantityPickerLead}
                    maxQuantity={availableInventory}
                    pricePi={product.pricePi}
                    productId={product.id}
                    productName={product.name}
                    quantityLabel={copy.quantity}
                    title={copy.quantityPickerTitle}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
