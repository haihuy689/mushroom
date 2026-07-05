"use client";

import { useEffect } from "react";
import type { SiteLocale } from "@/lib/i18n";
import { LOCALE_COOKIE_NAME, isSupportedLocale } from "@/lib/i18n";

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
    // Some embedded browsers can restrict storage. The URL locale remains the fallback.
  }
}

function getRememberedLocale() {
  try {
    const localLocale = window.localStorage.getItem(LOCALE_COOKIE_NAME);
    const sessionLocale = window.sessionStorage.getItem(LOCALE_COOKIE_NAME);

    if (isSupportedLocale(localLocale)) {
      return localLocale;
    }

    if (isSupportedLocale(sessionLocale)) {
      return sessionLocale;
    }
  } catch {
    return null;
  }

  return null;
}

type LocalePersistenceProps = {
  currentLocale: SiteLocale;
};

export function LocalePersistence({ currentLocale }: LocalePersistenceProps) {
  useEffect(() => {
    const url = new URL(window.location.href);
    const urlLocale = url.searchParams.get("locale");

    if (isSupportedLocale(urlLocale)) {
      rememberLocale(urlLocale);
      return;
    }

    const rememberedLocale = getRememberedLocale();

    if (rememberedLocale && rememberedLocale !== currentLocale) {
      url.searchParams.set("locale", rememberedLocale);
      window.location.replace(`${url.pathname}${url.search}${url.hash}`);
    }
  }, [currentLocale]);

  return null;
}
