import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

enum UserRole {
  VENDOR = "VENDOR",
  VENDORCUSTOMER = "VENDORCUSTOMER",
}

interface User {
  id: string;
  role: string;
  vendor_website?: string;
  associated_vendors?: string[];
}

interface Session {
  user: User | null;
}

function toUserRole(role: string): UserRole | undefined {
  return Object.values(UserRole).includes(role as UserRole)
    ? (role as UserRole)
    : undefined;
}

function hasVendorRole(role: string | undefined): boolean {
  return role === UserRole.VENDOR || role === UserRole.VENDORCUSTOMER;
}

type LayoutProps = {
  children: React.ReactNode;
  params: { vendor_website: string };
};

export default async function Layout({ children, params }: LayoutProps) {
  // Skip auth check for vendor_auth page
  const currentPath = headers().get("x-invoke-path") || "";
  if (currentPath === "/vendor_auth") {
    return children;
  }

  const { user } = (await validateRequest()) as Session;
  const vendorWebsite = params?.vendor_website;

  // If no user is logged in, redirect to vendor auth
  if (!user) {
    const callbackUrl = encodeURIComponent(currentPath);
    redirect(`/vendor_auth?callbackUrl=${callbackUrl}`);
  }

  // Check if user has vendor-related role
  if (!hasVendorRole(user.role)) {
    redirect("/vendor_auth");
  }

  // For vendors, check if they own this vendor website
  if (user.role === UserRole.VENDOR) {
    if (user.vendor_website !== vendorWebsite) {
      const message = encodeURIComponent(
        "You can only access your own vendor pages"
      );
      redirect(`/vendor_auth?error=${message}`);
    }
    return children;
  }

  // For vendor customers, check if they have access to this vendor
  if (user.role === UserRole.VENDORCUSTOMER) {
    const hasAccess = user.associated_vendors?.includes(vendorWebsite);
    if (!hasAccess) {
      const message = encodeURIComponent(
        "You don't have access to this vendor"
      );
      redirect(`/vendor_auth?error=${message}`);
    }
    return children;
  }

  // Fallback redirect
  redirect("/vendor_auth");
}

export const dynamic = "force-dynamic";
