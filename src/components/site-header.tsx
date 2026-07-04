import { getOrderCenterCopy } from "@/lib/order-center-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { getNavigationLinks } from "@/lib/site-data";
import { getStorefrontCopy } from "@/lib/storefront-copy";
import { SiteHeaderClient } from "./site-header-client";

export async function SiteHeader() {
  const locale = await getRequestLocale();
  const orderCenterCopy = getOrderCenterCopy(locale);
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
        delivered: orderCenterCopy.delivered,
        guestLabel: storefrontCopy.guestLabel,
        languageAria: storefrontCopy.languageAria,
        latestOrdersTitle: orderCenterCopy.latestOrdersTitle,
        menuGuestHint: orderCenterCopy.menuGuestHint,
        menuNoOrders: orderCenterCopy.menuNoOrders,
        menuSignedInHint: orderCenterCopy.menuSignedInHint,
        orders: orderCenterCopy.orders,
        ordersAria: orderCenterCopy.ordersAria,
        processing: orderCenterCopy.processing,
        shipping: orderCenterCopy.shipping,
        signedInLabel: storefrontCopy.signedInLabel,
        statusSummaryTitle: orderCenterCopy.statusSummaryTitle,
        viewAllOrders: orderCenterCopy.viewAllOrders,
      }}
    />
  );
}
