"use client";

import React, { useState } from "react";
import { UserRole } from "@prisma/client";
import { updateUserRole } from "./actions";

interface UserRoleSelectProps {
  userId: string;
  initialRole: UserRole;
}

const UserRoleSelect: React.FC<UserRoleSelectProps> = ({
  userId,
  initialRole,
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as UserRole;
    setRole(newRole);
    setIsUpdating(true);
    setError(null);

    try {
      const result = await updateUserRole(userId, newRole);
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setRole(initialRole); // Revert to the initial role if there's an error
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <select
        value={role}
        onChange={handleRoleChange}
        disabled={isUpdating}
        className="block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        {Object.values(UserRole).map((roleOption) => (
          <option key={roleOption} value={roleOption}>
            {roleOption}
          </option>
        ))}
      </select>
      {isUpdating && <p className="text-gray-500 mt-1">Updating...</p>}
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default UserRoleSelect;
