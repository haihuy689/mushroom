import { getPublicSiteCopy } from "@/lib/public-site-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { getStorefrontCopy } from "@/lib/storefront-copy";
import { BrandMark } from "./brand-mark";
import styles from "./site-chrome.module.css";

export async function SiteFooter() {
  const locale = await getRequestLocale();
  const siteCopy = getPublicSiteCopy(locale);
  const storefrontCopy = getStorefrontCopy(locale);

  return (
    <footer className={styles.footerWrap}>
      <div className={styles.footerInner}>
        <div className={styles.footerCard}>
          <div className={styles.footerTop}>
            <div>
              <BrandMark tagline={storefrontCopy.brandSlogan} />
              <p className={styles.footerCopy}>{siteCopy.footerCopy}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
