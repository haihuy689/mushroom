import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  BenefitIcon,
  PiNetworkIcon,
  type BenefitIconName,
} from "@/components/brand-icons";
import { ProductThumbnail } from "@/components/product-thumbnail";
import { getPublicSiteCopy } from "@/lib/public-site-copy";
import { getRequestLocale } from "@/lib/request-locale";
import { getStorefrontProducts } from "@/lib/storefront-catalog";
import { getStorefrontCopy } from "@/lib/storefront-copy";
import type { SiteLocale } from "@/lib/i18n";
import type { Product } from "@/lib/pi-types";
import styles from "./page.module.css";

type HomeThemeCopy = {
  bannerAction: string;
  bannerLead: string;
  bannerTitle: string;
  benefits: Array<{ label: string; tone: "green" | "pi" }>;
  featuredViewAll: string;
  heroEyebrow: string;
  heroLead: string;
  heroTitle: string;
  primaryAction: string;
  reasonsLabel: string;
  secondaryAction: string;
  steps: Array<{ description: string; title: string }>;
  stepsTitle: string;
};

function getHomeThemeCopy(locale: SiteLocale, siteCopy: ReturnType<typeof getPublicSiteCopy>) {
  const localized: Partial<Record<SiteLocale, HomeThemeCopy>> = {
    en: {
      bannerAction: "Open in Pi Browser",
      bannerLead: "Shop safely and quickly with the Pi community.",
      bannerTitle: "Smooth experience in Pi Browser",
      benefits: [
        { label: "100% natural", tone: "green" },
        { label: "Fast delivery", tone: "green" },
        { label: "Pay with Pi", tone: "pi" },
        { label: "Food safety", tone: "green" },
      ],
      featuredViewAll: "View all",
      heroEyebrow: "Mushroom.Pi",
      heroLead:
        "Fresh mushrooms, dried mushrooms, and mushroom products that are tasty, nutritious, and safe for your health.",
      heroTitle: "Clean mushrooms paid with Pi",
      primaryAction: "Buy with Pi",
      reasonsLabel: "Why choose Mushroom.Pi",
      secondaryAction: "View products",
      steps: [
        { title: "Choose products", description: "Add items to your cart" },
        { title: "Pay with Pi", description: "Confirm and pay with Pi" },
        { title: "Confirm order", description: "We pack and deliver to you" },
      ],
      stepsTitle: "3 steps to pay with Pi",
    },
    vi: {
      bannerAction: "Mở trong Pi Browser",
      bannerLead: "Mua sắm an toàn, nhanh chóng với cộng đồng Pi.",
      bannerTitle: "Trải nghiệm mượt mà trên Pi Browser",
      benefits: [
        { label: "100% tự nhiên", tone: "green" },
        { label: "Giao hàng nhanh", tone: "green" },
        { label: "Thanh toán bằng Pi", tone: "pi" },
        { label: "An toàn thực phẩm", tone: "green" },
      ],
      featuredViewAll: "Xem tất cả",
      heroEyebrow: "Mushroom.Pi",
      heroLead:
        "Cung cấp nấm tươi, nấm khô và sản phẩm từ nấm - tươi ngon, dinh dưỡng, an toàn cho sức khỏe.",
      heroTitle: "Nấm sạch\nthanh toán bằng Pi",
      primaryAction: "Mua bằng Pi",
      reasonsLabel: "Vì sao chọn Mushroom.Pi",
      secondaryAction: "Xem sản phẩm",
      steps: [
        { title: "Chọn sản phẩm", description: "Thêm vào giỏ hàng" },
        { title: "Thanh toán bằng Pi", description: "Xác nhận và thanh toán bằng Pi" },
        { title: "Xác nhận đơn hàng", description: "Chúng tôi đóng gói và giao hàng đến bạn" },
      ],
      stepsTitle: "3 bước thanh toán bằng Pi",
    },
    es: {
      bannerAction: "Abrir en Pi Browser",
      bannerLead: "Compra de forma segura y rapida con la comunidad Pi.",
      bannerTitle: "Experiencia fluida en Pi Browser",
      benefits: [
        { label: "100% natural", tone: "green" },
        { label: "Entrega rapida", tone: "green" },
        { label: "Pago con Pi", tone: "pi" },
        { label: "Seguridad alimentaria", tone: "green" },
      ],
      featuredViewAll: "Ver todo",
      heroEyebrow: "Mushroom.Pi",
      heroLead:
        "Hongos frescos, hongos secos y productos de hongos: sabrosos, nutritivos y seguros para tu salud.",
      heroTitle: "Hongos limpios pagados con Pi",
      primaryAction: "Comprar con Pi",
      reasonsLabel: "Por que elegir Mushroom.Pi",
      secondaryAction: "Ver productos",
      steps: [
        { title: "Elige productos", description: "Agrega al carrito" },
        { title: "Paga con Pi", description: "Confirma y paga con Pi" },
        { title: "Confirma el pedido", description: "Empacamos y entregamos" },
      ],
      stepsTitle: "3 pasos para pagar con Pi",
    },
    fr: {
      bannerAction: "Ouvrir dans Pi Browser",
      bannerLead: "Achetez vite et en securite avec la communaute Pi.",
      bannerTitle: "Experience fluide dans Pi Browser",
      benefits: [
        { label: "100% naturel", tone: "green" },
        { label: "Livraison rapide", tone: "green" },
        { label: "Paiement en Pi", tone: "pi" },
        { label: "Securite alimentaire", tone: "green" },
      ],
      featuredViewAll: "Voir tout",
      heroEyebrow: "Mushroom.Pi",
      heroLead:
        "Champignons frais, champignons secs et produits a base de champignons: bons, nutritifs et surs pour votre sante.",
      heroTitle: "Champignons propres payes en Pi",
      primaryAction: "Acheter avec Pi",
      reasonsLabel: "Pourquoi choisir Mushroom.Pi",
      secondaryAction: "Voir les produits",
      steps: [
        { title: "Choisir les produits", description: "Ajouter au panier" },
        { title: "Payer en Pi", description: "Confirmer et payer en Pi" },
        { title: "Confirmer la commande", description: "Nous preparons et livrons" },
      ],
      stepsTitle: "3 etapes pour payer en Pi",
    },
    zh: {
      bannerAction: "在 Pi Browser 打开",
      bannerLead: "为 Pi 社区提供安全、快捷的购物体验。",
      bannerTitle: "在 Pi Browser 中顺畅购物",
      benefits: [
        { label: "100% 天然", tone: "green" },
        { label: "快速配送", tone: "green" },
        { label: "使用 Pi 支付", tone: "pi" },
        { label: "食品安全", tone: "green" },
      ],
      featuredViewAll: "查看全部",
      heroEyebrow: "Mushroom.Pi",
      heroLead:
        "提供鲜菇、干菇和蘑菇制品，口感新鲜、营养丰富，也更安心。",
      heroTitle: "干净蘑菇 使用 Pi 支付",
      primaryAction: "用 Pi 购买",
      reasonsLabel: "为什么选择 Mushroom.Pi",
      secondaryAction: "查看产品",
      steps: [
        { title: "选择产品", description: "加入购物车" },
        { title: "使用 Pi 支付", description: "确认并用 Pi 支付" },
        { title: "确认订单", description: "我们打包并配送给你" },
      ],
      stepsTitle: "使用 Pi 支付的 3 个步骤",
    },
  };

  return (
    localized[locale] ?? {
      bannerAction: siteCopy.home.bannerAction ?? "Open in Pi Browser",
      bannerLead:
        siteCopy.home.bannerLead ??
        "A smoother shopping flow for Pi community members.",
      bannerTitle:
        siteCopy.home.bannerTitle ?? "Smooth experience in Pi Browser",
      benefits:
        siteCopy.home.benefits ??
        [
          { label: "100% natural", tone: "green" },
          { label: "Fast delivery", tone: "green" },
          { label: "Pay with Pi", tone: "pi" },
          { label: "Food safety", tone: "green" },
        ],
      featuredViewAll: siteCopy.home.featuredViewAll ?? "View all",
      heroEyebrow: siteCopy.home.heroEyebrow,
      heroLead: siteCopy.home.heroLead,
      heroTitle: siteCopy.home.heroTitle,
      primaryAction: siteCopy.home.primaryAction,
      reasonsLabel: siteCopy.home.pillarsLabel,
      secondaryAction: siteCopy.home.secondaryAction,
      steps:
        siteCopy.home.steps ??
        [
          { title: "Choose products", description: "Add items to cart" },
          { title: "Pay with Pi", description: "Confirm and pay with Pi" },
          { title: "Confirm order", description: "We prepare and deliver" },
        ],
      stepsTitle: "3 steps to pay with Pi",
    }
  );
}

function renderPiTitle(title: string) {
  return title.split("\n").map((line, index) => {
    const piIndex = line.lastIndexOf("Pi");

    return (
      <Fragment key={`${line}-${index}`}>
        {index > 0 ? <br /> : null}
        {piIndex < 0 ? (
          line
        ) : (
          <>
            {line.slice(0, piIndex)}
            <strong>{line.slice(piIndex, piIndex + 2)}</strong>
            {line.slice(piIndex + 2)}
          </>
        )}
      </Fragment>
    );
  });
}

function FeatureIcon({
  name,
  tone,
}: {
  name: BenefitIconName;
  tone: "green" | "pi";
}) {
  return (
    <span className={styles.featureIcon} data-tone={tone} aria-hidden="true">
      <BenefitIcon className={styles.featureIconSvg} name={name} />
    </span>
  );
}

const soldLabels: Record<SiteLocale, string> = {
  en: "Sold",
  es: "Vendidos",
  fr: "Vendus",
  vi: "Đã bán",
  zh: "已售",
};

const emptyFeaturedLabels: Record<SiteLocale, string> = {
  en: "Featured products are being updated.",
  es: "Los productos destacados se están actualizando.",
  fr: "Les produits en vedette sont en cours de mise à jour.",
  vi: "Sản phẩm nổi bật đang được cập nhật.",
  zh: "精选商品正在更新。",
};

function getDisplayedSoldCount(product: Product) {
  const baseSoldCount =
    typeof product.baseSoldCount === "number" ? product.baseSoldCount : 0;
  const actualSoldCount =
    typeof product.actualSoldCount === "number" ? product.actualSoldCount : 0;

  return Math.max(0, Math.round(baseSoldCount + actualSoldCount));
}

export default async function Home() {
  const locale = await getRequestLocale();
  const siteCopy = getPublicSiteCopy(locale);
  const storefrontCopy = getStorefrontCopy(locale);
  const products = await getStorefrontProducts(locale);
  const featuredProducts = products
    .filter((product) => product.isFeatured === true)
    .slice(0, 4);
  const homeCopy = getHomeThemeCopy(locale, siteCopy);
  const benefitIcons: BenefitIconName[] = ["leaf", "truck", "pi", "shield"];
  const stepIcons: BenefitIconName[] = ["basket", "pi", "checklist"];
  const reasonIcons: BenefitIconName[] = ["leaf", "gear", "community"];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroImageWrap} aria-hidden="true">
          <Image
            alt=""
            className={styles.heroImage}
            fill
            priority
            sizes="(max-width: 860px) 100vw, 980px"
            src="/images/mushroom-pi/hero-market.webp"
          />
        </div>

        <div className={styles.heroCopy}>
          <h1>{renderPiTitle(homeCopy.heroTitle)}</h1>
          <p className={styles.lead}>{homeCopy.heroLead}</p>

          <div className={styles.actions}>
            <Link href="/shop" className={styles.primaryAction}>
              <span className={styles.piCoin}>
                <PiNetworkIcon className={styles.piCoinSvg} />
              </span>
              {homeCopy.primaryAction}
            </Link>
            <Link href="/shop" className={styles.secondaryAction}>
              {homeCopy.secondaryAction}
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.benefitStrip} aria-label={siteCopy.home.overviewLabel}>
        {homeCopy.benefits.map((benefit, index) => (
          <article key={benefit.label} className={styles.benefitItem}>
            <FeatureIcon name={benefitIcons[index] ?? "leaf"} tone={benefit.tone} />
            <strong>{benefit.label}</strong>
          </article>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionLabel}>{siteCopy.home.storefrontLabel}</p>
            <h2>{siteCopy.home.storefrontTitle}</h2>
          </div>
          <Link href="/shop" className={styles.viewAllLink}>
            {homeCopy.featuredViewAll}
          </Link>
        </div>

        <div className={styles.productGrid}>
          {featuredProducts.map((product) => (
            <article key={product.id} className={styles.productCard}>
              <ProductThumbnail
                accent={product.accent}
                imageUrl={product.imageUrl}
                name={product.name}
                productId={product.id}
              />
              <div className={styles.productInfo}>
                <span className={styles.productBadge}>{product.badge}</span>
                <h3>{product.name}</h3>
                <p>{product.tagline}</p>
                <strong>{product.pricePi} Pi</strong>
                <span className={styles.productTrust}>
                  {soldLabels[locale] ?? soldLabels.en}{" "}
                  {getDisplayedSoldCount(product).toLocaleString(locale)}
                </span>
                <div className={styles.productActions}>
                  <AddToCartButton
                    addLabel={storefrontCopy.addToCart}
                    addedLabel={storefrontCopy.addedToCart}
                    cancelLabel={storefrontCopy.quantityPickerCancel}
                    confirmLabel={storefrontCopy.quantityPickerConfirm}
                    disabled={(product.inventoryCount ?? 0) <= 0}
                    disabledLabel={storefrontCopy.outOfStock}
                    fullWidth
                    lead={storefrontCopy.quantityPickerLead}
                    maxQuantity={product.inventoryCount ?? 0}
                    pricePi={product.pricePi}
                    productId={product.id}
                    productName={product.name}
                    quantityLabel={storefrontCopy.quantity}
                    title={storefrontCopy.quantityPickerTitle}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {featuredProducts.length === 0 ? (
          <p className={styles.emptyProducts}>
            {emptyFeaturedLabels[locale] ?? emptyFeaturedLabels.en}
          </p>
        ) : null}
      </section>

      <section className={styles.stepsSection}>
        <div className={styles.sectionHeading}>
          <div className={styles.stepsHeadingTitle}>
            <PiNetworkIcon className={styles.stepsHeadingIcon} />
            <h2>{homeCopy.stepsTitle}</h2>
          </div>
        </div>

        <div className={styles.stepGrid}>
          {homeCopy.steps.map((step, index) => (
            <article key={step.title} className={styles.stepCard}>
              <FeatureIcon
                name={stepIcons[index] ?? "basket"}
                tone={index === 1 ? "pi" : "green"}
              />
              <span className={styles.stepNumber}>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.reasonSection}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionLabel}>{homeCopy.reasonsLabel}</p>
            <h2>{siteCopy.home.pillarsTitle}</h2>
          </div>
        </div>

        <div className={styles.reasonGrid}>
          {siteCopy.brandPillars.map((pillar, index) => (
            <article key={pillar.title} className={styles.reasonCard}>
              <FeatureIcon name={reasonIcons[index] ?? "leaf"} tone="green" />
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.browserBanner}>
        <span className={styles.piAppIcon} aria-hidden="true">
          <PiNetworkIcon className={styles.piAppIconSvg} />
        </span>
        <div>
          <h2>{homeCopy.bannerTitle}</h2>
          <p>{homeCopy.bannerLead}</p>
          <Link href="/shop" className={styles.bannerAction}>
            {homeCopy.bannerAction}
          </Link>
        </div>
      </section>
    </div>
  );
}
