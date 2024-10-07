import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./_components/Navbar";
import CategoriesDropDown from "./_components/CategoriesDropDown";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  if (session.user.role !== "CUSTOMER") redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="bg-slate-300">
          <CategoriesDropDown />
        </div>
        <div className="flex w-full grow">
          <main className="flex-grow">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
