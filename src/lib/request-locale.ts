import { cache } from "react";
import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE_NAME, getLocaleOption, resolveLocale } from "@/lib/i18n";

export const getRequestLocale = cache(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();

  return resolveLocale({
    preferredLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value,
    country: headersList.get("x-vercel-ip-country"),
    acceptLanguage: headersList.get("accept-language"),
  });
});

export const getRequestLocaleOption = cache(async () => {
  const locale = await getRequestLocale();
  return getLocaleOption(locale);
});
