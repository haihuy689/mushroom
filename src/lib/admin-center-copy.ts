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
    "Vận hành Mushroom.Pi trong một bảng điều khiển có cấu trúc rõ ràng cho sản phẩm, tồn kho, nhân viên và đơn hàng.",
  allClearLabel: "Tất cả sản phẩm hiện đang nằm trong ngưỡng tồn kho an toàn.",
  adminLoginButton: "Đăng nhập quản trị",
  adminLoginLead:
    "Dùng tài khoản và mật khẩu quản trị để vào khu điều hành trực tiếp.",
  adminLoginPasswordLabel: "Mật khẩu",
  adminLoginTitle: "Đăng nhập quản trị",
  adminLoginUsernameLabel: "Tài khoản",
  adminLogoutButton: "Đăng xuất quản trị",
  adminPasswordChangeButton: "Đổi mật khẩu quản trị",
  adminPasswordChangeSuccess:
    "Đã đổi mật khẩu quản trị. Lần sau hãy dùng mật khẩu mới.",
  adminPasswordConfirmLabel: "Nhập lại mật khẩu mới",
  adminPasswordCurrentLabel: "Mật khẩu hiện tại",
  adminPasswordMismatchError: "Mật khẩu mới nhập lại chưa khớp.",
  adminPasswordNewLabel: "Mật khẩu mới",
  adminPasswordSecurityLead:
    "Cập nhật mật khẩu vào trực tiếp /admin. Mật khẩu mới sẽ được lưu dạng hash an toàn trong database.",
  adminPasswordSecurityTitle: "Mật khẩu quản trị",
  adminPasswordTooShortError: "Mật khẩu mới cần tối thiểu 8 ký tự.",
  adminPageDescription:
    "Khu quản trị vận hành cho sản phẩm, tồn kho, nhân viên và đơn hàng của Mushroom.Pi.",
  adminPageTitle: "Quản trị | Mushroom.Pi",
  adminTitle: "Bảng điều hành",
  actualSoldCountLabel: "Số bán thực tế",
  baseSoldCountLabel: "Số đã bán nền",
  catalogManagerLead:
    "Tạo sản phẩm, điều khiển hiển thị, cập nhật giá bán và giữ dữ liệu tồn kho sẵn sàng cho vận hành thật.",
  catalogManagerTitle: "Quản lý sản phẩm",
  catalogValueLabel: "Giá trị tồn kho",
  comparePriceLabel: "Giá so sánh (Pi)",
  costPriceLabel: "Giá vốn (Pi)",
  coverImageHelp: "Ảnh bìa sản phẩm. Nên dùng tỉ lệ 4:3, khoảng 1200 x 900px.",
  customerLabel: "Khách hàng",
  dashboardLoading: "Đang tải dữ liệu quản trị...",
  dashboardRetry: "Tải lại dữ liệu",
  dashboardSlowError:
    "Dữ liệu quản trị đang phản hồi chậm. Bạn vui lòng tải lại sau ít giây.",
  deleteProductButton: "Xóa sản phẩm",
  deleteProductConfirm:
    "Xóa sản phẩm này khỏi cửa hàng? Lịch sử đơn hàng cũ vẫn được giữ lại.",
  deleteProductSuccess: "Đã xóa sản phẩm.",
  editProductTitle: "Sửa sản phẩm",
  editStaffTitle: "Sửa nhân viên",
  emptyOrders: "Chưa có đơn hàng nào.",
  emptyProducts: "Chưa có sản phẩm nào.",
  emptyStaff: "Chưa có nhân viên nào.",
  featuredProductLabel: "Hiển thị ở trang chủ",
  featuredProductsLabel: "Nổi bật",
  galleryImagesHelp: "Mỗi dòng là một URL ảnh bên trong sản phẩm.",
  galleryImagesLabel: "URL ảnh bên trong",
  imageUrlLabel: "URL ảnh bìa",
  inactiveStaffLabel: "Nhân viên tạm dừng",
  inventoryLabel: "Tồn kho",
  internalNoteLabel: "Ghi chú nội bộ",
  latestSync: "Lần đồng bộ gần nhất",
  lowStockLabel: "Sắp hết hàng",
  lowStockThresholdLabel: "Mốc cảnh báo tồn kho",
  newProductButton: "Sản phẩm mới",
  newProductTitle: "Tạo sản phẩm mới",
  newStaffButton: "Nhân viên mới",
  newStaffTitle: "Tạo nhân viên mới",
  noHiddenProductsLabel: "Hiện không có sản phẩm nào đang ẩn.",
  noAccessBody:
    "Dùng tài khoản và mật khẩu quản trị để vào hệ thống quản trị Mushroom.Pi.",
  openOrdersLabel: "Đơn đang mở",
  operationsLead:
    "Theo dõi nhanh sức khỏe vận hành: đơn đang mở, tồn kho sắp cạn, sản phẩm đang ẩn và tình trạng đội ngũ.",
  operationsTab: "Vận hành",
  operationsTitle: "Góc nhìn vận hành",
  orderAddress: "Địa chỉ nhận hàng",
  orderCodeLabel: "Mã đơn",
  orderItems: "Sản phẩm",
  orderManagerLead:
    "Theo dõi đơn hàng với trạng thái, đơn vị giao hàng, mã vận đơn và ghi chú nội bộ cho khâu giao nhận.",
  orderManagerTitle: "Quản lý đơn hàng",
  ordersTab: "Đơn hàng",
  overviewTab: "Tổng quan",
  ownerPanel: "Quản trị hệ thống",
  packagingLabel: "Bao bì",
  paymentIdLabel: "Mã payment",
  priceLabel: "Giá bán (Pi)",
  mediaNoteLabel: "Ghi chú media",
  mediaUploadSuccess: "Đã upload media.",
  mediaUploadingLabel: "Đang upload...",
  productAccentLabel: "Nền nhận diện",
  productActiveLabel: "Đang hiện trên shop",
  productOptionAddButton: "Thêm lựa chọn",
  productOptionDeleteButton: "Xóa lựa chọn",
  productOptionDeleteConfirm:
    "Xóa lựa chọn này khỏi danh sách chọn? Sản phẩm cũ vẫn giữ giá trị hiện tại.",
  productOptionDeleted: "Đã xóa lựa chọn sản phẩm.",
  productOptionExistingLabel: "Lựa chọn đang có",
  productOptionGroupLabel: "Nhóm lựa chọn",
  productOptionLead:
    "Quản lý các giá trị lặp lại cho danh mục, quy cách, bao bì và đơn vị khối lượng để tạo sản phẩm nhanh và đồng nhất hơn.",
  productOptionRequiredError: "Hãy chọn nhóm và nhập giá trị lựa chọn trước.",
  productOptionSaved: "Đã lưu lựa chọn sản phẩm.",
  productOptionTitle: "Lựa chọn sản phẩm lặp lại",
  productOptionUpdateButton: "Cập nhật lựa chọn",
  productOptionValueLabel: "Giá trị lựa chọn",
  productBadgeLabel: "Nhãn",
  productCategoryLabel: "Danh mục",
  productCustomLabel: "Sản phẩm quản trị",
  productDescriptionLabel: "Mô tả",
  productFormatLabel: "Quy cách",
  productHiddenStatus: "Đang ẩn",
  productInStockStatus: "Còn hàng",
  productLiveStatus: "Đang bán",
  productNameLabel: "Tên sản phẩm",
  productOutOfStockStatus: "Hết hàng",
  productRequiredFieldsError:
    "Hãy nhập tên sản phẩm và giá bán hợp lệ trước khi lưu.",
  productSlugLabel: "Slug",
  productSystemLabel: "Mẫu cũ",
  productTaglineLabel: "Mô tả ngắn",
  productsRefresh: "Tải lại sản phẩm",
  productsTab: "Sản phẩm",
  reactivateStaff: "Kích hoạt lại",
  recentOrdersTitle: "Đơn gần đây",
  refreshOrders: "Tải lại đơn",
  removeStaff: "Tạm dừng",
  saveError: "Hiện chưa lưu được thay đổi.",
  saveOrderButton: "Lưu đơn hàng",
  saveProductButton: "Lưu sản phẩm",
  saveProductSuccess:
    "Đã lưu sản phẩm. Sản phẩm sẽ hiện ở cửa hàng khi bật hiển thị trên shop, và hiện ở trang chủ khi bật hiển thị ở trang chủ.",
  saveStaffButton: "Lưu nhân viên",
  saveSuccess: "Đã lưu.",
  savingLabel: "Đang lưu...",
  selectOrderPrompt:
    "Chọn một đơn hàng trong danh sách để cập nhật giao hàng và xử lý đơn.",
  selectProductPrompt:
    "Chọn một sản phẩm trong danh sách hoặc tạo sản phẩm mới để sửa catalog.",
  selectStaffPrompt:
    "Chọn một nhân viên trong danh sách hoặc tạo mới để quản lý quyền.",
  shippingCarrierLabel: "Đơn vị giao hàng",
  skuLabel: "SKU",
  staffActiveLabel: "Đang hoạt động",
  staffAddedBy: "Thêm bởi",
  staffFullNameLabel: "Họ tên",
  staffIdentityLabel: "Pi username hoặc user id",
  staffManageOrdersLabel: "Quản lý đơn hàng",
  staffManageProductsLabel: "Quản lý sản phẩm",
  staffManageStaffLabel: "Quản lý nhân viên",
  staffManagerLead:
    "Lưu danh sách nhân viên gọn gàng, có ghi rõ quyền cho sản phẩm, đơn hàng và vận hành về sau.",
  staffManagerTitle: "Quản lý nhân viên",
  staffNoteLabel: "Ghi chú nội bộ",
  staffPermissionsLabel: "Quyền hạn",
  staffRoleLabel: "Vai trò",
  staffTab: "Nhân viên",
  statusLabel: "Trạng thái",
  teamOverviewTitle: "Tổng quan đội ngũ",
  totalSalesLabel: "Tổng Pi",
  totalSoldCountLabel: "Số đã bán hiển thị",
  trackingCodeLabel: "Mã vận đơn",
  txidLabel: "Mã giao dịch",
  removeMediaButton: "Gỡ bỏ",
  uploadCoverImageLabel: "Chọn ảnh bìa",
  uploadGalleryImagesLabel: "Thêm ảnh bên trong",
  uploadProductVideoLabel: "Chọn video sản phẩm",
  videoUrlHelp: "Dùng URL video giới thiệu sản phẩm, YouTube hoặc MP4 đã host.",
  videoUrlLabel: "URL video sản phẩm",
  weightUnitLabel: "Đơn vị khối lượng",
  weightValueLabel: "Khối lượng",
};

export function getAdminCenterCopy(locale: SiteLocale) {
  switch (locale) {
    case "vi":
      return vi;
    default:
      return en;
  }
}
