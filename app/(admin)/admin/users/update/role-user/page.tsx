import { UserRole } from "@prisma/client";
import UserTable from "../../_components/UserTable";

export default function PendingUsersPage() {
  return (
    <div className="p-6">
      <UserTable role={UserRole.USER} title="Pending Approval Users" />
    </div>
  );
}
