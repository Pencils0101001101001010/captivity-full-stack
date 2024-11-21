// app/vendor/layout.tsx
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "../SessionProvider";
import Navbar from "../_components/Navbar";
import { unstable_noStore as noStore } from "next/cache";

// Only the top-level vendor layout should be dynamic
export const dynamic = "force-dynamic";

async function validateVendorSession() {
  const session = await validateRequest();
  if (
    !session.user ||
    (session.user.role !== "VENDOR" && session.user.role !== "VENDORCUSTOMER")
  ) {
    redirect("/vendor_auth");
  }
  return session;
}

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();

  const session = await validateVendorSession();

  return (
    <SessionProvider value={session}>
      <Toaster />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-grow p-2">{children}</div>
      </div>
    </SessionProvider>
  );
}
