import type { PiVerifiedUser } from "@/lib/pi-types";

export const STOREFRONT_OWNER_USERNAME = "haihuygame123";

export type StorefrontAdminRole = "guest" | "staff" | "owner";

export type StorefrontAdminAccess = {
  canAccessAdmin: boolean;
  canManageOrders: boolean;
  canManageStaff: boolean;
  role: StorefrontAdminRole;
  username: string | null;
};

export type StorefrontStaffMember = {
  addedAt: string;
  addedBy: string;
  username: string;
  usernameKey: string;
};

export function normalizeUsernameKey(value: string | undefined | null) {
  return value?.trim().toLowerCase() ?? "";
}

export function isStorefrontOwner(user: PiVerifiedUser | null) {
  return (
    normalizeUsernameKey(user?.username) ===
    normalizeUsernameKey(STOREFRONT_OWNER_USERNAME)
  );
}

export function guestAdminAccess(): StorefrontAdminAccess {
  return {
    canAccessAdmin: false,
    canManageOrders: false,
    canManageStaff: false,
    role: "guest",
    username: null,
  };
}

export function buildStorefrontAdminAccess(
  user: PiVerifiedUser | null,
  isStaff: boolean,
): StorefrontAdminAccess {
  if (!user?.username) {
    return guestAdminAccess();
  }

  if (isStorefrontOwner(user)) {
    return {
      canAccessAdmin: true,
      canManageOrders: true,
      canManageStaff: true,
      role: "owner",
      username: user.username,
    };
  }

  if (isStaff) {
    return {
      canAccessAdmin: true,
      canManageOrders: true,
      canManageStaff: false,
      role: "staff",
      username: user.username,
    };
  }

  return {
    canAccessAdmin: false,
    canManageOrders: false,
    canManageStaff: false,
    role: "guest",
    username: user.username,
  };
}
