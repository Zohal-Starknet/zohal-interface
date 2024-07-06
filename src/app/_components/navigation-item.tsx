"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ExternalLinkIcon } from "../_ui/icons";

type NavigationItemProps = {
  /** Is the link linking to an external website */
  isExternal?: boolean;
  /** Label shown in the link */
  label: string;
  /** Path the user will get redirected to when clicking on the link */
  pathname: string;
};

export default function NavigationItem(props: NavigationItemProps) {
  const { isExternal, label, pathname } = props;

  const currentPathname = usePathname();
  const isActiveLink = currentPathname!.includes(pathname);

  return (
    <li>
      <Link
        className={clsx(
          "text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-1 rounded-md p-2 transition-colors",
          isActiveLink && "bg-secondary text-foreground",
        )}
        href={pathname}
        rel={isExternal ? "noopener noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
      >
        {label}
        {isExternal ? <ExternalLinkIcon label="External" /> : null}
      </Link>
    </li>
  );
}
