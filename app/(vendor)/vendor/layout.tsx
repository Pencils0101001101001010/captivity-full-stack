import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "../SessionProvider";
import Navbar from "../_components/Navbar";

export const dynamic = "force-dynamic";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (
    !session.user ||
    (session.user.role !== "VENDOR" && session.user.role !== "VENDORCUSTOMER")
  ) {
    redirect("/vendor_auth");
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
