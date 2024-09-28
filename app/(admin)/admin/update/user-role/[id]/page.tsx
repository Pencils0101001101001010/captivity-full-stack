"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import UpdateUserRoleForm from "./UserRolesUpdate";

const UpdateUserRolePage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams?.get("userId") || "";

  if (!userId) {
    return <div>Invalid user ID</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900">
          Update User Role
        </h1>
        <div className="mt-5">
          <UpdateUserRoleForm userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default UpdateUserRolePage;
