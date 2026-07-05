export const PRODUCT_OPTION_GROUPS = [
  "category",
  "format",
  "packaging",
  "weightUnit",
] as const;

export type StorefrontProductOptionGroup =
  (typeof PRODUCT_OPTION_GROUPS)[number];

export type StorefrontProductOption = {
  createdAt: string;
  group: StorefrontProductOptionGroup;
  updatedAt: string;
  value: string;
};

export const DEFAULT_PRODUCT_OPTIONS: Record<
  StorefrontProductOptionGroup,
  string[]
> = {
  category: [
    "Nấm tươi",
    "Nấm khô",
    "Trà nấm",
    "Bột nấm",
    "Combo",
    "Dinh dưỡng",
  ],
  format: [
    "Túi 100g",
    "Túi 250g",
    "Túi 500g",
    "Hộp 10 gói",
    "Hộp 30 gói",
    "Combo gia đình",
  ],
  packaging: [
    "Túi zip",
    "Túi hút chân không",
    "Hộp giấy",
    "Hũ thủy tinh",
    "Gói lẻ",
  ],
  weightUnit: ["g", "kg", "gói", "hộp", "chai"],
};

export function isProductOptionGroup(
  value: string | null | undefined,
): value is StorefrontProductOptionGroup {
  return PRODUCT_OPTION_GROUPS.includes(
    value as StorefrontProductOptionGroup,
  );
}

export function normalizeProductOptionValue(value: unknown) {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").slice(0, 80)
    : "";
}

export function createProductOptionMap(
  items: StorefrontProductOption[] = [],
) {
  const optionMap = Object.fromEntries(
    PRODUCT_OPTION_GROUPS.map((group) => [
      group,
      [...DEFAULT_PRODUCT_OPTIONS[group]],
    ]),
  ) as Record<StorefrontProductOptionGroup, string[]>;

  for (const item of items) {
    if (!isProductOptionGroup(item.group)) {
      continue;
    }

    const value = normalizeProductOptionValue(item.value);

    if (!value || optionMap[item.group].includes(value)) {
      continue;
    }

    optionMap[item.group].push(value);
  }

  for (const group of PRODUCT_OPTION_GROUPS) {
    optionMap[group] = Array.from(new Set(optionMap[group])).sort((a, b) =>
      a.localeCompare(b, "vi"),
    );
  }

  return optionMap;
}
