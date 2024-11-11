import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Define the UserRole enum to match your schema
enum UserRole {
  USER = "USER",
  CUSTOMER = "CUSTOMER",
  SUBSCRIBER = "SUBSCRIBER",
  PROMO = "PROMO",
  DISTRIBUTOR = "DISTRIBUTOR",
  SHOPMANAGER = "SHOPMANAGER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
  VENDOR = "VENDOR",
}

// Define the routes for each role
const roleRoutes: Record<UserRole, string> = {
  [UserRole.USER]: "/dashboard",
  [UserRole.CUSTOMER]: "/customer",
  [UserRole.SUBSCRIBER]: "/subscriber",
  [UserRole.PROMO]: "/promo",
  [UserRole.DISTRIBUTOR]: "/distributor",
  [UserRole.SHOPMANAGER]: "/shop",
  [UserRole.EDITOR]: "/editor",
  [UserRole.ADMIN]: "/admin",
  [UserRole.SUPERADMIN]: "/select-panel",
  [UserRole.VENDOR]: "/vendor_admin",
};

// Function to safely convert string to UserRole
function toUserRole(role: string): UserRole | undefined {
  return Object.values(UserRole).includes(role as UserRole)
    ? (role as UserRole)
    : undefined;
}

// Function to safely get search params from headers
function getSearchParamsFromHeaders(): URLSearchParams {
  const headersList = headers();
  const referer = headersList.get("referer");
  if (!referer) return new URLSearchParams();

  try {
    const url = new URL(referer);
    return url.searchParams;
  } catch {
    return new URLSearchParams();
  }
}

export default async function RoleBasedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();
  const searchParams = getSearchParamsFromHeaders();
  const selectedRole = searchParams.get("as") || user?.role;

  if (user) {
    const userRole = toUserRole(user.role);

    // If user is SUPERADMIN and has selected a role, go to that panel
    if (userRole === UserRole.SUPERADMIN && selectedRole) {
      const targetRole = toUserRole(selectedRole);
      if (targetRole && targetRole in roleRoutes) {
        redirect(roleRoutes[targetRole]);
      }
      // If no valid target role selected, go to panel selector
      redirect(roleRoutes[UserRole.SUPERADMIN]);
    }
    // For all other users, redirect based on their role
    else if (userRole && userRole in roleRoutes) {
      redirect(roleRoutes[userRole]);
    } else {
      console.warn(`Unrecognized user role: ${user.role}`);
      redirect("/");
    }
  }

  return <>{children}</>;
}
