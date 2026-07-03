export type SiteLocale = "en" | "vi" | "es" | "fr" | "zh";

export const LOCALE_COOKIE_NAME = "mushroom_locale";
export const defaultLocale: SiteLocale = "en";

export const localeOptions = [
  {
    code: "en",
    flag: "\u{1F1FA}\u{1F1F8}",
    label: "English",
    nativeLabel: "English",
  },
  {
    code: "vi",
    flag: "\u{1F1FB}\u{1F1F3}",
    label: "Vietnamese",
    nativeLabel: "Ti\u1ebfng Vi\u1ec7t",
  },
  {
    code: "es",
    flag: "\u{1F1EA}\u{1F1F8}",
    label: "Spanish",
    nativeLabel: "Espa\u00f1ol",
  },
  {
    code: "fr",
    flag: "\u{1F1EB}\u{1F1F7}",
    label: "French",
    nativeLabel: "Fran\u00e7ais",
  },
  {
    code: "zh",
    flag: "\u{1F1E8}\u{1F1F3}",
    label: "Chinese",
    nativeLabel: "\u7b80\u4f53\u4e2d\u6587",
  },
] as const satisfies ReadonlyArray<{
  code: SiteLocale;
  flag: string;
  label: string;
  nativeLabel: string;
}>;

const localeByCode = new Map(localeOptions.map((option) => [option.code, option]));

const countryLocaleMap: Record<string, SiteLocale> = {
  VN: "vi",
  CN: "zh",
  HK: "zh",
  MO: "zh",
  TW: "zh",
  FR: "fr",
  BE: "fr",
  MC: "fr",
  LU: "fr",
  ES: "es",
  MX: "es",
  AR: "es",
  BO: "es",
  CL: "es",
  CO: "es",
  CR: "es",
  CU: "es",
  DO: "es",
  EC: "es",
  GT: "es",
  HN: "es",
  NI: "es",
  PA: "es",
  PE: "es",
  PR: "es",
  PY: "es",
  SV: "es",
  UY: "es",
  VE: "es",
  US: "en",
  GB: "en",
  AU: "en",
  CA: "en",
  IE: "en",
  NZ: "en",
  SG: "en",
  PH: "en",
  IN: "en",
  ZA: "en",
};

export function isSupportedLocale(value: string | null | undefined): value is SiteLocale {
  if (!value) {
    return false;
  }

  return localeByCode.has(value as SiteLocale);
}

export function getLocaleOption(locale: SiteLocale) {
  return localeByCode.get(locale) ?? localeByCode.get(defaultLocale)!;
}

function detectLocaleFromCountry(country?: string | null) {
  if (!country) {
    return null;
  }

  return countryLocaleMap[country.toUpperCase()] ?? null;
}

function detectLocaleFromAcceptLanguage(acceptLanguage?: string | null) {
  if (!acceptLanguage) {
    return null;
  }

  const rankedLanguages = acceptLanguage
    .split(",")
    .map((entry) => {
      const [languageTag, qSegment] = entry.trim().split(";q=");
      const quality = qSegment ? Number(qSegment) : 1;
      return {
        tag: languageTag.toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 1,
      };
    })
    .sort((left, right) => right.quality - left.quality);

  for (const candidate of rankedLanguages) {
    const baseLanguage = candidate.tag.split("-")[0];

    if (isSupportedLocale(baseLanguage)) {
      return baseLanguage;
    }
  }

  return null;
}

export function resolveLocale(options: {
  preferredLocale?: string | null;
  country?: string | null;
  acceptLanguage?: string | null;
}) {
  if (isSupportedLocale(options.preferredLocale)) {
    return options.preferredLocale;
  }

  const countryLocale = detectLocaleFromCountry(options.country);
  if (countryLocale) {
    return countryLocale;
  }

  const headerLocale = detectLocaleFromAcceptLanguage(options.acceptLanguage);
  if (headerLocale) {
    return headerLocale;
  }

  return defaultLocale;
}
