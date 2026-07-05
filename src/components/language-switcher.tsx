"use client";

import { useRef, useState } from "react";
import type { SiteLocale } from "@/lib/i18n";
import {
  LOCALE_COOKIE_NAME,
  getLocaleOption,
  localeOptions,
} from "@/lib/i18n";
import styles from "./site-chrome.module.css";

type LanguageSwitcherProps = {
  currentLocale: SiteLocale;
  compact?: boolean;
  ariaLabel?: string;
};

function FlagChip({ locale }: { locale: SiteLocale }) {
  const option = getLocaleOption(locale);

  return (
    <span className={styles.flagEmoji} aria-hidden="true">
      {option.flag}
    </span>
  );
}

function writeLocaleCookie(locale: SiteLocale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
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
    detailsRef.current?.removeAttribute("open");
    writeLocaleCookie(locale);

    try {
      const response = await fetch("/api/preferences/locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale }),
        cache: "no-store",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("Unable to save locale preference.");
      }

      window.location.reload();
    } catch {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      const searchParams = new URLSearchParams({
        locale,
        returnTo,
      });

      window.location.assign(
        `/api/preferences/locale?${searchParams.toString()}`,
      );
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
