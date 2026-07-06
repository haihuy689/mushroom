import type { Metadata } from "next";
import Link from "next/link";
import { getPublicSiteCopy } from "@/lib/public-site-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { getPublicBlogPosts } from "@/lib/public-blog";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

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
        <p className={styles.eyebrow}>{siteCopy.blog.heroEyebrow}</p>
        <h1>{siteCopy.blog.heroTitle}</h1>
        <p className={styles.lead}>{siteCopy.blog.heroLead}</p>
      </section>

      <section className={styles.listSection}>
        {blogPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
            <div className={styles.postMeta}>
              <span>{post.category}</span>
              <span>{post.publishedAt}</span>
              <span>{post.readTime}</span>
            </div>
            <div className={styles.coverNote}>{post.coverNote}</div>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
