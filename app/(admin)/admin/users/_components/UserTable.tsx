import React from "react";
import { User } from "lucide-react";
import {
  fetchPendingApprovalUsers,
  fetchCustomers,
  fetchSubscribers,
  fetchPromoUsers,
  fetchDistributors,
  fetchShopManagers,
  fetchEditors,
  type FetchUsersResult,
} from "../actions";
import { UserRole } from "@prisma/client";
import UserRoleSelect from "./UserRoleSelect";
import UserTableSearch from "@/app/(admin)/_components/SearchField";

interface UserTableProps {
  role: UserRole;
  title: string;
  searchParams?: { q?: string };
}

async function fetchUsersByRole(role: UserRole): Promise<FetchUsersResult> {
  switch (role) {
    case UserRole.USER:
      return fetchPendingApprovalUsers();
    case UserRole.CUSTOMER:
      return fetchCustomers();
    case UserRole.SUBSCRIBER:
      return fetchSubscribers();
    case UserRole.PROMO:
      return fetchPromoUsers();
    case UserRole.DISTRIBUTOR:
      return fetchDistributors();
    case UserRole.SHOPMANAGER:
      return fetchShopManagers();
    case UserRole.EDITOR:
      return fetchEditors();
    default:
      return {
        success: false,
        error: "Invalid role specified",
      };
  }
}

const UserTable = async ({ role, title, searchParams }: UserTableProps) => {
  const result = await fetchUsersByRole(role);

  if (!result.success) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {result.error}</span>
      </div>
    );
  }

  let users = result.data;

  // Filter users based on search query
  const searchQuery = searchParams?.q?.toLowerCase();
  if (searchQuery) {
    users = users.filter(user => {
      const searchFields = [
        user.displayName,
        user.firstName,
        user.lastName,
        user.email,
        user.companyName,
      ].map(field => field?.toLowerCase() || "");

      return searchFields.some(field => field.includes(searchQuery));
    });
  }

  if (users.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="w-72">
            <UserTableSearch />
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
          {searchQuery
            ? `No ${title.toLowerCase()} found matching "${searchParams?.q}"`
            : `No ${title.toLowerCase()} to display at this time`}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="w-72">
          <UserTableSearch />
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Company
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <User className="w-full h-full rounded-full text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap font-semibold">
                        {user.displayName ||
                          `${user.firstName} ${user.lastName}`}
                      </p>
                      <p className="text-gray-600 whitespace-no-wrap">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <UserRoleSelect userId={user.id} initialRole={user.role} />
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {user.companyName}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(user.createdAt).toLocaleTimeString()}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export type { UserTableProps };
export default UserTable;
