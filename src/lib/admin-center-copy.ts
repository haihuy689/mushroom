import type { SiteLocale } from "@/lib/i18n";

export type AdminCenterCopy = {
  addProduct: string;
  addProductButton: string;
  addStaff: string;
  addStaffButton: string;
  adminLead: string;
  adminPageDescription: string;
  adminPageTitle: string;
  adminTitle: string;
  catalogManagerLead: string;
  catalogManagerTitle: string;
  createProductButton: string;
  customerLabel: string;
  customProductLead: string;
  customProductTitle: string;
  emptyOrders: string;
  emptyProducts: string;
  emptyStaff: string;
  hiddenProductsLabel: string;
  inventoryLabel: string;
  latestSync: string;
  liveProductsLabel: string;
  noAccessBody: string;
  noAccessTitle: string;
  notes: string;
  orderAddress: string;
  orderItems: string;
  orderManagerTitle: string;
  ownerPanel: string;
  outOfStockProductsLabel: string;
  packagingLabel: string;
  priceLabel: string;
  productAccentLabel: string;
  productActiveLabel: string;
  productBadgeLabel: string;
  productCategoryLabel: string;
  productCustomLabel: string;
  productDescriptionLabel: string;
  productFormatLabel: string;
  productHiddenStatus: string;
  productInStockStatus: string;
  productLiveStatus: string;
  productNameLabel: string;
  productOutOfStockStatus: string;
  productSlugLabel: string;
  productSourceLabel: string;
  productSystemLabel: string;
  productTaglineLabel: string;
  productsRefresh: string;
  refreshOrders: string;
  removeStaff: string;
  saveError: string;
  saveProductButton: string;
  saveSuccess: string;
  savingProductButton: string;
  staffAddedBy: string;
  staffIdentityLabel: string;
  staffManagerLead: string;
  staffManagerTitle: string;
  staffPanel: string;
  staffUsernameLabel: string;
  statusLabel: string;
  updateStatus: string;
  weightUnitLabel: string;
  weightValueLabel: string;
};

const en: AdminCenterCopy = {
  addProduct: "Add product",
  addProductButton: "Save product",
  addStaff: "Add staff",
  addStaffButton: "Save staff access",
  adminLead:
    "Manage Mushroom.Pi staff access, keep your product catalog accurate, and move customer orders through your real delivery flow.",
  adminPageDescription:
    "Owner and staff operations for Mushroom.Pi orders, catalog, and employee access.",
  adminPageTitle: "Admin | Mushroom.Pi",
  adminTitle: "Admin center",
  catalogManagerLead:
    "Update price, stock, packaging, weight, and active status for the products already live in your storefront.",
  catalogManagerTitle: "Product catalog",
  createProductButton: "Create product",
  customerLabel: "Customer",
  customProductLead:
    "Create a brand new product that should appear directly in the shop alongside your existing catalog.",
  customProductTitle: "New product",
  emptyOrders: "No orders yet.",
  emptyProducts: "No products available yet.",
  emptyStaff: "No staff accounts added yet.",
  hiddenProductsLabel: "Hidden products",
  inventoryLabel: "Inventory",
  latestSync: "Latest sync",
  liveProductsLabel: "Visible products",
  noAccessBody:
    "This page is reserved for the Mushroom.Pi owner and approved staff accounts.",
  noAccessTitle: "Admin access required",
  notes:
    "Staff can update order statuses, while the owner can also manage staff identities and the storefront catalog.",
  orderAddress: "Delivery address",
  orderItems: "Items",
  orderManagerTitle: "Order manager",
  ownerPanel: "Owner panel",
  outOfStockProductsLabel: "Out of stock",
  packagingLabel: "Packaging",
  priceLabel: "Price (Pi)",
  productAccentLabel: "Accent color",
  productActiveLabel: "Live in storefront",
  productBadgeLabel: "Badge",
  productCategoryLabel: "Category",
  productCustomLabel: "Custom product",
  productDescriptionLabel: "Description",
  productFormatLabel: "Format",
  productHiddenStatus: "Hidden",
  productInStockStatus: "In stock",
  productLiveStatus: "Showing",
  productNameLabel: "Product name",
  productOutOfStockStatus: "Out of stock",
  productSlugLabel: "Slug",
  productSourceLabel: "Linked to system catalog",
  productSystemLabel: "System catalog",
  productTaglineLabel: "Short tagline",
  productsRefresh: "Refresh products",
  refreshOrders: "Refresh orders",
  removeStaff: "Remove",
  saveError: "Unable to save changes right now.",
  saveProductButton: "Save changes",
  saveSuccess: "Saved.",
  savingProductButton: "Saving...",
  staffAddedBy: "Added by",
  staffIdentityLabel: "Pi user id or username",
  staffManagerLead:
    "Add the exact Pi user id or username for each teammate. When they sign in with that identity, they will receive staff access automatically.",
  staffManagerTitle: "Staff access",
  staffPanel: "Staff panel",
  staffUsernameLabel: "Pi user id or username",
  statusLabel: "Status",
  updateStatus: "Update status",
  weightUnitLabel: "Weight unit",
  weightValueLabel: "Weight value",
};

const vi: AdminCenterCopy = {
  addProduct: "Them san pham",
  addProductButton: "Luu san pham",
  addStaff: "Them nhan vien",
  addStaffButton: "Luu quyen nhan vien",
  adminLead:
    "Quan ly quyen nhan vien cua Mushroom.Pi, cap nhat san pham va dieu phoi don hang theo luong van hanh thuc te.",
  adminPageDescription:
    "Khu quan tri cho chu shop va nhan vien cua Mushroom.Pi.",
  adminPageTitle: "Quan tri | Mushroom.Pi",
  adminTitle: "Trung tam quan tri",
  catalogManagerLead:
    "Cap nhat gia, ton kho, bao bi, khoi luong va trang thai dang ban cho catalog hien tai.",
  catalogManagerTitle: "Quan ly san pham",
  createProductButton: "Tao san pham",
  customerLabel: "Khach hang",
  customProductLead:
    "Tao san pham moi de hien truc tiep trong shop cung voi catalog hien co.",
  customProductTitle: "San pham moi",
  emptyOrders: "Chua co don hang nao.",
  emptyProducts: "Chua co san pham nao.",
  emptyStaff: "Chua them tai khoan nhan vien nao.",
  hiddenProductsLabel: "San pham dang an",
  inventoryLabel: "Ton kho",
  latestSync: "Lan dong bo gan nhat",
  liveProductsLabel: "San pham dang hien",
  noAccessBody:
    "Trang nay chi danh cho chu Mushroom.Pi va cac tai khoan nhan vien da duoc cap quyen.",
  noAccessTitle: "Can quyen quan tri",
  notes:
    "Nhan vien co the cap nhat trang thai don. Chu shop co them quyen quan ly nhan vien va catalog san pham.",
  orderAddress: "Dia chi nhan hang",
  orderItems: "San pham",
  orderManagerTitle: "Quan ly don hang",
  ownerPanel: "Bang chu shop",
  outOfStockProductsLabel: "San pham het hang",
  packagingLabel: "Bao bi",
  priceLabel: "Gia (Pi)",
  productAccentLabel: "Mau nhan",
  productActiveLabel: "Dang ban tren shop",
  productBadgeLabel: "Nhan",
  productCategoryLabel: "Danh muc",
  productCustomLabel: "San pham tu them",
  productDescriptionLabel: "Mo ta",
  productFormatLabel: "Quy cach",
  productHiddenStatus: "Dang an",
  productInStockStatus: "Con hang",
  productLiveStatus: "Dang hien",
  productNameLabel: "Ten san pham",
  productOutOfStockStatus: "Het hang",
  productSlugLabel: "Slug",
  productSourceLabel: "Lien ket catalog he thong",
  productSystemLabel: "Catalog he thong",
  productTaglineLabel: "Mo ta ngan",
  productsRefresh: "Tai lai san pham",
  refreshOrders: "Tai lai don",
  removeStaff: "Xoa",
  saveError: "Hien chua luu duoc thay doi.",
  saveProductButton: "Luu thay doi",
  saveSuccess: "Da luu.",
  savingProductButton: "Dang luu...",
  staffAddedBy: "Them boi",
  staffIdentityLabel: "Pi user id hoac username",
  staffManagerLead:
    "Nhap dung Pi user id hoac username cua tung nhan vien. Khi ho dang nhap bang dung dinh danh do, he thong se tu cap quyen nhan vien.",
  staffManagerTitle: "Quan ly nhan vien",
  staffPanel: "Bang nhan vien",
  staffUsernameLabel: "Pi user id hoac username",
  statusLabel: "Trang thai",
  updateStatus: "Cap nhat trang thai",
  weightUnitLabel: "Don vi khoi luong",
  weightValueLabel: "Khoi luong",
};

export function getAdminCenterCopy(locale: SiteLocale) {
  switch (locale) {
    case "vi":
      return vi;
    default:
      return en;
  }
}
