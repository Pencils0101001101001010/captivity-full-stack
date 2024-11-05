import { redirect } from "next/navigation";
import UpdateUserForm from "./_components/UpdateUserForm";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { UserData } from "./types";

async function getCurrentUser(): Promise<UserData> {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true, // Add this
      firstName: true,
      lastName: true,
      displayName: true,
      email: true,
      phoneNumber: true,
      website: true,
      bio: true,
      streetAddress: true,
      addressLine2: true,
      suburb: true,
      townCity: true,
      postcode: true,
      country: true,
      companyName: true,
      vatNumber: true,
      ckNumber: true,
      position: true,
      natureOfBusiness: true,
      currentSupplier: true,
      otherSupplier: true,
      resellingTo: true,
      salesRep: true,
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  return dbUser as UserData;
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-8">Update Profile</h1>
      <UpdateUserForm user={user} />
    </div>
  );
}
