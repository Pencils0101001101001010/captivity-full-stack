import { UserRole } from "@prisma/client";
import UserTable from "../../_components/UserTable";

export default function PendingUsersPage() {
  return (
    <div className="p-6">
      <UserTable role={UserRole.CUSTOMER} title="Pending Approval Users" />
    </div>
  );
}
