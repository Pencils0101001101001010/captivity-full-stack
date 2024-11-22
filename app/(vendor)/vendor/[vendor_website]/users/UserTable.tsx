import { useSession } from "@/app/(vendor)/SessionProvider";
import React from "react";

const UserTable = () => {
  const session = useSession();
  // If not authenticated or not a vendor, don't render the form
  if (!session || session?.user?.role !== "VENDOR") {
    return null;
  }
  return (
    <div>
      <h1>UserTable</h1>
    </div>
  );
};

export default UserTable;
