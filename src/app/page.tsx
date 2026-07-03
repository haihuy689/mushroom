import type { CSSProperties } from "react";
import Link from "next/link";
import { PiCommercePanel } from "@/components/pi-commerce-panel";
import { getRequestLocale } from "@/lib/request-locale";
import { getBlogPosts, getProducts, getSiteCopy } from "@/lib/site-data";
import styles from "./page.module.css";

export default async function Home() {
  const locale = await getRequestLocale();
  const siteCopy = getSiteCopy(locale);
  const products = getProducts(locale);
  const blogPosts = getBlogPosts(locale);
  const featuredProducts = products.slice(0, 3);
  const featuredStories = blogPosts.slice(0, 3);
  const serverConfigured = Boolean(process.env.PI_API_KEY);

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
              {siteCopy.home.currentDirectionLabel}
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
              {siteCopy.home.futureDomainLabel}
            </span>
            <h2>{siteCopy.home.futureDomainTitle}</h2>
            <p>{siteCopy.home.futureDomainDescription}</p>
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
            </article>
          ))}
        </div>
      </section>

      <section className={styles.commerceSection}>
        <div className={styles.commerceIntro}>
          <p className={styles.sectionLabel}>{siteCopy.home.commerceLabel}</p>
          <h2>{siteCopy.home.commerceTitle}</h2>
          <p>{siteCopy.home.commerceBody}</p>
        </div>

        <PiCommercePanel
          key={locale}
          products={products.slice(0, 2)}
          serverConfigured={serverConfigured}
          copy={siteCopy.piPanel}
          compact
        />
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
