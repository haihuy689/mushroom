import { NextResponse } from "next/server";
import {
  listStorefrontOrdersForAdmin,
  listStorefrontProductRecords,
  listStorefrontStaffMembers,
} from "@/lib/storefront-db";
import { getStorefrontAdminContext } from "@/lib/storefront-admin-server";

const ADMIN_DASHBOARD_TIMEOUT_MS = 8000;

function withDashboardTimeout<T>(promise: Promise<T>) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          "Admin data is responding slowly. Please reload in a few seconds.",
        ),
      );
    }, ADMIN_DASHBOARD_TIMEOUT_MS);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function GET() {
  const { access } = await getStorefrontAdminContext();

  if (!access.canAccessAdmin) {
    return NextResponse.json(
      {
        error: "Admin session is required.",
      },
      { status: 403 },
    );
  }

  try {
    const [orders, staff, products] = await withDashboardTimeout(
      Promise.all([
        listStorefrontOrdersForAdmin(),
        access.canManageStaff ? listStorefrontStaffMembers() : Promise.resolve([]),
        access.canManageStaff
          ? listStorefrontProductRecords()
          : Promise.resolve([]),
      ]),
    );

    return NextResponse.json({
      orders,
      products,
      staff,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Admin data is responding slowly. Please reload in a few seconds.",
      },
      { status: 503 },
    );
  }
}
