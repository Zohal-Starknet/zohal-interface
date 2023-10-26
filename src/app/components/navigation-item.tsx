"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItemProps {
  label: string;
  pathname: string;
}

export default function NavigationItem(props: NavigationItemProps) {
  const { label, pathname } = props;

  const currentPathname = usePathname();
  const isActiveLink = currentPathname === pathname;

  return (
    <li>
      <Link
        className={`rounded-md px-2 py-2 transition-colors hover:bg-[#1d1f23] ${
          isActiveLink ? "bg-[#1d1f23]" : ""
        }`}
        href={pathname}
      >
        {label}
      </Link>
    </li>
  );
}
