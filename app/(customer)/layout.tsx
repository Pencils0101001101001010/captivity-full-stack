// CustomerLayout.tsx
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./_components/Navbar";
import CategoriesDropDown from "./_components/CategoriesDropDown";
import ReduxProvider from "./ReduxProvider";
export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user || session.user.role !== "CUSTOMER") redirect("/login");

  return (
    <SessionProvider value={session}>
      <ReduxProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="bg-slate-300">
            <CategoriesDropDown />
          </div>
          <div className="flex w-full grow">
            <main className="flex-grow">{children}</main>
          </div>
        </div>
      </ReduxProvider>
    </SessionProvider>
  );
}
