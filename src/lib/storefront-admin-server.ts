import "server-only";

import { getStorefrontAdminAccess } from "@/lib/storefront-db";
import { getStorefrontSessionUser } from "@/lib/storefront-session";

export async function getStorefrontAdminContext() {
  const user = await getStorefrontSessionUser();
  const access = await getStorefrontAdminAccess(user);

  return {
    access,
    user,
  };
}
