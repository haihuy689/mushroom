"use client";

import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { SiteLocale } from "@/lib/i18n";
import {
  LOCALE_COOKIE_NAME,
  localeOptions,
} from "@/lib/i18n";
import styles from "./site-chrome.module.css";

type LanguageSwitcherProps = {
  currentLocale: SiteLocale;
  compact?: boolean;
  ariaLabel?: string;
};

function FlagChip({ locale }: { locale: SiteLocale }) {
  return (
    <span className={styles.flagIcon} data-locale={locale} aria-hidden="true" />
  );
}

function writeLocaleCookie(locale: SiteLocale) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

function rememberLocale(locale: SiteLocale) {
  writeLocaleCookie(locale);

  try {
    window.localStorage.setItem(LOCALE_COOKIE_NAME, locale);
    window.sessionStorage.setItem(LOCALE_COOKIE_NAME, locale);
  } catch {
    // Pi Browser may restrict one storage layer, so URL locale remains the fallback.
  }
}

export function LanguageSwitcher({
  currentLocale,
  compact = false,
  ariaLabel,
}: LanguageSwitcherProps) {
  const [pendingLocale, setPendingLocale] = useState<SiteLocale | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const currentOption =
    localeOptions.find((option) => option.code === currentLocale) ??
    localeOptions[0];

  useEffect(() => {
    function closeWhenClickingOutside(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeWhenClickingOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeWhenClickingOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const getLocalePageUrl = (locale: SiteLocale) => {
    if (typeof window === "undefined") {
      return `/?locale=${locale}`;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("locale", locale);
    return `${url.pathname}${url.search}${url.hash}`;
  };

  const selectLocale = (
    event: MouseEvent<HTMLAnchorElement>,
    locale: SiteLocale,
  ) => {
    if (pendingLocale !== null || locale === currentLocale) {
      event.preventDefault();
      setIsOpen(false);
      return;
    }

    event.preventDefault();
    setPendingLocale(locale);
    setIsOpen(false);
    rememberLocale(locale);
    window.location.assign(getLocalePageUrl(locale));
  };

  return (
    <div ref={menuRef} className={styles.languageMenu} data-open={isOpen}>
      <button
        type="button"
        className={styles.languageTrigger}
        data-compact={compact}
        aria-expanded={isOpen}
        aria-label={
          ariaLabel ?? `Current language: ${currentOption.nativeLabel}`
        }
        onClick={() => setIsOpen((open) => !open)}
      >
        <FlagChip locale={currentOption.code} />
        {compact ? null : (
          <span className={styles.languageCode}>
            {currentOption.code.toUpperCase()}
          </span>
        )}
      </button>

      {isOpen ? (
        <div className={styles.languagePopover}>
          {localeOptions.map((option) => (
            <a
              key={option.code}
              href={`/?locale=${option.code}`}
              className={styles.languageOption}
              aria-current={option.code === currentLocale ? "true" : undefined}
              aria-disabled={pendingLocale !== null}
              onClick={(event) => selectLocale(event, option.code)}
            >
              <FlagChip locale={option.code} />
              <span className={styles.languageText}>
                <strong>{option.nativeLabel}</strong>
                <span>{option.label}</span>
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
