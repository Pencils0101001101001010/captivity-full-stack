import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./_components/Navbar";
import CategoriesDropDown from "../(user)/_components/CategoriesDropDown";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user || session.user.role !== "CUSTOMER") redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="bg-slate-400">
          <CategoriesDropDown />
        </div>
        <div className="flex w-full grow">
          <main className="flex-grow">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
