import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PiCommercePanel } from "@/components/pi-commerce-panel";
import { products } from "@/lib/site-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Shop | Mushroom.Pi",
  description:
    "Browse the Mushroom.Pi storefront and test the Pi-native checkout flow.",
};

export default function ShopPage() {
  const serverConfigured = Boolean(process.env.PI_API_KEY);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Storefront</p>
          <h1>Mushroom.Pi is being designed to sell first and explain second.</h1>
          <p className={styles.lead}>
            This page is the clearest expression of the target business model:
            curated mushroom products, Pi-native onboarding, and a checkout path
            that can mature from Test-Pi to a full production flow later.
          </p>
        </div>

        <div className={styles.infoGrid}>
          <article className={styles.infoCard}>
            <strong>Test-Pi now</strong>
            <p>Use Pi Testnet as the operating lane while the product logic and UX are refined.</p>
          </article>
          <article className={styles.infoCard}>
            <strong>Catalog mix</strong>
            <p>Functional wellness, culinary products, and bundle logic all fit naturally into this structure.</p>
          </article>
          <article className={styles.infoCard}>
            <strong>Pi identity</strong>
            <p>Login and payment are being treated as native business primitives, not bolt-on widgets.</p>
          </article>
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
            </article>
          ))}
        </div>

        <PiCommercePanel
          products={products}
          serverConfigured={serverConfigured}
        />
      </section>
    </div>
  );
}
