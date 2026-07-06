import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublicSiteCopy } from "@/lib/public-site-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { getPublicBlogPosts } from "@/lib/public-blog";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const fallbackCoverImage = "/images/mushroom-pi/hero-market.webp";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const siteCopy = getPublicSiteCopy(locale);

  return {
    title: siteCopy.metadata.blogTitle,
    description: siteCopy.metadata.blogDescription,
  };
}

export default async function BlogPage() {
  const locale = await getRequestLocale();
  const siteCopy = getPublicSiteCopy(locale);
  const blogPosts = await getPublicBlogPosts(locale);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{siteCopy.blog.heroEyebrow}</p>
          <h1>{siteCopy.blog.heroTitle}</h1>
          <p className={styles.lead}>{siteCopy.blog.heroLead}</p>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <span>{siteCopy.blog.heroArtLabel}</span>
          <strong>{siteCopy.blog.heroArtTitle}</strong>
        </div>
      </section>

      <section className={styles.listSection}>
        {blogPosts.length === 0 ? (
          <div className={styles.emptyCard}>
            <p className={styles.eyebrow}>Blog</p>
            <h2>{siteCopy.blog.emptyTitle}</h2>
            <p>{siteCopy.blog.emptyBody}</p>
          </div>
        ) : (
          blogPosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={styles.postCard}
              data-featured={index === 0}
            >
              <div className={styles.coverFrame}>
                <Image
                  src={post.coverImageUrl || fallbackCoverImage}
                  alt={post.title}
                  width={960}
                  height={640}
                  className={styles.coverImage}
                  unoptimized
                />
              </div>
              <div className={styles.postBody}>
                <div className={styles.postMeta}>
                  <span>{post.category}</span>
                  <span>{post.publishedAt}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className={styles.coverNote}>{post.coverNote}</div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className={styles.readMore}>
                  {siteCopy.blog.readMoreLabel}
                </span>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
