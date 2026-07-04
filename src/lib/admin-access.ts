import type { PiVerifiedUser } from "@/lib/pi-types";

const DEFAULT_OWNER_IDENTITIES = ["haihuygame123", "haihuygamei23"] as const;

function getConfiguredOwnerIdentities() {
  const configured = process.env.STOREFRONT_OWNER_IDENTITIES
    ?.split(",")
    .map((value) => normalizeUsernameKey(value))
    .filter(Boolean);

  if (configured && configured.length > 0) {
    return Array.from(new Set(configured));
  }

  return DEFAULT_OWNER_IDENTITIES.map((value) => normalizeUsernameKey(value));
}

const STOREFRONT_OWNER_IDENTITIES = getConfiguredOwnerIdentities();
export const STOREFRONT_OWNER_USERNAME = STOREFRONT_OWNER_IDENTITIES[0] ?? "haihuygame123";

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
  identity: string;
  identityKey: string;
};

export function normalizeUsernameKey(value: string | undefined | null) {
  return value?.trim().toLowerCase() ?? "";
}

export function getUserAdminIdentityKeys(user: PiVerifiedUser | null) {
  const identities = [user?.username, user?.uid]
    .map((value) => normalizeUsernameKey(value))
    .filter(Boolean);

  return Array.from(new Set(identities));
}

export function isStorefrontOwner(user: PiVerifiedUser | null) {
  const identityKeys = getUserAdminIdentityKeys(user);

  return identityKeys.some((identityKey) =>
    STOREFRONT_OWNER_IDENTITIES.includes(identityKey),
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
  if (!user?.username && !user?.uid) {
    return guestAdminAccess();
  }

  if (isStorefrontOwner(user)) {
    return {
      canAccessAdmin: true,
      canManageOrders: true,
      canManageStaff: true,
      role: "owner",
      username: user.username ?? user.uid,
    };
  }

  if (isStaff) {
    return {
      canAccessAdmin: true,
      canManageOrders: true,
      canManageStaff: false,
      role: "staff",
      username: user.username ?? user.uid,
    };
  }

  return {
    canAccessAdmin: false,
    canManageOrders: false,
    canManageStaff: false,
    role: "guest",
    username: user.username ?? user.uid,
  };
}
