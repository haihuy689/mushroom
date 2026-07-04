"use client";

import Link from "next/link";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { CartCheckoutCard } from "@/components/cart-checkout-card";
import { ProductThumbnail } from "@/components/product-thumbnail";
import {
  useStorefront,
  type StorefrontAddress,
} from "@/components/storefront-provider";
import type { Product } from "@/lib/pi-types";
import type { PiCheckoutCopy } from "@/lib/public-site-copy";
import { formatProductWeight } from "@/lib/storefront-product";
import type { StorefrontCopy } from "@/lib/storefront-copy";
import styles from "./page.module.css";

type CartPageClientProps = {
  copy: StorefrontCopy;
  products: Product[];
  piCopy: PiCheckoutCopy;
  serverConfigured: boolean;
};

type AddressFormState = {
  city: string;
  country: string;
  district: string;
  fullName: string;
  isDefault: boolean;
  line1: string;
  line2: string;
  note: string;
  phone: string;
  ward: string;
};

const initialAddressForm: AddressFormState = {
  city: "",
  country: "Vietnam",
  district: "",
  fullName: "",
  isDefault: true,
  line1: "",
  line2: "",
  note: "",
  phone: "",
  ward: "",
};

function formatAddress(address: StorefrontAddress) {
  return [
    address.line1,
    address.line2,
    address.ward,
    address.district,
    address.city,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function CartPageClient({
  copy,
  products,
  piCopy,
  serverConfigured,
}: CartPageClientProps) {
  const {
    addresses,
    cartItems,
    clearCart,
    hydrated,
    removeFromCart,
    saveAddress,
    setDefaultAddress,
    updateCartQuantity,
  } = useStorefront();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [formState, setFormState] = useState<AddressFormState>(initialAddressForm);

  const catalogById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const cartLines = useMemo(
    () =>
      cartItems.reduce<
        Array<{
          item: { productId: string; quantity: number };
          lineTotalPi: number;
          product: Product;
        }>
      >((lines, item) => {
        const product = catalogById.get(item.productId);
        if (!product) {
          return lines;
        }

        lines.push({
          item,
          lineTotalPi: Number((product.pricePi * item.quantity).toFixed(4)),
          product,
        });

        return lines;
      }, []),
    [cartItems, catalogById],
  );

  const totalPi = Number(
    cartLines.reduce((sum, line) => sum + line.lineTotalPi, 0).toFixed(4),
  );
  const totalItems = cartLines.reduce((sum, line) => sum + line.item.quantity, 0);
  const hasInventoryIssue = cartLines.some(({ item, product }) => {
    const availableInventory = product.inventoryCount ?? 0;

    return availableInventory <= 0 || item.quantity > availableInventory;
  });
  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
  const selectedAddress =
    addresses.find((address) => address.id === selectedAddressId) ?? defaultAddress;

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = event.target;
    const { name } = target;

    setFormState((current) => ({
      ...current,
      [name]:
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : target.value,
    }));
  };

  const handleAddressSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextId = saveAddress({
      city: formState.city,
      country: formState.country,
      district: formState.district,
      fullName: formState.fullName,
      line1: formState.line1,
      line2: formState.line2,
      note: formState.note,
      phone: formState.phone,
      ward: formState.ward,
      isDefault: addresses.length === 0 || formState.isDefault,
    });

    setSelectedAddressId(nextId);
    setFormState({
      ...initialAddressForm,
      country: formState.country || initialAddressForm.country,
      isDefault: false,
    });
  };

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
              ? `${cartLines.length} ${copy.linesLabel} / ${totalItems} ${copy.itemsLabel}`
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
        <section className={styles.layout}>
          <div className={styles.leftColumn}>
            <article className={styles.sectionCard}>
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.sectionLabel}>{copy.cart}</p>
                  <h2>{copy.cartSummaryTitle}</h2>
                </div>
                <span className={styles.lineCount}>
                  {cartLines.length} {copy.linesLabel}
                </span>
              </div>

              <div className={styles.lineList}>
                {cartLines.map(({ item, lineTotalPi, product }) => {
                  const availableInventory = product.inventoryCount ?? 0;
                  const productWeight = formatProductWeight(product);
                  const stockText =
                    availableInventory > 0
                      ? `${copy.inventoryLabel}: ${availableInventory}`
                      : copy.outOfStock;

                  return (
                    <article key={item.productId} className={styles.lineCard}>
                      <ProductThumbnail
                        accent={product.accent}
                        compact
                        imageUrl={product.imageUrl}
                        name={product.name}
                        productId={product.id}
                      />

                      <div className={styles.lineContent}>
                        <div className={styles.lineHeader}>
                          <div className={styles.lineTitle}>
                            <h3>{product.name}</h3>
                            <p>{product.tagline}</p>
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
                          <span>{product.category}</span>
                          <span>{product.packaging || product.format}</span>
                          {productWeight ? <span>{productWeight}</span> : null}
                          <span>{product.pricePi} Pi</span>
                          <span
                            className={styles.stockMeta}
                            data-stocked={availableInventory > 0}
                          >
                            {stockText}
                          </span>
                        </div>

                        <div className={styles.lineFooter}>
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
                                disabled={item.quantity >= availableInventory}
                                onClick={() =>
                                  updateCartQuantity(
                                    item.productId,
                                    Math.min(availableInventory, item.quantity + 1),
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className={styles.priceBlock}>
                            <span>{copy.lineTotal}</span>
                            <strong>{lineTotalPi} Pi</strong>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </article>
          </div>

          <div className={styles.rightColumn}>
            <article className={styles.sectionCard}>
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.sectionLabel}>{copy.shippingAddressTitle}</p>
                  <h2>{copy.savedAddressesTitle}</h2>
                </div>
              </div>

              <p className={styles.sectionLead}>{copy.shippingAddressLead}</p>

              {addresses.length === 0 ? (
                <p className={styles.emptyHint}>{copy.noSavedAddresses}</p>
              ) : (
                <div className={styles.addressList}>
                  {addresses.map((address) => {
                    const isSelected = address.id === selectedAddress?.id;

                    return (
                      <article
                        key={address.id}
                        className={styles.addressCard}
                        data-selected={isSelected}
                      >
                        <button
                          type="button"
                          className={styles.addressSelect}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          <div className={styles.addressTop}>
                            <strong>{address.fullName}</strong>
                            <div className={styles.addressTags}>
                              {address.isDefault ? (
                                <span className={styles.addressTag}>
                                  {copy.defaultAddress}
                                </span>
                              ) : null}
                              {isSelected ? (
                                <span className={styles.addressTag}>
                                  {copy.selectedAddress}
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <p>{address.phone}</p>
                          <p>{formatAddress(address)}</p>
                          {address.note ? <p>{address.note}</p> : null}
                        </button>

                        {!address.isDefault ? (
                          <button
                            type="button"
                            className={styles.secondaryLink}
                            onClick={() => {
                              setDefaultAddress(address.id);
                              setSelectedAddressId(address.id);
                            }}
                          >
                            {copy.setAsDefault}
                          </button>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              )}

              <form className={styles.addressForm} onSubmit={handleAddressSubmit}>
                <div className={styles.formHeading}>
                  <h3>{copy.addAddressTitle}</h3>
                </div>

                <div className={styles.formGrid}>
                  <label>
                    <span>{copy.fullName}</span>
                    <input
                      required
                      name="fullName"
                      value={formState.fullName}
                      onChange={handleFieldChange}
                    />
                  </label>
                  <label>
                    <span>{copy.phone}</span>
                    <input
                      required
                      name="phone"
                      value={formState.phone}
                      onChange={handleFieldChange}
                    />
                  </label>
                  <label className={styles.fullField}>
                    <span>{copy.addressLine1}</span>
                    <input
                      required
                      name="line1"
                      value={formState.line1}
                      onChange={handleFieldChange}
                    />
                  </label>
                  <label className={styles.fullField}>
                    <span>{copy.addressLine2}</span>
                    <input
                      name="line2"
                      value={formState.line2}
                      onChange={handleFieldChange}
                    />
                  </label>
                  <label>
                    <span>{copy.ward}</span>
                    <input
                      required
                      name="ward"
                      value={formState.ward}
                      onChange={handleFieldChange}
                    />
                  </label>
                  <label>
                    <span>{copy.district}</span>
                    <input
                      required
                      name="district"
                      value={formState.district}
                      onChange={handleFieldChange}
                    />
                  </label>
                  <label>
                    <span>{copy.city}</span>
                    <input
                      required
                      name="city"
                      value={formState.city}
                      onChange={handleFieldChange}
                    />
                  </label>
                  <label>
                    <span>{copy.country}</span>
                    <input
                      required
                      name="country"
                      value={formState.country}
                      onChange={handleFieldChange}
                    />
                  </label>
                  <label className={styles.fullField}>
                    <span>{copy.note}</span>
                    <textarea
                      name="note"
                      value={formState.note}
                      onChange={handleFieldChange}
                      rows={3}
                    />
                  </label>
                </div>

                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formState.isDefault}
                    onChange={handleFieldChange}
                  />
                  <span>{copy.setAsDefault}</span>
                </label>

                <button type="submit" className={styles.primaryLink}>
                  {copy.saveAddress}
                </button>
              </form>
            </article>

            <CartCheckoutCard
              copy={copy}
              hasInventoryIssue={hasInventoryIssue}
              lines={cartLines.map((line) => ({
                lineTotalPi: line.lineTotalPi,
                product: line.product,
                quantity: line.item.quantity,
              }))}
              piCopy={piCopy}
              selectedAddress={selectedAddress}
              serverConfigured={serverConfigured}
            />
          </div>
        </section>
      )}
    </div>
  );
}
