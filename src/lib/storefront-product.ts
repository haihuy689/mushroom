import type { Product } from "@/lib/pi-types";

export type StorefrontProductRecord = {
  accent: string;
  badge: string;
  category: string;
  compareAtPi: number | null;
  costPi: number | null;
  actualSoldCount: number;
  baseSoldCount: number;
  createdAt: string;
  description: string;
  format: string;
  galleryImageUrls: string[];
  id: string;
  imageUrl: string;
  inventoryCount: number;
  isActive: boolean;
  isFeatured: boolean;
  lowStockThreshold: number;
  name: string;
  packaging: string;
  pricePi: number;
  mediaNote: string;
  slug: string;
  sourceProductId: string | null;
  sku: string;
  tagline: string;
  updatedAt: string;
  videoUrl: string;
  weightUnit: string | null;
  weightValue: number | null;
};

export type StorefrontProductInput = Omit<
  StorefrontProductRecord,
  "createdAt" | "updatedAt"
>;

const DEFAULT_ACCENT = "#c38a33";
const DEFAULT_BADGE = "Mushroom.Pi";
const DEFAULT_CATEGORY = "Mushroom";
const DEFAULT_FORMAT = "Standard pack";
const DEFAULT_LOW_STOCK_THRESHOLD = 5;
const DEFAULT_WEIGHT_UNIT = "g";

function normalizeText(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function normalizeStringList(value: string[] | string | null | undefined) {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\r?\n/)
      : [];

  return values
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .slice(0, 12);
}

function parseNumericValue(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value.trim().replace(/\s+/g, "").replace(",", "."));
  }

  return NaN;
}

function normalizeInteger(value: number | string | null | undefined) {
  const numericValue = parseNumericValue(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.round(numericValue));
}

function normalizeDecimal(value: number | string | null | undefined) {
  const numericValue = parseNumericValue(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Number(Math.max(0, numericValue).toFixed(4));
}

function normalizeNullableDecimal(value: number | string | null | undefined) {
  const numericValue = parseNumericValue(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return null;
  }

  return Number(numericValue.toFixed(4));
}

function normalizeWeightValue(value: number | string | null | undefined) {
  const numericValue = parseNumericValue(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return null;
  }

  return Number(numericValue.toFixed(2));
}

function normalizeLowStockThreshold(value: number | string | null | undefined) {
  const numericValue = parseNumericValue(value);

  if (!Number.isFinite(numericValue)) {
    return DEFAULT_LOW_STOCK_THRESHOLD;
  }

  return Math.max(0, Math.round(numericValue));
}

function titleCaseFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function slugifyProductValue(value: string | null | undefined) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function createEmptyStorefrontProductInput(): StorefrontProductInput {
  return {
    accent: DEFAULT_ACCENT,
    badge: DEFAULT_BADGE,
    category: DEFAULT_CATEGORY,
    compareAtPi: null,
    costPi: null,
    actualSoldCount: 0,
    baseSoldCount: 0,
    description: "",
    format: DEFAULT_FORMAT,
    galleryImageUrls: [],
    id: "",
    imageUrl: "",
    inventoryCount: 0,
    isActive: true,
    isFeatured: false,
    lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
    name: "",
    packaging: "",
    pricePi: 0,
    mediaNote: "",
    slug: "",
    sourceProductId: null,
    sku: "",
    tagline: "",
    videoUrl: "",
    weightUnit: DEFAULT_WEIGHT_UNIT,
    weightValue: null,
  };
}

export function normalizeStorefrontProductInput(
  input: Partial<StorefrontProductInput>,
) {
  const sourceProductId = normalizeText(input.sourceProductId) || null;
  const slug =
    slugifyProductValue(input.slug) ||
    slugifyProductValue(input.name) ||
    slugifyProductValue(input.id) ||
    slugifyProductValue(sourceProductId);
  const id =
    slugifyProductValue(input.id) ||
    sourceProductId ||
    slug ||
    `product-${Date.now().toString(36)}`;
  const name =
    normalizeText(input.name) || titleCaseFromSlug(slug || id) || "Product";
  const sku =
    normalizeText(input.sku) ||
    (slug || id)
      .replace(/-/g, "_")
      .toUpperCase()
      .slice(0, 48);

  return {
    accent: normalizeText(input.accent) || DEFAULT_ACCENT,
    badge: normalizeText(input.badge) || DEFAULT_BADGE,
    category: normalizeText(input.category) || DEFAULT_CATEGORY,
    compareAtPi: normalizeNullableDecimal(input.compareAtPi),
    costPi: normalizeNullableDecimal(input.costPi),
    actualSoldCount: normalizeInteger(input.actualSoldCount),
    baseSoldCount: normalizeInteger(input.baseSoldCount),
    description: normalizeText(input.description),
    format: normalizeText(input.format) || DEFAULT_FORMAT,
    galleryImageUrls: normalizeStringList(input.galleryImageUrls),
    id,
    imageUrl: normalizeText(input.imageUrl),
    inventoryCount: normalizeInteger(input.inventoryCount),
    isActive: input.isActive !== false,
    isFeatured: input.isFeatured === true,
    lowStockThreshold: normalizeLowStockThreshold(input.lowStockThreshold),
    name,
    packaging: normalizeText(input.packaging),
    pricePi: normalizeDecimal(input.pricePi),
    mediaNote: normalizeText(input.mediaNote),
    slug: slug || id,
    sourceProductId,
    sku,
    tagline: normalizeText(input.tagline),
    videoUrl: normalizeText(input.videoUrl),
    weightUnit: normalizeText(input.weightUnit) || null,
    weightValue: normalizeWeightValue(input.weightValue),
  } satisfies StorefrontProductInput;
}

export function formatProductWeight(
  product: Pick<Product, "weightUnit" | "weightValue">,
) {
  if (
    typeof product.weightValue !== "number" ||
    !Number.isFinite(product.weightValue) ||
    product.weightValue <= 0
  ) {
    return null;
  }

  const weightUnit = normalizeText(product.weightUnit) || DEFAULT_WEIGHT_UNIT;
  const value = Number.isInteger(product.weightValue)
    ? product.weightValue.toString()
    : product.weightValue.toFixed(2).replace(/\.?0+$/, "");

  return `${value} ${weightUnit}`;
}

export function mapProductRecordToProduct(
  product: StorefrontProductRecord,
): Product {
  return {
    accent: product.accent,
    badge: product.badge,
    category: product.category,
    compareAtPi: product.compareAtPi ?? undefined,
    costPi: product.costPi ?? undefined,
    actualSoldCount: product.actualSoldCount,
    baseSoldCount: product.baseSoldCount,
    description: product.description,
    format: product.format,
    galleryImageUrls: product.galleryImageUrls,
    id: product.id,
    imageUrl: product.imageUrl || undefined,
    inventoryCount: product.inventoryCount,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    lowStockThreshold: product.lowStockThreshold,
    name: product.name,
    packaging: product.packaging || undefined,
    pricePi: product.pricePi,
    mediaNote: product.mediaNote || undefined,
    slug: product.slug,
    sourceProductId: product.sourceProductId ?? undefined,
    sku: product.sku || undefined,
    tagline: product.tagline,
    videoUrl: product.videoUrl || undefined,
    weightUnit: product.weightUnit ?? undefined,
    weightValue: product.weightValue ?? undefined,
  };
}
