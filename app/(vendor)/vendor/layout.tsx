// app/(vendor)/layout.tsx
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "../SessionProvider";
import { headers } from "next/headers";
import type { SessionContext, User } from "../SessionProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "../_components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
  params: { vendor_website: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const authResult = await validateRequest();

  // Create properly typed session context
  const session: SessionContext = {
    user: authResult.user as User | null,
  };

  const vendorWebsite = params?.vendor_website;

  // Skip auth check for vendor_auth page
  const currentPath = headers().get("x-invoke-path") || "";
  if (currentPath === "/vendor_auth") {
    return <SessionProvider value={session}>{children}</SessionProvider>;
  }

  // If no user is logged in, redirect to vendor auth
  if (!session.user) {
    const callbackUrl = encodeURIComponent(currentPath);
    redirect(`/vendor_auth?callbackUrl=${callbackUrl}`);
  }

  // Check if user has vendor-related role
  if (
    session.user.role !== "VENDOR" &&
    session.user.role !== "VENDORCUSTOMER"
  ) {
    redirect("/vendor_auth");
  }

  // For vendors, check if they own this vendor website
  if (session.user.role === "VENDOR") {
    if (session.user.vendor_website !== vendorWebsite) {
      const message = encodeURIComponent(
        "You can only access your own vendor pages"
      );
      redirect(`/vendor_auth?error=${message}`);
    }
  }

  // For vendor customers, check if they have access to this vendor
  if (session.user.role === "VENDORCUSTOMER") {
    const hasAccess = session.user.associated_vendors?.includes(vendorWebsite);
    if (!hasAccess) {
      const message = encodeURIComponent(
        "You don't have access to this vendor"
      );
      redirect(`/vendor_auth?error=${message}`);
    }
  }

  return (
    <SessionProvider value={session}>
      <Toaster />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="bg-slate-400"></div>
        <div className="flex w-full grow">
          <main className="flex-grow">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}

export const dynamic = "force-dynamic";
