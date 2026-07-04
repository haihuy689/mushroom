"use client";

import { useRef, useState } from "react";
import type { SiteLocale } from "@/lib/i18n";
import { localeOptions } from "@/lib/i18n";
import styles from "./site-chrome.module.css";

type LanguageSwitcherProps = {
  currentLocale: SiteLocale;
  compact?: boolean;
  ariaLabel?: string;
};

function FlagChip({ locale }: { locale: SiteLocale }) {
  return (
    <span
      className={styles.languageFlag}
      data-locale={locale}
      aria-hidden="true"
    />
  );
}

export function LanguageSwitcher({
  currentLocale,
  compact = false,
  ariaLabel,
}: LanguageSwitcherProps) {
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
      const response = await fetch("/api/preferences/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale }),
      });

      if (!response.ok) {
        throw new Error("Unable to update locale.");
      }

      detailsRef.current?.removeAttribute("open");
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setPendingLocale(null);
    }
  };

  return (
    <details ref={detailsRef} className={styles.languageMenu}>
      <summary
        className={styles.languageTrigger}
        data-compact={compact}
        aria-label={
          ariaLabel ?? `Current language: ${currentOption.nativeLabel}`
        }
      >
        <FlagChip locale={currentOption.code} />
        {compact ? null : (
          <span className={styles.languageCode}>
            {currentOption.code.toUpperCase()}
          </span>
        )}
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
            <FlagChip locale={option.code} />
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
