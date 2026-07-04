import type { Metadata } from "next";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductThumbnail } from "@/components/product-thumbnail";
import { getRequestLocale } from "@/lib/request-locale";
import { getStorefrontCopy } from "@/lib/storefront-copy";
import { getProducts, getSiteCopy } from "@/lib/site-data";
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
  const products = getProducts(locale);

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>{copy.shopTitle}</p>
        <h1>{copy.shopTitle}</h1>
        <p className={styles.lead}>{copy.shopLead}</p>
      </section>

      <section className={styles.list}>
        {products.map((product) => (
          <article key={product.id} className={styles.item}>
            <ProductThumbnail
              accent={product.accent}
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
                  <span>{product.format}</span>
                </div>
              </div>

              <p className={styles.description}>{product.description}</p>

              <div className={styles.meta}>
                <span>{product.category}</span>
                <span>{product.format}</span>
              </div>

              <div className={styles.actions}>
                <AddToCartButton
                  addLabel={copy.addToCart}
                  addedLabel={copy.addedToCart}
                  cancelLabel={copy.quantityPickerCancel}
                  confirmLabel={copy.quantityPickerConfirm}
                  lead={copy.quantityPickerLead}
                  pricePi={product.pricePi}
                  productId={product.id}
                  productName={product.name}
                  quantityLabel={copy.quantity}
                  title={copy.quantityPickerTitle}
                />
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
