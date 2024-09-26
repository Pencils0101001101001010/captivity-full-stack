import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

// Define the routes for each role
const roleRoutes = {
  USER: "/",
  ADMIN: "/dashboard",
};

type UserRole = keyof typeof roleRoutes;

export default async function RoleBasedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (user) {
    const userRole = user.role as UserRole;

    if (userRole in roleRoutes) {
      redirect(roleRoutes[userRole]);
    } else {
      redirect("/");
    }
  }
  return <>{children}</>;
}
