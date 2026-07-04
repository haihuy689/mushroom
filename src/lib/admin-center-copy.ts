import type { SiteLocale } from "@/lib/i18n";

export type AdminCenterCopy = {
  addProduct: string;
  addProductButton: string;
  addStaff: string;
  addStaffButton: string;
  dashboardLoading: string;
  dashboardRetry: string;
  dashboardSlowError: string;
  adminLead: string;
  adminLoginButton: string;
  adminLoginLead: string;
  adminLoginPasswordLabel: string;
  adminLoginTitle: string;
  adminLoginUsernameLabel: string;
  adminLogoutButton: string;
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
  addStaffButton: "Save employee",
  dashboardLoading: "Loading admin data...",
  dashboardRetry: "Reload data",
  dashboardSlowError:
    "Admin data is responding slowly right now. Please try reloading.",
  adminLead:
    "Manage employees, product inventory, and customer orders from one browser-based control panel.",
  adminLoginButton: "Sign in to admin",
  adminLoginLead:
    "Use the admin username and password to open the management dashboard directly.",
  adminLoginPasswordLabel: "Password",
  adminLoginTitle: "Admin sign-in",
  adminLoginUsernameLabel: "Username",
  adminLogoutButton: "Sign out admin",
  adminPageDescription:
    "System admin area for Mushroom.Pi staff, products, inventory, and orders.",
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
  emptyStaff: "No employees added yet.",
  hiddenProductsLabel: "Hidden products",
  inventoryLabel: "Inventory",
  latestSync: "Latest sync",
  liveProductsLabel: "Visible products",
  noAccessBody:
    "Use the admin username and password to open the Mushroom.Pi management system.",
  noAccessTitle: "Admin access required",
  notes:
    "Use this area to maintain employee records, product availability, and order processing in one place.",
  orderAddress: "Delivery address",
  orderItems: "Items",
  orderManagerTitle: "Order manager",
  ownerPanel: "System admin",
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
  staffIdentityLabel: "Employee login or code",
  staffManagerLead:
    "Add the employee login, name, or internal code you want stored in the admin roster.",
  staffManagerTitle: "Employee manager",
  staffPanel: "Staff panel",
  staffUsernameLabel: "Employee login or code",
  statusLabel: "Status",
  updateStatus: "Update status",
  weightUnitLabel: "Weight unit",
  weightValueLabel: "Weight value",
};

const vi: AdminCenterCopy = {
  addProduct: "Them san pham",
  addProductButton: "Luu san pham",
  addStaff: "Them nhan vien",
  addStaffButton: "Luu nhan vien",
  dashboardLoading: "Dang tai du lieu quan tri...",
  dashboardRetry: "Tai lai du lieu",
  dashboardSlowError:
    "Du lieu quan tri dang phan hoi cham. Ban vui long tai lai sau it giay.",
  adminLead:
    "Quan ly nhan vien, hang hoa va don hang cua Mushroom.Pi trong mot trang dieu khien tren web.",
  adminLoginButton: "Dang nhap quan tri",
  adminLoginLead:
    "Dung tai khoan va mat khau quan tri de vao dashboard quan ly truc tiep.",
  adminLoginPasswordLabel: "Mat khau",
  adminLoginTitle: "Dang nhap quan tri",
  adminLoginUsernameLabel: "Tai khoan",
  adminLogoutButton: "Dang xuat quan tri",
  adminPageDescription:
    "Khu quan tri he thong cho nhan vien, hang hoa, ton kho va don hang cua Mushroom.Pi.",
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
  emptyStaff: "Chua them nhan vien nao.",
  hiddenProductsLabel: "San pham dang an",
  inventoryLabel: "Ton kho",
  latestSync: "Lan dong bo gan nhat",
  liveProductsLabel: "San pham dang hien",
  noAccessBody:
    "Dung tai khoan va mat khau quan tri de vao he thong quan tri Mushroom.Pi.",
  noAccessTitle: "Can quyen quan tri",
  notes:
    "Tai day ban co the quan ly danh sach nhan vien, ton kho, thong tin san pham va trang thai don hang.",
  orderAddress: "Dia chi nhan hang",
  orderItems: "San pham",
  orderManagerTitle: "Quan ly don hang",
  ownerPanel: "Quan tri he thong",
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
  staffIdentityLabel: "Ten dang nhap hoac ma nhan vien",
  staffManagerLead:
    "Nhap ten dang nhap, ten goi hoac ma noi bo cua tung nhan vien de luu trong he thong quan tri.",
  staffManagerTitle: "Quan ly nhan vien",
  staffPanel: "Bang nhan vien",
  staffUsernameLabel: "Ten dang nhap hoac ma nhan vien",
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
