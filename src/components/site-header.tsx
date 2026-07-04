import { getRequestLocale } from "@/lib/request-locale";
import { getNavigationLinks } from "@/lib/site-data";
import { getStorefrontCopy } from "@/lib/storefront-copy";
import { SiteHeaderClient } from "./site-header-client";

export async function SiteHeader() {
  const locale = await getRequestLocale();
  const storefrontCopy = getStorefrontCopy(locale);
  const navigationLinks = getNavigationLinks(locale).filter(
    (link) => link.href === "/shop" || link.href === "/blog",
  );

  return (
    <SiteHeaderClient
      locale={locale}
      navigationLinks={navigationLinks}
      copy={{
        account: storefrontCopy.account,
        accountAria: storefrontCopy.accountAria,
        brandSlogan: storefrontCopy.brandSlogan,
        cart: storefrontCopy.cart,
        cartAria: storefrontCopy.cartAria,
        guestLabel: storefrontCopy.guestLabel,
        languageAria: storefrontCopy.languageAria,
        signedInLabel: storefrontCopy.signedInLabel,
      }}
    />
  );
}
