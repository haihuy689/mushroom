import "server-only";

import type { PiVerifiedUser } from "@/lib/pi-types";
import { guestAdminAccess } from "@/lib/admin-access";
import { getAdminCredentialSession } from "@/lib/admin-credential-session";

export async function getStorefrontAdminContext() {
  const credentialSession = await getAdminCredentialSession();

  if (credentialSession) {
    const user = {
      uid: "admin-credentials",
      username: credentialSession.username,
    } satisfies PiVerifiedUser;

    return {
      access: {
        canAccessAdmin: true,
        canManageOrders: true,
        canManageProducts: true,
        canManageStaff: true,
        role: "owner" as const,
        username: credentialSession.username,
      },
      authMode: "credentials" as const,
      user,
    };
  }

  return {
    access: guestAdminAccess(),
    authMode: "credentials" as const,
    user: null,
  };
}
