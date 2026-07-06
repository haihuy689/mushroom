import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublicSiteCopy } from "@/lib/public-site-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { getPublicBlogPosts } from "@/lib/public-blog";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const fallbackCoverImage = "/images/blog/mushroom-care.svg";

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
          <span>{"N\u1ea5m s\u1ea1ch"}</span>
          <strong>{"Ki\u1ebfn th\u1ee9c m\u1ed7i ng\u00e0y"}</strong>
        </div>
      </section>

      <section className={styles.listSection}>
        {blogPosts.length === 0 ? (
          <div className={styles.emptyCard}>
            <p className={styles.eyebrow}>Blog</p>
            <h2>{"Ch\u01b0a c\u00f3 b\u00e0i vi\u1ebft n\u00e0o \u0111\u01b0\u1ee3c xu\u1ea5t b\u1ea3n"}</h2>
            <p>
              {
                "Khi admin \u0111\u0103ng b\u00e0i v\u00e0 b\u1eadt tr\u1ea1ng th\u00e1i hi\u1ec3n th\u1ecb, b\u00e0i vi\u1ebft s\u1ebd xu\u1ea5t hi\u1ec7n t\u1ea1i \u0111\u00e2y."
              }
            </p>
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
                  {"\u0110\u1ecdc b\u00e0i vi\u1ebft"}
                </span>
              </div>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
