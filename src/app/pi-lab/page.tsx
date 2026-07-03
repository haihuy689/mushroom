import type { Metadata } from "next";
import Link from "next/link";
import { piSetupSteps } from "@/lib/site-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Pi Lab | Mushroom.Pi",
  description:
    "Setup notes for Pi Browser, Pi Sandbox, and Test-Pi payment flow inside Mushroom.Pi.",
};

export default function PiLabPage() {
  const serverConfigured = Boolean(process.env.PI_API_KEY);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Pi lab</p>
        <h1>This is the operating surface for Pi Browser, Pi Sandbox, and Test-Pi checkout.</h1>
        <p className={styles.lead}>
          The site now includes a frontend auth flow, server-side verification
          against `/me`, and payment approval/completion endpoints. The missing
          piece for live testing is the real Server API Key from the Pi
          Developer Portal.
        </p>
      </section>

      <section className={styles.gridSection}>
        <div className={styles.card}>
          <h2>Current repo status</h2>
          <p>
            Server API Key:{" "}
            <strong>{serverConfigured ? "configured" : "not configured yet"}</strong>
          </p>
          <p>
            Sandbox flag comes from `NEXT_PUBLIC_PI_SANDBOX`, while the real app
            network should be chosen in the Pi Developer Portal when you create
            the Mushroom.Pi project.
          </p>
        </div>

        <div className={styles.card}>
          <h2>Setup checklist</h2>
          <ol className={styles.stepList}>
            {piSetupSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.card}>
        <h2>Environment variables</h2>
        <pre className={styles.codeBlock}>{`PI_API_KEY=your_pi_server_api_key
NEXT_PUBLIC_PI_SANDBOX=false
NEXT_PUBLIC_PI_NETWORK_LABEL=Pi Testnet`}</pre>
        <p>
          If you want local desktop sandbox testing, set
          `NEXT_PUBLIC_PI_SANDBOX=true` in your local environment and run the
          app through the Pi Sandbox flow.
        </p>
      </section>

      <section className={styles.card}>
        <h2>Where to continue next</h2>
        <div className={styles.linkRow}>
          <Link href="/shop" className={styles.cta}>
            Test storefront flow
          </Link>
          <Link href="/blog" className={styles.secondary}>
            Review editorial layer
          </Link>
        </div>
      </section>
    </div>
  );
}
