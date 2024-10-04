import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  if (session.user.role !== "ADMIN") redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex w-full grow">
          {/* Sidebar will be hidden on small screens and a toggle button can be added */}
          <Sidebar className="hidden h-full w-64 lg:block" />
          <main className="flex-grow p-5">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
