import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { getStorefrontProducts } from "@/lib/storefront-catalog";
import {
  getBlogPostBySlug,
  getBlogPosts,
  getSiteCopy,
} from "@/lib/site-data";
import styles from "./page.module.css";

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const locale = await getRequestLocale();
  const siteCopy = getSiteCopy(locale);
  const post = getBlogPostBySlug(slug, locale);

  if (!post) {
    return {
      title: siteCopy.metadata.articleNotFoundTitle,
    };
  }

  return {
    title: `${post.title} | Mushroom.Pi`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return getBlogPosts(defaultLocale).map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const locale = await getRequestLocale();
  const siteCopy = getSiteCopy(locale);
  const post = getBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const recommendedProducts = (await getStorefrontProducts(locale)).slice(0, 2);

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <div className={styles.articleHead}>
          <p className={styles.meta}>
            {post.category} / {post.publishedAt} / {post.readTime}
          </p>
          <h1>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>
        </div>

        <div className={styles.body}>
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <aside className={styles.aside}>
        <div className={styles.asideCard}>
          <span className={styles.asideLabel}>
            {siteCopy.blog.articleSidebarLabel}
          </span>
          <p>{siteCopy.blog.articleSidebarText}</p>
          <Link href="/shop" className={styles.cta}>
            {siteCopy.blog.articleSidebarCta}
          </Link>
        </div>

        <div className={styles.recommendations}>
          <span className={styles.asideLabel}>
            {siteCopy.blog.relatedProductsLabel}
          </span>
          {recommendedProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <strong>{product.name}</strong>
              <span>{product.pricePi} Pi</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
