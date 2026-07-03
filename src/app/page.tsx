import type { CSSProperties } from "react";
import Link from "next/link";
import { PiCommercePanel } from "@/components/pi-commerce-panel";
import {
  blogPosts,
  brandPillars,
  products,
  storeStats,
} from "@/lib/site-data";
import styles from "./page.module.css";

const featuredProducts = products.slice(0, 3);
const featuredStories = blogPosts.slice(0, 3);

export default function Home() {
  const serverConfigured = Boolean(process.env.PI_API_KEY);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Pi-native mushroom commerce</p>
          <h1>Mushroom.Pi is being built as a real store, not just a landing page.</h1>
          <p className={styles.lead}>
            The brand direction is now clear: a storefront-first mushroom site
            connected to Pi sign-in, Test-Pi payments, and an editorial layer
            that teaches, earns trust, and supports long-term growth.
          </p>

          <div className={styles.actions}>
            <Link href="/shop" className={styles.primaryAction}>
              Enter the store
            </Link>
            <Link href="/blog" className={styles.secondaryAction}>
              Read the journal
            </Link>
          </div>
        </div>

        <div className={styles.heroRail}>
          <div className={styles.heroCard}>
            <span className={styles.cardLabel}>Current direction</span>
            <ul className={styles.statList}>
              {storeStats.map((stat) => (
                <li key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.domainCard}>
            <span className={styles.cardLabel}>Future domain fit</span>
            <h2>Mushroom.Pi</h2>
            <p>
              The site identity, content voice, and commerce flow are being
              shaped to eventually live naturally under your Pi domain.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Storefront preview</p>
          <h2>Product architecture now drives the homepage.</h2>
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
          <p className={styles.sectionLabel}>Pi commerce panel</p>
          <h2>Sign in, verify the Pi user, and test the payment lifecycle.</h2>
          <p>
            This is the functional heart of the next phase. The panel below is
            scaffolded around the official Pi flow: authenticate on the client,
            verify through the Platform API, then approve and complete payments
            from server routes.
          </p>
        </div>

        <PiCommercePanel
          products={products.slice(0, 2)}
          serverConfigured={serverConfigured}
          compact
        />
      </section>

      <section className={styles.storySection}>
        <div className={styles.storyColumn}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>Brand pillars</p>
            <h2>The business model is store-first, with content doing strategic support.</h2>
          </div>

          <div className={styles.pillarList}>
            {brandPillars.map((pillar) => (
              <article key={pillar.title} className={styles.pillarCard}>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.storyColumn}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionLabel}>From the journal</p>
            <h2>Content keeps the shop from feeling generic.</h2>
          </div>

          <div className={styles.blogList}>
            {featuredStories.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.blogCard}>
                <span className={styles.blogMeta}>
                  {post.category} · {post.readTime}
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
