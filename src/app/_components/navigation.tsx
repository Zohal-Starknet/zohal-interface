"use client";
import { useState } from "react";
import { getDashboardPath, getTradePath } from "../_helpers/routes";
import NavigationItem from "./navigation-item";
export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <nav>
      {/* Mobile menu button */}
      <div className="block lg:hidden">
        <button onClick={toggleMobileMenu} className="p-2 focus:outline-none">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <ul className="absolute block rounded-md bg-white p-4 shadow-md lg:hidden">
          <NavigationItem label="Trade" pathname={getTradePath()} />
          <NavigationItem label="Dashboard" pathname={getDashboardPath()} />
        </ul>
      )}

      {/* Desktop menu */}
      <ul className="hidden gap-2 lg:flex">
        <NavigationItem label="Trade" pathname={getTradePath()} />
        <NavigationItem label="Dashboard" pathname={getDashboardPath()} />
      </ul>
    </nav>
  );
}
