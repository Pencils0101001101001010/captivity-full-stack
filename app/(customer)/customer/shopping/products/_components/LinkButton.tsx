import React from "react";
import Link from "next/link";
import { Button, ButtonProps } from "@/components/ui/button";

interface LinkButtonProps extends Omit<ButtonProps, "asChild"> {
  href: string;
  children: React.ReactNode;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  return (
    <Button
      asChild
      variant={variant}
      className={`ml-8 mt-2 ${className}`}
      {...props}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

export default LinkButton;
