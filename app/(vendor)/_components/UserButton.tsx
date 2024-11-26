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
        alignOffset={0}
        sideOffset={8}
        className="w-[200px] md:w-56"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">@{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.username && (
          <DropdownMenuItem asChild>
            <Link
              href={`/users/${user.username}`}
              className="w-full cursor-pointer"
            >
              <UserIcon className="mr-2 size-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex w-full items-center">
            <Monitor className="mr-2 size-4" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            className="w-[200px] md:w-[180px]"
            alignOffset={0}
            sideOffset={2}
          >
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="flex w-full cursor-pointer items-center justify-between"
            >
              <div className="flex items-center">
                <Monitor className="mr-2 size-4" />
                <span>System</span>
              </div>
              {theme === "system" && <Check className="ml-2 size-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="flex w-full cursor-pointer items-center justify-between"
            >
              <div className="flex items-center">
                <Sun className="mr-2 size-4" />
                <span>Light</span>
              </div>
              {theme === "light" && <Check className="ml-2 size-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="flex w-full cursor-pointer items-center justify-between"
            >
              <div className="flex items-center">
                <Moon className="mr-2 size-4" />
                <span>Dark</span>
              </div>
              {theme === "dark" && <Check className="ml-2 size-4" />}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await logout();
          }}
          className="flex w-full cursor-pointer items-center text-destructive focus:text-destructive"
        >
          <LogOutIcon className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
