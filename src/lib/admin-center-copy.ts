import type { SiteLocale } from "@/lib/i18n";

export type AdminCenterCopy = {
  addStaff: string;
  addStaffButton: string;
  adminLead: string;
  adminPageDescription: string;
  adminPageTitle: string;
  adminTitle: string;
  customerLabel: string;
  emptyOrders: string;
  emptyStaff: string;
  latestSync: string;
  noAccessBody: string;
  noAccessTitle: string;
  notes: string;
  orderAddress: string;
  orderItems: string;
  orderManagerTitle: string;
  ownerPanel: string;
  refreshOrders: string;
  removeStaff: string;
  saveError: string;
  saveSuccess: string;
  staffAddedBy: string;
  staffManagerLead: string;
  staffManagerTitle: string;
  staffPanel: string;
  staffUsernameLabel: string;
  statusLabel: string;
  updateStatus: string;
};

const en: AdminCenterCopy = {
  addStaff: "Add staff",
  addStaffButton: "Save staff access",
  adminLead:
    "Manage Mushroom.Pi staff access and move customer orders through your real delivery flow.",
  adminPageDescription:
    "Owner and staff operations for Mushroom.Pi orders and employee access.",
  adminPageTitle: "Admin | Mushroom.Pi",
  adminTitle: "Admin center",
  customerLabel: "Customer",
  emptyOrders: "No orders yet.",
  emptyStaff: "No staff accounts added yet.",
  latestSync: "Latest sync",
  noAccessBody:
    "This page is reserved for the Mushroom.Pi owner and approved staff accounts.",
  noAccessTitle: "Admin access required",
  notes: "Staff can update order statuses, while the owner can also manage staff usernames.",
  orderAddress: "Delivery address",
  orderItems: "Items",
  orderManagerTitle: "Order manager",
  ownerPanel: "Owner panel",
  refreshOrders: "Refresh orders",
  removeStaff: "Remove",
  saveError: "Unable to save changes right now.",
  saveSuccess: "Saved.",
  staffAddedBy: "Added by",
  staffManagerLead:
    "Add the exact Pi username of each teammate. When they sign in with that username, they will receive staff access automatically.",
  staffManagerTitle: "Staff access",
  staffPanel: "Staff panel",
  staffUsernameLabel: "Pi username",
  statusLabel: "Status",
  updateStatus: "Update status",
};

const vi: AdminCenterCopy = {
  addStaff: "Thêm nhân viên",
  addStaffButton: "Lưu quyền nhân viên",
  adminLead:
    "Quản lý quyền nhân viên của Mushroom.Pi và cập nhật đơn hàng theo luồng giao thực tế của bạn.",
  adminPageDescription:
    "Khu quản trị cho chủ shop và nhân viên của Mushroom.Pi.",
  adminPageTitle: "Quản trị | Mushroom.Pi",
  adminTitle: "Trung tâm quản trị",
  customerLabel: "Khách hàng",
  emptyOrders: "Chưa có đơn hàng nào.",
  emptyStaff: "Chưa thêm tài khoản nhân viên nào.",
  latestSync: "Lần đồng bộ gần nhất",
  noAccessBody:
    "Trang này chỉ dành cho chủ Mushroom.Pi và các tài khoản nhân viên đã được cấp quyền.",
  noAccessTitle: "Cần quyền quản trị",
  notes:
    "Nhân viên có thể cập nhật trạng thái đơn. Chủ shop có thêm quyền quản lý danh sách nhân viên.",
  orderAddress: "Địa chỉ nhận hàng",
  orderItems: "Sản phẩm",
  orderManagerTitle: "Quản lý đơn hàng",
  ownerPanel: "Bảng chủ shop",
  refreshOrders: "Tải lại đơn",
  removeStaff: "Xóa",
  saveError: "Hiện chưa lưu được thay đổi.",
  saveSuccess: "Đã lưu.",
  staffAddedBy: "Thêm bởi",
  staffManagerLead:
    "Nhập đúng Pi username của từng nhân viên. Khi họ đăng nhập bằng đúng tên đó, hệ thống sẽ tự cấp quyền nhân viên.",
  staffManagerTitle: "Quản lý nhân viên",
  staffPanel: "Bảng nhân viên",
  staffUsernameLabel: "Pi username",
  statusLabel: "Trạng thái",
  updateStatus: "Cập nhật trạng thái",
};

export function getAdminCenterCopy(locale: SiteLocale) {
  switch (locale) {
    case "vi":
      return vi;
    default:
      return en;
  }
}
