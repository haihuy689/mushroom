import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans } from "next/font/google";
import { LocalePersistence } from "@/components/locale-persistence";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StorefrontProvider } from "@/components/storefront-provider";
import { getPublicSiteCopy } from "@/lib/public-site-copy";
import { getRequestLocale } from "@/lib/request-locale";
import "./globals.css";

const bodyFont = Noto_Sans({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const siteCopy = getPublicSiteCopy(locale);

  return {
    title: siteCopy.metadata.rootTitle,
    description: siteCopy.metadata.rootDescription,
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} className={bodyFont.variable}>
      <body>
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="lazyOnload"
        />
        <StorefrontProvider>
          <LocalePersistence currentLocale={locale} />
          <div className="site-shell">
            <SiteHeader />
            <main className="site-main">{children}</main>
            <SiteFooter />
          </div>
        </StorefrontProvider>
      </body>
    </html>
  );
}
