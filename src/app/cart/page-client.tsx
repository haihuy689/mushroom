"use client";

import Link from "next/link";
import type { SiteLocale } from "@/lib/i18n";
import type { Product } from "@/lib/pi-types";
import type { StorefrontCopy } from "@/lib/storefront-copy";
import type { SiteCopy } from "@/lib/site-data";
import { PiCommercePanel } from "@/components/pi-commerce-panel";
import { useStorefront } from "@/components/storefront-provider";
import styles from "./page.module.css";

type CartPageClientProps = {
  locale: SiteLocale;
  products: Product[];
  copy: StorefrontCopy;
  piCopy: SiteCopy["piPanel"];
  serverConfigured: boolean;
};

export function CartPageClient({
  locale,
  products,
  copy,
  piCopy,
  serverConfigured,
}: CartPageClientProps) {
  const {
    cartItems,
    clearCart,
    hydrated,
    removeFromCart,
    updateCartQuantity,
  } = useStorefront();

  const catalogById = new Map(products.map((product) => [product.id, product]));

  const cartLines = cartItems.reduce<
    Array<{
      item: { productId: string; quantity: number };
      sourceProduct: Product;
      checkoutProduct: Product;
    }>
  >((lines, item) => {
      const sourceProduct = catalogById.get(item.productId);
      if (!sourceProduct) {
        return lines;
      }

      const totalPi = Number((sourceProduct.pricePi * item.quantity).toFixed(4));

      lines.push({
        item,
        sourceProduct,
        checkoutProduct: {
          ...sourceProduct,
          id: `${sourceProduct.id}::${item.quantity}`,
          sourceProductId: sourceProduct.id,
          quantity: item.quantity,
          name:
            item.quantity > 1
              ? `${sourceProduct.name} x${item.quantity}`
              : sourceProduct.name,
          pricePi: totalPi,
        },
      });

      return lines;
    }, []);

  const totalPi = Number(
    cartLines
      .reduce((sum, entry) => sum + entry.checkoutProduct.pricePi, 0)
      .toFixed(4),
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{copy.cart}</p>
          <h1>{copy.cartTitle}</h1>
          <p className={styles.lead}>{copy.cartLead}</p>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>{copy.total}</span>
          <strong>{totalPi} Pi</strong>
          <span className={styles.summaryMeta}>
            {hydrated
              ? `${cartLines.length} ${copy.linesLabel} / ${cartItems.reduce((sum, item) => sum + item.quantity, 0)} ${copy.itemsLabel}`
              : copy.loading}
          </span>
          {cartLines.length > 0 ? (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => clearCart()}
            >
              {copy.clearCart}
            </button>
          ) : (
            <Link href="/shop" className={styles.primaryLink}>
              {copy.continueShopping}
            </Link>
          )}
        </div>
      </section>

      {!hydrated ? (
        <section className={styles.emptyState}>
          <h2>{copy.loading}</h2>
          <p>{copy.cartLead}</p>
        </section>
      ) : cartLines.length === 0 ? (
        <section className={styles.emptyState}>
          <h2>{copy.emptyCartTitle}</h2>
          <p>{copy.emptyCartBody}</p>
          <Link href="/shop" className={styles.primaryLink}>
            {copy.continueShopping}
          </Link>
        </section>
      ) : (
        <section className={styles.grid}>
          <div className={styles.lineList}>
            {cartLines.map(({ item, sourceProduct }) => (
              <article key={item.productId} className={styles.lineCard}>
                <div className={styles.lineTop}>
                  <div>
                    <span className={styles.lineBadge}>{sourceProduct.badge}</span>
                    <h2>{sourceProduct.name}</h2>
                    <p>{sourceProduct.tagline}</p>
                  </div>

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeFromCart(item.productId)}
                  >
                    {copy.remove}
                  </button>
                </div>

                <div className={styles.lineMeta}>
                  <span>{sourceProduct.category}</span>
                  <span>{sourceProduct.format}</span>
                  <span>{sourceProduct.pricePi} Pi</span>
                </div>

                <div className={styles.lineBottom}>
                  <div className={styles.stepperWrap}>
                    <span>{copy.quantity}</span>
                    <div className={styles.quantityStepper}>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <strong>{item.quantity}</strong>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles.lineTotal}>
                    <span>{copy.lineTotal}</span>
                    <strong>
                      {Number((sourceProduct.pricePi * item.quantity).toFixed(4))} Pi
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.checkoutColumn}>
            <div className={styles.checkoutIntro}>
              <p className={styles.eyebrow}>{copy.cartCheckoutLabel}</p>
              <h2>{copy.cartCheckoutTitle}</h2>
              <p>{copy.cartCheckoutBody}</p>
              <span className={styles.checkoutHint}>{copy.cartCheckoutHint}</span>
            </div>

            <PiCommercePanel
              key={`${locale}-cart`}
              products={cartLines.map((entry) => entry.checkoutProduct)}
              serverConfigured={serverConfigured}
              copy={piCopy}
              compact
              onPaymentCompleted={(product) => {
                removeFromCart(product.sourceProductId ?? product.id);
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
