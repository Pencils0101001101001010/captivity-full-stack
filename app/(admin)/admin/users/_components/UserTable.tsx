"use client";

import React, { useState, useMemo } from "react";
import { User } from "lucide-react";
import { UserRole } from "@prisma/client";
import UserRoleSelect from "./UserRoleSelect";
import SearchField from "@/app/(admin)/_components/SearchField";

interface UserTableProps {
  users: any[]; // Replace with your User type
  title: string;
}

const UserTable = ({ users, title }: UserTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    const lowerSearch = searchTerm.toLowerCase();
    return users.filter(user => {
      const searchFields = [
        user.displayName,
        user.firstName,
        user.lastName,
        user.email,
        user.companyName,
      ];

      return searchFields.some(field =>
        field?.toLowerCase().includes(lowerSearch)
      );
    });
  }, [users, searchTerm]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="w-72">
          <SearchField onSearch={handleSearch} initialValue={searchTerm} />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center text-gray-500">
          {searchTerm
            ? `No ${title.toLowerCase()} found matching "${searchTerm}"`
            : `No ${title.toLowerCase()} to display at this time`}
        </div>
      ) : (
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
              {filteredUsers.map(user => (
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
      )}
    </div>
  );
};

export default UserTable;
