import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  children,
  icon: Icon,
  variant = "default",
  size = "default",
  className = "",
}) => {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href} className="flex items-center">
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {children}
      </Link>
    </Button>
  );
};

export default LinkButton;
