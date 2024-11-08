import React, { memo } from "react";
import Link from "next/link";

interface BaseQuickActionProps {
  title: string;
  description: string;
  gradient: string;
}

interface LinkQuickActionProps extends BaseQuickActionProps {
  href: string;
  onClick?: never;
}

interface ButtonQuickActionProps extends BaseQuickActionProps {
  onClick: () => void;
  href?: never;
}

type QuickActionProps = LinkQuickActionProps | ButtonQuickActionProps;

const QuickActionButton = memo<QuickActionProps>(
  ({ title, description, gradient, onClick, href }) => {
    const content = (
      <>
        <h3 className="mb-2 text-lg font-medium">{title}</h3>
        <p className="text-sm">{description}</p>
      </>
    );

    const className = `p-6 w-full text-left transition-all ${gradient} rounded-xl hover:shadow-md`;

    if (href) {
      return (
        <Link className={className} href={href}>
          {content}
        </Link>
      );
    }

    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }
);

QuickActionButton.displayName = "QuickActionButton";

export default QuickActionButton;
