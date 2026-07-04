import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { PiCommercePanel } from "@/components/pi-commerce-panel";
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
  const siteCopy = getSiteCopy(locale);
  const storefrontCopy = getStorefrontCopy(locale);
  const products = getProducts(locale);
  const serverConfigured = Boolean(process.env.PI_API_KEY);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{siteCopy.shop.heroEyebrow}</p>
          <h1>{siteCopy.shop.heroTitle}</h1>
          <p className={styles.lead}>{siteCopy.shop.heroLead}</p>
        </div>

        <div className={styles.infoGrid}>
          {siteCopy.shop.infoCards.map((card) => (
            <article key={card.title} className={styles.infoCard}>
              <strong>{card.title}</strong>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.catalogColumn}>
          {products.map((product) => (
            <article
              key={product.id}
              className={styles.catalogCard}
              style={{ "--card-accent": product.accent } as CSSProperties}
            >
              <span className={styles.badge}>{product.badge}</span>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <div className={styles.metaRow}>
                <span>{product.category}</span>
                <span>{product.format}</span>
                <span>{product.pricePi} Pi</span>
              </div>
              <div className={styles.cardActions}>
                <AddToCartButton
                  productId={product.id}
                  addLabel={storefrontCopy.addToCart}
                  addedLabel={storefrontCopy.addedToCart}
                  fullWidth
                />
              </div>
            </article>
          ))}
        </div>

        <PiCommercePanel
          key={locale}
          products={products}
          serverConfigured={serverConfigured}
          copy={siteCopy.piPanel}
        />
      </section>
    </div>
  );
}
