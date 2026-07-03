import styles from "./page.module.css";

const featureCards = [
  {
    title: "Forest Mood",
    description:
      "A warm, cinematic landing page with layered gradients, soft glow fields, and a mushroom-inspired art direction.",
  },
  {
    title: "Ship-Ready Stack",
    description:
      "Built with Next.js App Router and structured for fast edits, easy hosting, and a smooth Vercel deploy flow.",
  },
  {
    title: "Small But Intentional",
    description:
      "Clear typography, responsive layout, and a few meaningful animations instead of filler effects or template noise.",
  },
];

const snapshots = [
  "Next.js 16 App Router",
  "TypeScript foundation",
  "Responsive single-page layout",
  "GitHub + Vercel friendly",
];

const timeline = [
  {
    phase: "Seed",
    detail: "Start with a fresh repo and a clean Vercel-ready foundation.",
  },
  {
    phase: "Sprout",
    detail: "Shape the visual identity with custom typography, color, and motion.",
  },
  {
    phase: "Bloom",
    detail: "Publish to GitHub, connect Vercel, and keep iterating from a stable base.",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <span className={styles.orbOne} />
        <span className={styles.orbTwo} />
        <span className={styles.orbThree} />
      </div>

      <section className={styles.hero}>
        <div className={styles.badge}>Forest Lab • July 2026</div>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Mushroom</p>
            <h1>Grow a fresh web project and ship it fast.</h1>
            <p className={styles.lead}>
              Mushroom is a clean starter site with a playful woodland mood,
              ready to live on GitHub and deploy through Vercel without the old
              project baggage.
            </p>

            <div className={styles.actions}>
              <a className={styles.primaryAction} href="#highlights">
                Explore the canopy
              </a>
              <a className={styles.secondaryAction} href="#roadmap">
                See the stack
              </a>
            </div>
          </div>

          <aside className={styles.signalCard}>
            <div className={styles.signalHeader}>
              <span className={styles.signalLabel}>Now Fruiting</span>
              <span className={styles.signalValue}>Ready</span>
            </div>

            <div className={styles.signalMeter} aria-hidden="true">
              <span />
            </div>

            <ul className={styles.snapshotList}>
              {snapshots.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className={styles.section} id="highlights">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Highlights</p>
          <h2>Small surface area, strong first impression.</h2>
        </div>

        <div className={styles.cardGrid}>
          {featureCards.map((card) => (
            <article className={styles.featureCard} key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.storyIntro}>
          <p className={styles.sectionLabel}>Why This Shape</p>
          <h2>
            A fresh repo should feel like a launch pad, not a cleanup job.
          </h2>
        </div>

        <div className={styles.storyPanel}>
          <p>
            This starter leans into clarity: one route, one visual direction,
            one deploy path. That gives us a clean base to add features, pages,
            API routes, or products later without redoing the fundamentals.
          </p>
          <p>
            The current version is intentionally lean, so the first GitHub push
            and Vercel release already look like a real project instead of a
            default scaffold.
          </p>
        </div>
      </section>

      <section className={styles.section} id="roadmap">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Roadmap</p>
          <h2>From fresh folder to public URL.</h2>
        </div>

        <div className={styles.timeline}>
          {timeline.map((item) => (
            <article className={styles.timelineItem} key={item.phase}>
              <span className={styles.timelineDot} aria-hidden="true" />
              <div>
                <h3>{item.phase}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
