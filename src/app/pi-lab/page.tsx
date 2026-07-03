import type { Metadata } from "next";
import Link from "next/link";
import { getRequestLocale } from "@/lib/request-locale";
import { getSiteCopy } from "@/lib/site-data";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const siteCopy = getSiteCopy(locale);

  return {
    title: siteCopy.metadata.piLabTitle,
    description: siteCopy.metadata.piLabDescription,
  };
}

export default async function PiLabPage() {
  const locale = await getRequestLocale();
  const siteCopy = getSiteCopy(locale);
  const serverConfigured = Boolean(process.env.PI_API_KEY);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{siteCopy.piLab.heroEyebrow}</p>
        <h1>{siteCopy.piLab.heroTitle}</h1>
        <p className={styles.lead}>{siteCopy.piLab.heroLead}</p>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.card}>
          <h2>{siteCopy.piLab.repoStatusTitle}</h2>
          <p>
            Server API Key:{" "}
            <strong>
              {serverConfigured
                ? siteCopy.piLab.serverKeyConfigured
                : siteCopy.piLab.serverKeyPending}
            </strong>
          </p>
          <p>{siteCopy.piLab.repoStatusBody}</p>
        </div>

        <div className={styles.card}>
          <h2>{siteCopy.piLab.setupTitle}</h2>
          <ol className={styles.stepList}>
            {siteCopy.piSetupSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.card}>
        <h2>{siteCopy.piLab.envTitle}</h2>
        <pre className={styles.codeBlock}>{`PI_API_KEY=your_pi_server_api_key
NEXT_PUBLIC_PI_SANDBOX=false
NEXT_PUBLIC_PI_NETWORK_LABEL=Pi Testnet`}</pre>
        <p>{siteCopy.piLab.envBody}</p>
      </section>

      <section className={styles.card}>
        <h2>{siteCopy.piLab.nextTitle}</h2>
        <div className={styles.linkRow}>
          <Link href="/shop" className={styles.cta}>
            {siteCopy.piLab.nextPrimary}
          </Link>
          <Link href="/blog" className={styles.secondary}>
            {siteCopy.piLab.nextSecondary}
          </Link>
        </div>
      </section>
    </div>
  );
}
