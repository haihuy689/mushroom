import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicSiteCopy } from "@/lib/public-site-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { getPublicBlogPostBySlug } from "@/lib/public-blog";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const fallbackCoverImage = "/images/mushroom-pi/hero-market.webp";

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const locale = await getRequestLocale();
  const siteCopy = getPublicSiteCopy(locale);
  const post = await getPublicBlogPostBySlug(slug, locale);

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

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const locale = await getRequestLocale();
  const siteCopy = getPublicSiteCopy(locale);
  const post = await getPublicBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <div className={styles.coverFrame}>
          <Image
            src={post.coverImageUrl || fallbackCoverImage}
            alt={post.title}
            width={1120}
            height={720}
            className={styles.coverImage}
            priority
            unoptimized
          />
        </div>
        <div className={styles.articleHead}>
          <div className={styles.meta}>
            <span>{post.category}</span>
            <span>{post.publishedAt}</span>
            <span>{post.readTime}</span>
          </div>
          <p className={styles.coverNote}>{post.coverNote}</p>
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
          <p>{siteCopy.blog.recommendationText}</p>
          <Link href="/shop" className={styles.cta}>
            {siteCopy.blog.articleSidebarCta}
          </Link>
        </div>
      </aside>
    </div>
  );
}
