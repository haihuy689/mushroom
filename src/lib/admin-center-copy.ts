import type { SiteLocale } from "@/lib/i18n";

export type AdminCenterCopy = {
  adminLead: string;
  allClearLabel: string;
  adminLoginButton: string;
  adminLoginLead: string;
  adminLoginPasswordLabel: string;
  adminLoginTitle: string;
  adminLoginUsernameLabel: string;
  adminLogoutButton: string;
  adminPasswordChangeButton: string;
  adminPasswordChangeSuccess: string;
  adminPasswordConfirmLabel: string;
  adminPasswordCurrentLabel: string;
  adminPasswordMismatchError: string;
  adminPasswordNewLabel: string;
  adminPasswordSecurityLead: string;
  adminPasswordSecurityTitle: string;
  adminPasswordTooShortError: string;
  adminPageDescription: string;
  adminPageTitle: string;
  adminTitle: string;
  actualSoldCountLabel: string;
  baseSoldCountLabel: string;
  catalogManagerLead: string;
  catalogManagerTitle: string;
  catalogValueLabel: string;
  comparePriceLabel: string;
  costPriceLabel: string;
  coverImageHelp: string;
  customerLabel: string;
  dashboardLoading: string;
  dashboardRetry: string;
  dashboardSlowError: string;
  deleteProductButton: string;
  deleteProductConfirm: string;
  deleteProductSuccess: string;
  editProductTitle: string;
  editStaffTitle: string;
  emptyOrders: string;
  emptyProducts: string;
  emptyStaff: string;
  featuredProductLabel: string;
  featuredProductsLabel: string;
  galleryImagesHelp: string;
  galleryImagesLabel: string;
  imageUrlLabel: string;
  inactiveStaffLabel: string;
  inventoryLabel: string;
  internalNoteLabel: string;
  latestSync: string;
  lowStockLabel: string;
  lowStockThresholdLabel: string;
  newProductButton: string;
  newProductTitle: string;
  newStaffButton: string;
  newStaffTitle: string;
  noHiddenProductsLabel: string;
  noAccessBody: string;
  openOrdersLabel: string;
  operationsLead: string;
  operationsTab: string;
  operationsTitle: string;
  orderAddress: string;
  orderCodeLabel: string;
  orderItems: string;
  orderManagerLead: string;
  orderManagerTitle: string;
  ordersTab: string;
  overviewTab: string;
  ownerPanel: string;
  packagingLabel: string;
  paymentIdLabel: string;
  priceLabel: string;
  mediaNoteLabel: string;
  mediaUploadSuccess: string;
  mediaUploadingLabel: string;
  productAccentLabel: string;
  productActiveLabel: string;
  productOptionAddButton: string;
  productOptionDeleteButton: string;
  productOptionDeleteConfirm: string;
  productOptionDeleted: string;
  productOptionExistingLabel: string;
  productOptionGroupLabel: string;
  productOptionLead: string;
  productOptionRequiredError: string;
  productOptionSaved: string;
  productOptionTitle: string;
  productOptionUpdateButton: string;
  productOptionValueLabel: string;
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
  productRequiredFieldsError: string;
  productSlugLabel: string;
  productSystemLabel: string;
  productTaglineLabel: string;
  productsRefresh: string;
  productsTab: string;
  reactivateStaff: string;
  recentOrdersTitle: string;
  refreshOrders: string;
  removeStaff: string;
  saveError: string;
  saveOrderButton: string;
  saveProductButton: string;
  saveProductSuccess: string;
  saveStaffButton: string;
  saveSuccess: string;
  savingLabel: string;
  selectOrderPrompt: string;
  selectProductPrompt: string;
  selectStaffPrompt: string;
  shippingCarrierLabel: string;
  skuLabel: string;
  staffActiveLabel: string;
  staffAddedBy: string;
  staffFullNameLabel: string;
  staffIdentityLabel: string;
  staffManageOrdersLabel: string;
  staffManageProductsLabel: string;
  staffManageStaffLabel: string;
  staffManagerLead: string;
  staffManagerTitle: string;
  staffNoteLabel: string;
  staffPermissionsLabel: string;
  staffRoleLabel: string;
  staffTab: string;
  statusLabel: string;
  teamOverviewTitle: string;
  totalSalesLabel: string;
  totalSoldCountLabel: string;
  trackingCodeLabel: string;
  txidLabel: string;
  removeMediaButton: string;
  uploadCoverImageLabel: string;
  uploadGalleryImagesLabel: string;
  uploadProductVideoLabel: string;
  videoUrlHelp: string;
  videoUrlLabel: string;
  weightUnitLabel: string;
  weightValueLabel: string;
};

const en: AdminCenterCopy = {
  adminLead:
    "Run Mushroom.Pi from one operational dashboard with real controls for products, inventory, team, and order handling.",
  allClearLabel: "Everything is within the current stock target.",
  adminLoginButton: "Sign in to admin",
  adminLoginLead:
    "Use the admin username and password to open the management workspace directly.",
  adminLoginPasswordLabel: "Password",
  adminLoginTitle: "Admin sign-in",
  adminLoginUsernameLabel: "Username",
  adminLogoutButton: "Sign out admin",
  adminPasswordChangeButton: "Change admin password",
  adminPasswordChangeSuccess: "Admin password changed. Use the new password next time.",
  adminPasswordConfirmLabel: "Confirm new password",
  adminPasswordCurrentLabel: "Current password",
  adminPasswordMismatchError: "The new password confirmation does not match.",
  adminPasswordNewLabel: "New password",
  adminPasswordSecurityLead:
    "Update the direct /admin password. The new password is stored as a secure hash in the database.",
  adminPasswordSecurityTitle: "Admin password",
  adminPasswordTooShortError: "New password must be at least 8 characters.",
  adminPageDescription:
    "Operational admin area for Mushroom.Pi products, inventory, employees, and orders.",
  adminPageTitle: "Admin | Mushroom.Pi",
  adminTitle: "Operations dashboard",
  actualSoldCountLabel: "Real sold count",
  baseSoldCountLabel: "Starting sold count",
  catalogManagerLead:
    "Create products, control visibility, maintain pricing, and keep inventory data ready for real fulfillment.",
  catalogManagerTitle: "Product management",
  catalogValueLabel: "Catalog value",
  comparePriceLabel: "Compare price (Pi)",
  costPriceLabel: "Cost price (Pi)",
  coverImageHelp: "Cover image. Recommended ratio 4:3, about 1200 x 900px.",
  customerLabel: "Customer",
  dashboardLoading: "Loading admin data...",
  dashboardRetry: "Reload data",
  dashboardSlowError:
    "Admin data is responding slowly right now. Please try reloading.",
  deleteProductButton: "Delete product",
  deleteProductConfirm:
    "Delete this product from the shop? Existing orders will be kept.",
  deleteProductSuccess: "Product deleted.",
  editProductTitle: "Edit product",
  editStaffTitle: "Edit employee",
  emptyOrders: "No orders yet.",
  emptyProducts: "No products available yet.",
  emptyStaff: "No employees added yet.",
  featuredProductLabel: "Show on homepage",
  featuredProductsLabel: "Featured",
  galleryImagesHelp: "One URL per line for inner product images.",
  galleryImagesLabel: "Inner image URLs",
  imageUrlLabel: "Cover image URL",
  inactiveStaffLabel: "Inactive staff",
  inventoryLabel: "Inventory",
  internalNoteLabel: "Internal note",
  latestSync: "Latest sync",
  lowStockLabel: "Low stock",
  lowStockThresholdLabel: "Low-stock alert",
  newProductButton: "New product",
  newProductTitle: "New product",
  newStaffButton: "New employee",
  newStaffTitle: "New employee",
  noHiddenProductsLabel: "No products are hidden right now.",
  noAccessBody:
    "Use the admin username and password to open the Mushroom.Pi management system.",
  openOrdersLabel: "Open orders",
  operationsLead:
    "Watch the health of the store at a glance: backlog, low stock, hidden products, and team readiness.",
  operationsTab: "Operations",
  operationsTitle: "Operational view",
  orderAddress: "Delivery address",
  orderCodeLabel: "Order code",
  orderItems: "Items",
  orderManagerLead:
    "Track each order with status, shipping carrier, tracking code, and internal notes for fulfillment.",
  orderManagerTitle: "Order management",
  ordersTab: "Orders",
  overviewTab: "Overview",
  ownerPanel: "System admin",
  packagingLabel: "Packaging",
  paymentIdLabel: "Payment ID",
  priceLabel: "Price (Pi)",
  mediaNoteLabel: "Media note",
  mediaUploadSuccess: "Media uploaded.",
  mediaUploadingLabel: "Uploading...",
  productAccentLabel: "Accent background",
  productActiveLabel: "Visible in storefront",
  productOptionAddButton: "Add option",
  productOptionDeleteButton: "Delete option",
  productOptionDeleteConfirm:
    "Delete this option from the selectable list? Existing products keep their current value.",
  productOptionDeleted: "Product option deleted.",
  productOptionExistingLabel: "Existing option",
  productOptionGroupLabel: "Option group",
  productOptionLead:
    "Manage reusable values for category, format, packaging, and weight unit so product setup stays consistent.",
  productOptionRequiredError: "Choose a group and enter an option value first.",
  productOptionSaved: "Product option saved.",
  productOptionTitle: "Reusable product options",
  productOptionUpdateButton: "Update option",
  productOptionValueLabel: "Option value",
  productBadgeLabel: "Badge",
  productCategoryLabel: "Category",
  productCustomLabel: "Admin product",
  productDescriptionLabel: "Description",
  productFormatLabel: "Format",
  productHiddenStatus: "Hidden",
  productInStockStatus: "In stock",
  productLiveStatus: "Live",
  productNameLabel: "Product name",
  productOutOfStockStatus: "Out of stock",
  productRequiredFieldsError:
    "Please enter a product name and a valid price before saving.",
  productSlugLabel: "Slug",
  productSystemLabel: "Old sample",
  productTaglineLabel: "Short tagline",
  productsRefresh: "Refresh products",
  productsTab: "Products",
  reactivateStaff: "Reactivate",
  recentOrdersTitle: "Recent orders",
  refreshOrders: "Refresh orders",
  removeStaff: "Deactivate",
  saveError: "Unable to save changes right now.",
  saveOrderButton: "Save order",
  saveProductButton: "Save product",
  saveProductSuccess:
    "Product saved. It appears in the shop when storefront visibility is on, and on the homepage when homepage visibility is on.",
  saveStaffButton: "Save employee",
  saveSuccess: "Saved.",
  savingLabel: "Saving...",
  selectOrderPrompt: "Select an order from the list to edit shipping and fulfillment details.",
  selectProductPrompt: "Select a product from the list or start a new one to edit the catalog.",
  selectStaffPrompt: "Select an employee from the list or create a new one to manage permissions.",
  shippingCarrierLabel: "Shipping carrier",
  skuLabel: "SKU",
  staffActiveLabel: "Active employee",
  staffAddedBy: "Added by",
  staffFullNameLabel: "Full name",
  staffIdentityLabel: "Pi username or ID",
  staffManageOrdersLabel: "Manage orders",
  staffManageProductsLabel: "Manage products",
  staffManageStaffLabel: "Manage staff",
  staffManagerLead:
    "Keep a clean employee roster with clear permissions for products, orders, and future operations.",
  staffManagerTitle: "Employee management",
  staffNoteLabel: "Internal note",
  staffPermissionsLabel: "Permissions",
  staffRoleLabel: "Role",
  staffTab: "Staff",
  statusLabel: "Status",
  teamOverviewTitle: "Team overview",
  totalSalesLabel: "Total Pi",
  totalSoldCountLabel: "Displayed sold count",
  trackingCodeLabel: "Tracking code",
  txidLabel: "Transaction ID",
  removeMediaButton: "Remove",
  uploadCoverImageLabel: "Choose cover image",
  uploadGalleryImagesLabel: "Add inner images",
  uploadProductVideoLabel: "Choose product video",
  videoUrlHelp: "Use a product demo video URL, YouTube, or hosted MP4.",
  videoUrlLabel: "Product video URL",
  weightUnitLabel: "Weight unit",
  weightValueLabel: "Weight value",
};

const vi: AdminCenterCopy = {
  adminLead:
    "Van hanh Mushroom.Pi trong mot bang dieu khien co cau truc ro rang cho san pham, ton kho, nhan vien va don hang.",
  allClearLabel: "Tat ca san pham hien dang nam trong nguong ton kho an toan.",
  adminLoginButton: "Dang nhap quan tri",
  adminLoginLead:
    "Dung tai khoan va mat khau quan tri de vao khu dieu hanh truc tiep.",
  adminLoginPasswordLabel: "Mat khau",
  adminLoginTitle: "Dang nhap quan tri",
  adminLoginUsernameLabel: "Tai khoan",
  adminLogoutButton: "Dang xuat quan tri",
  adminPasswordChangeButton: "Doi mat khau quan tri",
  adminPasswordChangeSuccess:
    "Da doi mat khau quan tri. Lan sau hay dung mat khau moi.",
  adminPasswordConfirmLabel: "Nhap lai mat khau moi",
  adminPasswordCurrentLabel: "Mat khau hien tai",
  adminPasswordMismatchError: "Mat khau moi nhap lai chua khop.",
  adminPasswordNewLabel: "Mat khau moi",
  adminPasswordSecurityLead:
    "Cap nhat mat khau vao truc tiep /admin. Mat khau moi se duoc luu dang hash an toan trong database.",
  adminPasswordSecurityTitle: "Mat khau quan tri",
  adminPasswordTooShortError: "Mat khau moi can toi thieu 8 ky tu.",
  adminPageDescription:
    "Khu quan tri van hanh cho san pham, ton kho, nhan vien va don hang cua Mushroom.Pi.",
  adminPageTitle: "Quan tri | Mushroom.Pi",
  adminTitle: "Bang dieu hanh",
  actualSoldCountLabel: "So ban thuc te",
  baseSoldCountLabel: "So da ban nen",
  catalogManagerLead:
    "Tao san pham, dieu khien hien thi, cap nhat gia ban va giu du lieu ton kho san sang cho van hanh that.",
  catalogManagerTitle: "Quan ly san pham",
  catalogValueLabel: "Gia tri ton kho",
  comparePriceLabel: "Gia so sanh (Pi)",
  costPriceLabel: "Gia von (Pi)",
  coverImageHelp: "Anh bia san pham. Nen dung ti le 4:3, khoang 1200 x 900px.",
  customerLabel: "Khach hang",
  dashboardLoading: "Dang tai du lieu quan tri...",
  dashboardRetry: "Tai lai du lieu",
  dashboardSlowError:
    "Du lieu quan tri dang phan hoi cham. Ban vui long tai lai sau it giay.",
  deleteProductButton: "Xoa san pham",
  deleteProductConfirm:
    "Xoa san pham nay khoi cua hang? Lich su don hang cu van duoc giu lai.",
  deleteProductSuccess: "Da xoa san pham.",
  editProductTitle: "Sua san pham",
  editStaffTitle: "Sua nhan vien",
  emptyOrders: "Chua co don hang nao.",
  emptyProducts: "Chua co san pham nao.",
  emptyStaff: "Chua co nhan vien nao.",
  featuredProductLabel: "Hien thi o trang chu",
  featuredProductsLabel: "Noi bat",
  galleryImagesHelp: "Moi dong la mot URL anh ben trong san pham.",
  galleryImagesLabel: "URL anh ben trong",
  imageUrlLabel: "URL anh bia",
  inactiveStaffLabel: "Nhan vien tam dung",
  inventoryLabel: "Ton kho",
  internalNoteLabel: "Ghi chu noi bo",
  latestSync: "Lan dong bo gan nhat",
  lowStockLabel: "Sap het hang",
  lowStockThresholdLabel: "Moc canh bao ton kho",
  newProductButton: "San pham moi",
  newProductTitle: "Tao san pham moi",
  newStaffButton: "Nhan vien moi",
  newStaffTitle: "Tao nhan vien moi",
  noHiddenProductsLabel: "Hien khong co san pham nao dang an.",
  noAccessBody:
    "Dung tai khoan va mat khau quan tri de vao he thong quan tri Mushroom.Pi.",
  openOrdersLabel: "Don dang mo",
  operationsLead:
    "Theo doi nhanh suc khoe van hanh: don dang xu ly, ton kho sap can, san pham dang an va tinh trang doi ngu.",
  operationsTab: "Van hanh",
  operationsTitle: "Goc nhin van hanh",
  orderAddress: "Dia chi nhan hang",
  orderCodeLabel: "Ma don",
  orderItems: "San pham",
  orderManagerLead:
    "Theo doi don hang voi trang thai, don vi giao hang, ma van don va ghi chu noi bo cho khau giao nhan.",
  orderManagerTitle: "Quan ly don hang",
  ordersTab: "Don hang",
  overviewTab: "Tong quan",
  ownerPanel: "Quan tri he thong",
  packagingLabel: "Bao bi",
  paymentIdLabel: "Ma payment",
  priceLabel: "Gia ban (Pi)",
  mediaNoteLabel: "Ghi chu media",
  mediaUploadSuccess: "Da upload media.",
  mediaUploadingLabel: "Dang upload...",
  productAccentLabel: "Nen nhan dien",
  productActiveLabel: "Dang hien tren shop",
  productOptionAddButton: "Them lua chon",
  productOptionDeleteButton: "Xoa lua chon",
  productOptionDeleteConfirm:
    "Xoa lua chon nay khoi danh sach chon? San pham cu van giu gia tri hien tai.",
  productOptionDeleted: "Da xoa lua chon san pham.",
  productOptionExistingLabel: "Lua chon dang co",
  productOptionGroupLabel: "Nhom lua chon",
  productOptionLead:
    "Quan ly cac gia tri lap lai cho danh muc, quy cach, bao bi va don vi khoi luong de tao san pham nhanh va dong nhat hon.",
  productOptionRequiredError: "Hay chon nhom va nhap gia tri lua chon truoc.",
  productOptionSaved: "Da luu lua chon san pham.",
  productOptionTitle: "Lua chon san pham lap lai",
  productOptionUpdateButton: "Cap nhat lua chon",
  productOptionValueLabel: "Gia tri lua chon",
  productBadgeLabel: "Nhan",
  productCategoryLabel: "Danh muc",
  productCustomLabel: "San pham quan tri",
  productDescriptionLabel: "Mo ta",
  productFormatLabel: "Quy cach",
  productHiddenStatus: "Dang an",
  productInStockStatus: "Con hang",
  productLiveStatus: "Dang ban",
  productNameLabel: "Ten san pham",
  productOutOfStockStatus: "Het hang",
  productRequiredFieldsError:
    "Hay nhap ten san pham va gia ban hop le truoc khi luu.",
  productSlugLabel: "Slug",
  productSystemLabel: "Mau cu",
  productTaglineLabel: "Mo ta ngan",
  productsRefresh: "Tai lai san pham",
  productsTab: "San pham",
  reactivateStaff: "Kich hoat lai",
  recentOrdersTitle: "Don gan day",
  refreshOrders: "Tai lai don",
  removeStaff: "Tam dung",
  saveError: "Hien chua luu duoc thay doi.",
  saveOrderButton: "Luu don hang",
  saveProductButton: "Luu san pham",
  saveProductSuccess:
    "Da luu san pham. San pham se hien o cua hang khi bat hien thi tren shop, va hien o trang chu khi bat hien thi o trang chu.",
  saveStaffButton: "Luu nhan vien",
  saveSuccess: "Da luu.",
  savingLabel: "Dang luu...",
  selectOrderPrompt:
    "Chon mot don hang trong danh sach de cap nhat giao hang va xu ly don.",
  selectProductPrompt:
    "Chon mot san pham trong danh sach hoac tao san pham moi de sua catalog.",
  selectStaffPrompt:
    "Chon mot nhan vien trong danh sach hoac tao moi de quan ly quyen.",
  shippingCarrierLabel: "Don vi giao hang",
  skuLabel: "SKU",
  staffActiveLabel: "Dang hoat dong",
  staffAddedBy: "Them boi",
  staffFullNameLabel: "Ho ten",
  staffIdentityLabel: "Pi username hoac user id",
  staffManageOrdersLabel: "Quan ly don hang",
  staffManageProductsLabel: "Quan ly san pham",
  staffManageStaffLabel: "Quan ly nhan vien",
  staffManagerLead:
    "Luu danh sach nhan vien gon gang, co ghi ro quyen cho san pham, don hang va van hanh ve sau.",
  staffManagerTitle: "Quan ly nhan vien",
  staffNoteLabel: "Ghi chu noi bo",
  staffPermissionsLabel: "Quyen han",
  staffRoleLabel: "Vai tro",
  staffTab: "Nhan vien",
  statusLabel: "Trang thai",
  teamOverviewTitle: "Tong quan doi ngu",
  totalSalesLabel: "Tong Pi",
  totalSoldCountLabel: "So da ban hien thi",
  trackingCodeLabel: "Ma van don",
  txidLabel: "Ma giao dich",
  removeMediaButton: "Go bo",
  uploadCoverImageLabel: "Chon anh bia",
  uploadGalleryImagesLabel: "Them anh ben trong",
  uploadProductVideoLabel: "Chon video san pham",
  videoUrlHelp: "Dung URL video gioi thieu san pham, YouTube hoac MP4 da host.",
  videoUrlLabel: "URL video san pham",
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
