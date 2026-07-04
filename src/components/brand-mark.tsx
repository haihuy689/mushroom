import Image from "next/image";
import styles from "./site-chrome.module.css";

type BrandMarkProps = {
  tagline: string;
};

export function BrandMark({ tagline }: BrandMarkProps) {
  return (
    <span
      aria-label={`mushroom.pi - ${tagline}`}
      className={styles.brandMark}
    >
      <Image
        alt=""
        aria-hidden="true"
        className={styles.brandLogoImage}
        height={226}
        priority
        src="/images/brand/mushroom-pi-logo.png"
        width={900}
      />
    </span>
  );
}
