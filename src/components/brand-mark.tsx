import { MushroomLogoMark } from "./brand-icons";
import styles from "./site-chrome.module.css";

type BrandMarkProps = {
  tagline: string;
};

export function BrandMark({ tagline }: BrandMarkProps) {
  return (
    <span className={styles.brandMark}>
      <span className={styles.brandIcon} aria-hidden="true">
        <MushroomLogoMark className={styles.brandIconSvg} />
      </span>
      <span className={styles.brandCopy}>
        <span className={styles.brandName}>mushroom.pi</span>
        <span className={styles.brandTag}>{tagline}</span>
      </span>
    </span>
  );
}
