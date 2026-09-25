import React, { useState } from "react";
import { BiHome } from "react-icons/bi";
import { BsCode } from "react-icons/bs";
import { LuHistory, LuUser, LuMenu, LuX, LuLayers } from "react-icons/lu";
import { NavLink } from "react-router";

export type NavItemKey = "home" | "problems" | "history" | "profile";

export interface NavbarProps {
  activeItem?: NavItemKey;
  onNavigate?: (item: NavItemKey) => void;
}

interface NavLinkConfig {
  key: NavItemKey;
  label: string;
  icon: React.ElementType;
  to: string;
}

const NAV_ITEMS: NavLinkConfig[] = [
  { key: "home", label: "Home", icon: BiHome, to: "/" },
  { key: "problems", label: "Problems", icon: BsCode, to: "/problems" },
  {
    key: "history",
    label: "Past Submissons",
    icon: LuHistory,
    to: "/submissions",
  },
  { key: "profile", label: "Profile", icon: LuUser, to: "/profile" },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeItem = "problems",
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItemKey,
  ) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(item);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <a
          href="/"
          onClick={(e) => handleItemClick(e, "home")}
          className="flex items-center gap-2 font-semibold tracking-tight text-slate-900 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <LuLayers className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-900">LLD Platform</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ key, label, icon: Icon, to }) => {
            const isActive = activeItem === key;
            return (
              <NavLink
                key={key}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <LuX className="h-5 w-5" />
            ) : (
              <LuMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-2 md:hidden">
          <nav className="flex flex-col space-y-1">
            {NAV_ITEMS.map(({ key, label, icon: Icon, to }) => {
              const isActive = activeItem === key;
              return (
                <NavLink
                  key={key}
                  to={to}
                  onClick={(e) => handleItemClick(e, key)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                  />
                  <span>{label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
