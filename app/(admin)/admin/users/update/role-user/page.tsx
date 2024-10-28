import { UserRole } from "@prisma/client";
import UserTable from "../../_components/UserTable";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
  return (
    <div className="p-6">
      <UserTable 
        role={UserRole.USER} 
        title="Pending Approval Users" 
        searchParams={searchParams as { q?: string }}
      />
    </div>
  );
}
