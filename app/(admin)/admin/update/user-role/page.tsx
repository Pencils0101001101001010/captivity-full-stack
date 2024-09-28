import React from "react";
import UserTable from "./UserTable";

const Page = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <UserTable />
    </div>
  );
};

export default Page;
