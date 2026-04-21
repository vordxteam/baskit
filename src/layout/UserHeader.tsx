"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ChevronRight, LogOut, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import CartDrawer from "@/app/(user-pages)/product/CartDrawer";
import { useCart } from "@/hooks/useCart";
import { CART_OPEN_EVENT } from "@/utils/cart";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/hooks/useAuth";
import { Heart } from "lucide-react";
import { Favourite } from "@/api/favourite";

const FAVORITES_UPDATED_EVENT = "favorites-updated";
const navLinks = [
  // { label: "Shop", href: "/product" },
  { label: "Gift Baskits", href: "/gift-hampers" },
  { label: "Bouquets", href: "/bouqets" },
  // { label: "Categories", href: "#" },
  { label: "Top Selling", href: "/top-selling" },
  { label: "About us", href: "/about" },
];

const UserHeader = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [storedRole, setStoredRole] = useState("");
  const [hasFavourites, setHasFavourites] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isCustomer = storedRole === 'CUSTOMER';
  const isFavoritesPage = pathname === "/favorites";

  useEffect(() => {
    const favouriteApi = new Favourite();

    const fetchFavouriteState = async () => {
      const token = localStorage.getItem("accessToken");
      const role = (localStorage.getItem("role") || "").toUpperCase();

      if (!token || role !== "CUSTOMER") {
        setHasFavourites(false);
        return;
      }

      try {
        const favourites = await favouriteApi.getFavourites();
        setHasFavourites(favourites.length > 0);
      } catch (error) {
        console.error("Failed to load favourites for header:", error);
        setHasFavourites(false);
      }
    };

    fetchFavouriteState();

    const handleFavouriteUpdate = () => {
      fetchFavouriteState();
    };

    window.addEventListener(FAVORITES_UPDATED_EVENT, handleFavouriteUpdate);

    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, handleFavouriteUpdate);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsProfileMenuOpen(false);
      router.push("/signin");
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };
  useEffect(() => {
    setStoredRole((localStorage.getItem("role") || "").toUpperCase());

    const checkScreen = () => setIsMobile(window.innerWidth < 1024);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleOpenCart = () => {
      setIsCartOpen(true);
    };

    checkScreen();
    handleScroll();

    window.addEventListener("resize", checkScreen);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener(CART_OPEN_EVENT, handleOpenCart);

    return () => {
      window.removeEventListener("resize", checkScreen);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener(CART_OPEN_EVENT, handleOpenCart);
    };
  }, []);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-profile-dropdown-root]")) {
        setIsProfileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileMenuOpen]);

  const phoneLink = isMobile
    ? "tel:+923170000000"
    : "https://wa.me/923170000000";

  const emailLink =
    "https://mail.google.com/mail/?view=cm&fs=1&to=baskit@gmail.com";

  const isActive = (href: string) => href !== "#" && pathname === href;

  return (
    <>
      {/* HEADER 1 - NORMAL / NON-STICKY */}
      <header
        className={`w-full transition-all duration-300 border-b border-[#25252533] ${isScrolled ? "bg-[#F5F1E8] py-3" : "bg-transparent py-[18px]"
          }`}
      >
        <div className="flex items-center justify-between w-full px-6 lg:px-20">
          {/* LEFT */}
          <div className="items-center gap-5 hidden sm:flex">
            <div className="flex items-center gap-5">
              <Link href="https://facebook.com" target="_blank">
                <Image
                  src="/images/icons/facebook.svg"
                  width={20}
                  height={20}
                  alt="icon"
                />
              </Link>
              <Link href="https://instagram.com" target="_blank">
                <Image
                  src="/images/icons/instagram.svg"
                  width={20}
                  height={20}
                  alt="icon"
                />
              </Link>
              <Link href="https://tiktok.com" target="_blank">
                <Image
                  src="/images/icons/tiktok.svg"
                  width={20}
                  height={20}
                  alt="icon"
                />
              </Link>
            </div>
            <h1 className="text-[#252525B8] text-[14px]">
              Best special offers! 25% off
            </h1>
          </div>

          {/* LOGO */}
          <Link href="/">
            <Image src="/images/logo.svg" width={100} height={27} alt="logo" />
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-5">
            <Image
              src="/images/icons/search.svg"
              width={20}
              height={20}
              alt="icon"
              className="cursor-pointer"
            />

            <Link href="/favorites">
              <Heart
                size={20}
                className={`cursor-pointer transition-all ${isFavoritesPage || hasFavourites
                    ? "fill-red-500 text-red-500"
                    : "text-[#252525B8] hover:text-red-500"
                  }`}
              />
            </Link>
            <div className="relative" data-profile-dropdown-root>
              <button
                type="button"
                className="text-[#252525B8] text-[14px]"
                aria-label="Open account menu"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
                onClick={() => setIsProfileMenuOpen((previous) => !previous)}
              >
                <Image
                  src="/images/icons/profile.svg"
                  width={20}
                  height={20}
                  alt="icon"
                  className="cursor-pointer"
                />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full z-60 mt-3.5 w-[320px] bg-gray-50 p-5 shadow-[0_12px_30px_rgba(37,37,37,0.18)]">
                  {isCustomer ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="overflow-hidden rounded-full bg-[#D9D9D9]">
                          <Image
                            src="/images/icons/profile.svg"
                            width={52}
                            height={52}
                            alt="Profile"
                          />
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="cursor-pointer"
                        >

                          <p className="text-[16px] leading-5 text-[#252525] tobia-normal">
                            {user?.data?.first_name || "Customer"} {user?.data?.last_name || "Customer"}
                          </p>
                          <p className="text-[14px] leading-5 text-[#25252599] font-normal">
                            {user?.data?.email || ""}
                          </p>
                        </Link>
                      </div>

                      <div className="my-5 h-px bg-[#2525251A]" />

                      <div className="space-y-3">
                        <Link
                          href="#"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center justify-between text-[16px] leading-5 text-[#252525CC] font-normal"
                        >
                          <span>Drafts</span>
                          <ChevronRight size={30} strokeWidth={1.25} className="text-[#25252599]" />
                        </Link>
                        <Link
                          href="/my-orders"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center justify-between text-[16px] leading-5 text-[#252525CC] font-normal"
                        >
                          <span>My orders</span>
                          <ChevronRight size={30} strokeWidth={1.25} className="text-[#25252599]" />
                        </Link>
                      </div>

                      <div className="my-5 h-px bg-[#2525251A]" />

                      <div className="space-y-3">
                        <Link
                          href="/settings"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center justify-between text-[16px] leading-5 text-[#252525CC] font-normal"
                        >
                          <span>Account settings</span>
                          <ChevronRight size={30} strokeWidth={1.25} className="text-[#25252599]" />
                        </Link>
                        <Link
                          href="/help"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center justify-between text-[16px] leading-5 text-[#252525CC] font-normal"
                        >
                          <span>Help & support</span>
                          <ChevronRight size={30} strokeWidth={1.25} className="text-[#25252599]" />
                        </Link>
                      </div>

                      <div className="my-5 h-px bg-[#2525251A]" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-between text-[16px] leading-5 text-[#252525CC] font-normal"
                      >
                        <span>Logout</span>
                        <LogOut size={28} strokeWidth={1.5} className="text-[#25252599]" />
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-[16px] leading-5 text-[#252525] tobia-normal">Welcome</h3>
                      <p className="mt-2 text-[14px] leading-5 text-[#25252599] font-normal">
                        Sign in to track orders and save your preferences.
                      </p>

                      <Button variant="primary" onClick={() => {
                        router.push("/signin")
                        setIsProfileMenuOpen(false)
                      }} className='w-full my-8'>
                        Sign in
                      </Button>

                      <div className="space-y-3">
                        <Link
                          href="/track-order"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center justify-between text-[16px] leading-5 text-[#252525CC] font-normal"
                        >
                          <span>Track order</span>
                          <ChevronRight size={22} strokeWidth={1.5} className="text-[#25252599]" />
                        </Link>
                        <Link
                          href="/help"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center justify-between text-[16px] leading-5 text-[#252525CC] font-normal"
                        >
                          <span>Help & support</span>
                          <ChevronRight size={22} strokeWidth={1.5} className="text-[#25252599]" />
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1 cursor-pointer transition-opacity duration-300 hover:opacity-70"
            >
              <Image
                src="/images/icons/cart.svg"
                width={20}
                height={20}
                alt="cart icon"
              />
              <span className="text-[#252525B8] text-[14px]">( {totalItems} )</span>
            </button>

            <button
              className="lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* HEADER 2 - STICKY DESKTOP NAV */}
      <div
        className={`hidden lg:flex sticky top-0 z-20 items-center justify-between w-full px-20 py-2.5 border-b border-[#25252533] transition-all duration-300 ${isScrolled ? "bg-[#F5F1E8] shadow-md" : ""
          }`}
      >
        {/* LEFT */}
        <div className="flex items-center gap-5">
          <Link
            href={phoneLink}
            target="_blank"
            className="text-[#252525B8] text-[14px]"
          >
            +92 317 0000000
          </Link>
          <Link
            href={emailLink}
            target="_blank"
            className="text-[#252525B8] text-[14px]"
          >
            baskit@gmail.com
          </Link>
        </div>

        {/* CENTER NAV */}
        <div className="flex items-center gap-5">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`text-[14px] transition-all leading-5 duration-150 ${isActive(href)
                ? "text-[#252525] font-semibold"
                : "text-[#252525B8] font-normal hover:text-[#252525]"
                }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <Link
            href="https://maps.google.com"
            target="_blank"
            className="text-[#252525B8] text-[14px]"
          >
            145G Block, DHA Phase 1, Lahore
          </Link>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-[#F5F1E8] z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#2525251F]">
          <Image src="/images/logo.svg" width={80} height={22} alt="logo" />
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 pt-6">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-[15px] ${isActive(href)
                ? "text-[#252525] font-semibold"
                : "text-[#252525B8]"
                }`}
            >
              {label}
            </Link>
          ))}

          <hr className="border-[#2525251F]" />

          <Link href={phoneLink} className="text-[14px] text-[#252525B8]">
            +92 317 0000000
          </Link>
          <Link href={emailLink} className="text-[14px] text-[#252525B8]">
            baskit@gmail.com
          </Link>
        </div>
      </div>

      {/* CART DRAWER */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default UserHeader;