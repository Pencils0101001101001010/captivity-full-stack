import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";
import { updateUserRole } from "./actions";

const UserRole = z.enum([
  "USER",
  "CUSTOMER",
  "SUBSCRIBER",
  "PROMO",
  "DISTRIBUTOR",
  "SHOPMANAGER",
  "EDITOR",
  "ADMIN",
]);

const updateUserRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  newRole: UserRole,
});

type FormData = z.infer<typeof updateUserRoleSchema>;

const UpdateUserRoleForm = ({ userId }: { userId: string }) => {
  const searchParams = useSearchParams();
  const error = searchParams ? searchParams.get("error") : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateUserRoleSchema),
    defaultValues: {
      userId,
    },
  });

  const onSubmit = async (data: FormData) => {
    // The server action will handle redirection, so we don't need to do anything here
    await updateUserRole(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("userId")} />

      <div>
        <label
          htmlFor="newRole"
          className="block text-sm font-medium text-gray-700"
        >
          New Role
        </label>
        <select
          id="newRole"
          {...register("newRole")}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {UserRole.options.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.newRole && (
          <p className="mt-2 text-sm text-red-600">{errors.newRole.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update Role
      </button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

export default UpdateUserRoleForm;
