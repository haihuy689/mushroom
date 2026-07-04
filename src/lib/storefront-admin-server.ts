import "server-only";

import type { PiVerifiedUser } from "@/lib/pi-types";
import { getAdminCredentialSession } from "@/lib/admin-credential-session";
import { getStorefrontAdminAccess } from "@/lib/storefront-db";
import { getStorefrontSessionUser } from "@/lib/storefront-session";

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
        canManageStaff: true,
        role: "owner" as const,
        username: credentialSession.username,
      },
      authMode: "credentials" as const,
      user,
    };
  }

  const user = await getStorefrontSessionUser();
  const access = await getStorefrontAdminAccess(user);

  return {
    access,
    authMode: "pi" as const,
    user,
  };
}
