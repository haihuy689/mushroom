"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteLocale } from "@/lib/i18n";
import { localeOptions } from "@/lib/i18n";
import styles from "./site-chrome.module.css";

type LanguageSwitcherProps = {
  currentLocale: SiteLocale;
};

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [pendingLocale, setPendingLocale] = useState<SiteLocale | null>(null);
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const currentOption =
    localeOptions.find((option) => option.code === currentLocale) ??
    localeOptions[0];

  const selectLocale = async (locale: SiteLocale) => {
    if (locale === currentLocale) {
      detailsRef.current?.removeAttribute("open");
      return;
    }

    setPendingLocale(locale);

    try {
      await fetch("/api/preferences/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale }),
      });

      detailsRef.current?.removeAttribute("open");
      router.refresh();
    } finally {
      setPendingLocale(null);
    }
  };

  return (
    <details ref={detailsRef} className={styles.languageMenu}>
      <summary
        className={styles.languageTrigger}
        aria-label={`Current language: ${currentOption.nativeLabel}`}
      >
        <span className={styles.languageFlag}>{currentOption.flag}</span>
        <span className={styles.languageCode}>
          {currentOption.code.toUpperCase()}
        </span>
      </summary>

      <div className={styles.languagePopover}>
        {localeOptions.map((option) => (
          <button
            key={option.code}
            type="button"
            className={styles.languageOption}
            onClick={() => selectLocale(option.code)}
            disabled={pendingLocale !== null}
          >
            <span className={styles.languageFlag}>{option.flag}</span>
            <span className={styles.languageText}>
              <strong>{option.nativeLabel}</strong>
              <span>{option.label}</span>
            </span>
          </button>
        ))}
      </div>
    </details>
  );
}
