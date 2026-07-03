import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/site-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog | Mushroom.Pi",
  description:
    "Editorial writing for Mushroom.Pi, covering mushrooms, brand thinking, and Pi-native commerce.",
};

export default function BlogPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Editorial layer</p>
        <h1>The blog gives Mushroom.Pi more trust, depth, and repeat reasons to visit.</h1>
        <p className={styles.lead}>
          The store may carry most of the business weight, but the journal is
          what stops the brand from feeling like a generic supplement shelf.
          It turns products, routines, and Pi-commerce decisions into a clear
          point of view.
        </p>
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
