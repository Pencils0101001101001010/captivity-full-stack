import React from "react";

import { User } from "lucide-react";
import UserRoleSelect from "./UserRoleSelect";
import { fetchAllUsers } from "./actions";

const UserTable = async () => {
  const result = await fetchAllUsers();

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

  const users = result.data;

  return (
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
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10">
                    <User className="w-full h-full rounded-full" />
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-900 whitespace-no-wrap font-semibold">
                      {user.displayName || `${user.firstName} ${user.lastName}`}
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
