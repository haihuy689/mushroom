import styles from "./site-chrome.module.css";

type BrandMarkProps = {
  tagline: string;
};

export function BrandMark({ tagline }: BrandMarkProps) {
  return (
    <span className={styles.brandMark}>
      <span className={styles.brandIcon} aria-hidden="true">
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.4 12.3C5.4 7.8 8.8 4.6 13 4.6C17.2 4.6 20.6 7.8 20.6 12.3H5.4Z"
            fill="#FFF4D2"
          />
          <path
            d="M10.1 12.3H15.9V18.6C15.9 20.4 14.6 21.7 13 21.7C11.4 21.7 10.1 20.4 10.1 18.6V12.3Z"
            fill="#4A6D48"
          />
          <circle cx="9.2" cy="9.6" r="1.1" fill="#A85D29" />
          <circle cx="13" cy="8.2" r="1.1" fill="#A85D29" />
          <circle cx="16.8" cy="9.7" r="1.1" fill="#A85D29" />
        </svg>
      </span>
      <span className={styles.brandCopy}>
        <span className={styles.brandName}>mushroom.pi</span>
        <span className={styles.brandTag}>{tagline}</span>
      </span>
    </span>
  );
}
