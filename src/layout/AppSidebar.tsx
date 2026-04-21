"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  GridIcon,
  UserCircleIcon,
  BoxCubeIcon,
  DollarLineIcon,
  BellIcon,
  bringTofront as BringToFront,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/admin/profile",
  },
  {
    icon: <GridIcon />,
    name: "Products",
    path: "/admin/products",
  },
  {
    icon: <GridIcon />,
    name: "Ocassions",
    path: "/admin/category",
  },
  {
    icon: <GridIcon />,
    name: "Product Types",
    path: "/admin/product-category",
  },
  {
    icon: <BringToFront />,
    name: "Product Subtypes",
    path: "/admin/product-subtype",
  },
  {
    icon: <GridIcon />,
    name: "Product Styles",
    path: "/admin/product-style",
  },
  {
    icon: <GridIcon />,
    name: "Product Sizes",
    path: "/admin/product-sizes",
  },
  {
    icon: <BringToFront />,
    name: "Baskit Containers",
    path: "/admin/baskit-container",
  },
  {
    icon: <GridIcon />,
    name: "Inventory Item Types",
    path: "/admin/catalog-types",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Inventory Items",
    path: "/admin/inventory",
  },
  {
    icon: <BringToFront />,
    name: "Orders",
    path: "/admin/orders",
  },


];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const showSidebarLabels = isExpanded || isHovered || isMobileOpen;

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === path;

    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`pt-4 pb-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {showSidebarLabels ? (
            <>
              <h1 className="text-[#4E0A0B] text-[50px] italic dark:hidden">Baskit</h1>
              <h1 className="text-[#b18283] text-[50px] italic hidden dark:block">Baskit</h1>
            </>
          ) : (
            <h1 className="text-black dark:text-white text-[50px] italic">B</h1>
          )}
        </Link>
      </div>

      <div className="flex h-full flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <ul className="flex flex-col gap-4">
            {navItems.map((nav) => (
              <li key={nav.name}>
                <Link
                  href={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                    }`}
                >
                  <span
                    className={`${isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>

                  {showSidebarLabels && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pb-6">
          {showSidebarLabels && (
            <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
              Reports & Updates
            </div>
          )}

          <nav>
            <ul className="flex flex-col gap-4">
              <li>
                <Link
                  href="/admin/reports"
                  className={`menu-item group ${isActive("/admin/reports") ? "menu-item-active" : "menu-item-inactive"}`}
                >
                  <span className={`${isActive("/admin/reports") ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                    <DollarLineIcon />
                  </span>
                  {showSidebarLabels && <span className="menu-item-text">Revenue Report</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/announcements"
                  className={`menu-item group ${isActive("/admin/announcements") ? "menu-item-active" : "menu-item-inactive"}`}
                >
                  <span className={`${isActive("/admin/announcements") ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                    <BellIcon />
                  </span>
                  {showSidebarLabels && <span className="menu-item-text">Announcements</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;