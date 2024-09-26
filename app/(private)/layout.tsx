import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await validateRequest();

  if (!user.session) redirect("/login");

  return (
    <SessionProvider value={user}>
      <div className="flex min-h-screen flex-col">
        {/* <Navbar /> */}
        <div className="flex w-full grow">
          {/* Sidebar will be hidden on small screens and a toggle button can be added */}
          {/* <Sidebar className="hidden h-screen w-64 lg:block" /> */}
          <main className="flex-grow p-5">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
