import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug, products } from "@/lib/site-data";
import styles from "./page.module.css";

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found | Mushroom.Pi",
    };
  }

  return {
    title: `${post.title} | Mushroom.Pi`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const recommendedProducts = products.slice(0, 2);

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <div className={styles.articleHead}>
          <p className={styles.meta}>
            {post.category} · {post.publishedAt} · {post.readTime}
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
          <span className={styles.asideLabel}>Editorial to commerce</span>
          <p>
            Mushroom.Pi treats content as a support system for the storefront,
            not as a disconnected side project.
          </p>
          <Link href="/shop" className={styles.cta}>
            Explore the shop
          </Link>
        </div>

        <div className={styles.recommendations}>
          <span className={styles.asideLabel}>Related products</span>
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
