"use client";

import { cn } from "@/lib/utils";
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { useSession } from "../SessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "../vendor_auth/actions";

interface User {
  id: string;
  name?: string;
  email?: string;
  role: "VENDOR" | "VENDORCUSTOMER";
  vendor_website?: string;
  associated_vendors?: string[];
  avatarUrl?: string;
  username?: string;
}

interface SessionContext {
  user: User | null;
}

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();

  if (!user) {
    return null;
  }

  const displayName = user.username || user.name || user.email || "User";

  return (
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
        >
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        sideOffset={8}
        alignOffset={0}
      >
        <DropdownMenuLabel>Logged in as @{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.username && (
          <Link href={`/users/${user.username}`}>
            <DropdownMenuItem>
              <UserIcon className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="w-full">
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent
              className="min-w-[8rem]"
              sideOffset={2}
              alignOffset={-5}
            >
              <DropdownMenuItem
                className="flex items-center justify-between"
                onClick={() => setTheme("system")}
              >
                <div className="flex items-center">
                  <Monitor className="mr-2 size-4" />
                  <span>System</span>
                </div>
                {theme === "system" && <Check className="ml-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center justify-between"
                onClick={() => setTheme("light")}
              >
                <div className="flex items-center">
                  <Sun className="mr-2 size-4" />
                  <span>Light</span>
                </div>
                {theme === "light" && <Check className="ml-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center justify-between"
                onClick={() => setTheme("dark")}
              >
                <div className="flex items-center">
                  <Moon className="mr-2 size-4" />
                  <span>Dark</span>
                </div>
                {theme === "dark" && <Check className="ml-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center"
          onClick={async () => {
            await logout();
          }}
        >
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
