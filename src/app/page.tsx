import type { CSSProperties } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { getPublicSiteCopy } from "@/lib/public-site-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { getStorefrontProducts } from "@/lib/storefront-catalog";
import { getStorefrontCopy } from "@/lib/storefront-copy";
import { getBlogPosts } from "@/lib/site-data";
import styles from "./page.module.css";

export default async function Home() {
  const locale = await getRequestLocale();
  const siteCopy = getPublicSiteCopy(locale);
  const storefrontCopy = getStorefrontCopy(locale);
  const products = await getStorefrontProducts(locale);
  const blogPosts = getBlogPosts(locale);
  const featuredProducts = products.slice(0, 3);
  const featuredStories = blogPosts.slice(0, 3);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{siteCopy.home.heroEyebrow}</p>
          <h1>{siteCopy.home.heroTitle}</h1>
          <p className={styles.lead}>{siteCopy.home.heroLead}</p>

          <div className={styles.actions}>
            <Link href="/shop" className={styles.primaryAction}>
              {siteCopy.home.primaryAction}
            </Link>
            <Link href="/blog" className={styles.secondaryAction}>
              {siteCopy.home.secondaryAction}
            </Link>
          </div>
        </div>

        <div className={styles.heroRail}>
          <div className={styles.heroCard}>
            <span className={styles.cardLabel}>
              {siteCopy.home.overviewLabel}
            </span>
            <ul className={styles.statList}>
              {siteCopy.home.stats.map((stat) => (
                <li key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.domainCard}>
            <span className={styles.cardLabel}>
              {siteCopy.home.brandCardLabel}
            </span>
            <h2>{siteCopy.home.brandCardTitle}</h2>
            <p>{siteCopy.home.brandCardDescription}</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>{siteCopy.home.storefrontLabel}</p>
          <h2>{siteCopy.home.storefrontTitle}</h2>
        </div>

        <div className={styles.productGrid}>
          {featuredProducts.map((product) => (
            <article
              key={product.id}
              className={styles.productCard}
              style={{ "--card-accent": product.accent } as CSSProperties}
            >
              <span className={styles.productBadge}>{product.badge}</span>
              <h3>{product.name}</h3>
              <p>{product.tagline}</p>
              <div className={styles.productMeta}>
                <span>{product.category}</span>
                <span>{product.format}</span>
                <span>{product.pricePi} Pi</span>
              </div>
              <div className={styles.productActions}>
                <AddToCartButton
                  addLabel={storefrontCopy.addToCart}
                  addedLabel={storefrontCopy.addedToCart}
                  cancelLabel={storefrontCopy.quantityPickerCancel}
                  confirmLabel={storefrontCopy.quantityPickerConfirm}
                  disabled={(product.inventoryCount ?? 0) <= 0}
                  disabledLabel={storefrontCopy.outOfStock}
                  fullWidth
                  lead={storefrontCopy.quantityPickerLead}
                  maxQuantity={product.inventoryCount ?? 0}
                  pricePi={product.pricePi}
                  productId={product.id}
                  productName={product.name}
                  quantityLabel={storefrontCopy.quantity}
                  title={storefrontCopy.quantityPickerTitle}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.storyColumn}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>{siteCopy.home.pillarsLabel}</p>
            <h2>{siteCopy.home.pillarsTitle}</h2>
          </div>

          <div className={styles.pillarList}>
            {siteCopy.brandPillars.map((pillar) => (
              <article key={pillar.title} className={styles.pillarCard}>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.storyColumn}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>{siteCopy.home.journalLabel}</p>
            <h2>{siteCopy.home.journalTitle}</h2>
          </div>

          <div className={styles.blogList}>
            {featuredStories.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.blogCard}>
                <span className={styles.blogMeta}>
                  {post.category} / {post.readTime}
                </span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
