// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import React, { useState, useEffect } from "react";
// import { Menu } from "lucide-react";
// import CartDrawer from "@/app/admin/(others-pages)/products/CartDrawer";

// const UserHeader = () => {
//   const [isMobile, setIsMobile] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);

//   useEffect(() => {
//     const checkScreen = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };

//     checkScreen();
//     window.addEventListener("resize", checkScreen);

//     return () => window.removeEventListener("resize", checkScreen);
//   }, []);

//   // ✅ Dynamic phone link
//   const phoneLink = isMobile
//     ? "tel:+923170000000"
//     : "https://wa.me/923170000000";

//   // ✅ Gmail compose
//   const emailLink =
//     "https://mail.google.com/mail/?view=cm&fs=1&to=baskit@gmail.com";

//   return (
//     <>
//       {/* HEADER 1 */}
//       <div className="flex items-center justify-between w-full px-6 lg:px-20 py-[18px] border-b border-[#25252533] relative">
//         {/* LEFT */}
//         <div className=" items-center gap-5 hidden sm:flex">
//           <Link href="https://facebook.com" target="_blank">
//             <Image src="/images/icons/facebook.svg" width={20} height={20} alt="icon" />
//           </Link>
//           <Link href="https://instagram.com" target="_blank">
//             <Image src="/images/icons/instagram.svg" width={20} height={20} alt="icon" />
//           </Link>
//           <Link href="https://tiktok.com" target="_blank">
//             <Image src="/images/icons/tiktok.svg" width={20} height={20} alt="icon" />
//           </Link>

//           {/* Hide text on small */}
//           <h1 className=" text-[#252525B8] text-[14px]">
//             Best special offers! 25% off
//           </h1>
//         </div>

//         {/* LOGO */}
//         <div>
//           <Image src="/images/logo.svg" width={100} height={27} alt="logo" />
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-2 sm:gap-5">
//           <Image src="/images/icons/search.svg" width={20} height={20} alt="icon" />
//           <Image src="/images/icons/heart.svg" width={20} height={20} alt="icon" />

//             <button
//           type="button"
//           onClick={() => setIsCartOpen(true)}
//           className="flex items-center gap-1 cursor-pointer transition-opacity duration-300 hover:opacity-70"
//         >
//           <Image
//             src="/images/icons/cart.svg"
//             width={20}
//             height={20}
//             alt="cart icon"
//           />
//           <span className="text-[#252525B8] text-[14px]">( 0 )</span>
//         </button>

//           {/* 🍔 Burger (only <1024px) */}
//           <button
//             className="lg:hidden"
//             onClick={() => setMenuOpen(true)}
//           >
//             <Menu />
//           </button>
//         </div>
//       </div>

//       {/* HEADER 2 (hidden on mobile) */}
//       <div className="hidden lg:flex items-center justify-between w-full px-20 py-2.5 border-b border-[#25252533]">
//         <div className="flex items-center gap-5">
//           <Link href={phoneLink} target="_blank" className="text-[#252525B8] text-[14px]">
//             +92 317 0000000
//           </Link>

//           <Link href={emailLink} target="_blank" className="text-[#252525B8] text-[14px]">
//             baskit@gmail.com
//           </Link>
//         </div>

//         <div className="flex items-center gap-5">
//           <Link href="/product" className="text-[#252525B8] text-[14px]">Shop</Link>
//           <Link href="/gift-hampers" className="text-[#252525B8] text-[14px]">Gift Hampers</Link>
//           <Link href="/bouqets" className="text-[#252525B8] text-[14px]">Bouquets</Link>
//           <Link href="#" className="text-[#252525B8] text-[14px]">Categories</Link>
//           <Link href="#" className="text-[#252525B8] text-[14px]">Top Selling</Link>
//         </div>

//         <div>
//           <Link
//             href="https://www.google.com/maps/place/Vordx+Technologies"
//             target="_blank"
//             className="text-[#252525B8] text-[14px]"
//           >
//             145G Block, DHA Phase 1, Lahore
//           </Link>
//         </div>
//       </div>

//       {/* 🔥 MOBILE SIDEBAR */}
//       <div
//         className={`fixed top-0 right-0 h-full w-[280px] bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out
//         ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
//       >
//         {/* CLOSE */}
//         <div className="flex justify-end p-4">
//           <button onClick={() => setMenuOpen(false)}>✕</button>
//         </div>

//         {/* MENU ITEMS */}
//         <div className="flex flex-col gap-4 px-6">
//           <Link href="#">Shop</Link>
//           <Link href="#">Gift Hampers</Link>
//           <Link href="#">Bouquets</Link>
//           <Link href="#">Categories</Link>
//           <Link href="#">Top Selling</Link>

//           <hr />

//           <Link href={phoneLink}>+92 317 0000000</Link>
//           <Link href={emailLink} target="_blank">baskit@gmail.com</Link>

//           <Link
//             href="https://www.google.com/maps/place/Vordx+Technologies"
//             target="_blank"
//           >
//             145G Block, DHA Phase 1, Lahore
//           </Link>
//         </div>
//       </div>

//       <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

//       {/* OVERLAY */}
//       {menuOpen && (
//         <div
//           className="fixed inset-0 bg-black/30 z-40"
//           onClick={() => setMenuOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default UserHeader;

"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import CartDrawer from "@/app/admin/(others-pages)/products/CartDrawer";

const navLinks = [
  { label: "Shop", href: "/product" },
  { label: "Gift Hampers", href: "/gift-hampers" },
  { label: "Bouquets", href: "/bouqets" },
  { label: "Categories", href: "#" },
  { label: "Top Selling", href: "#" },
];

const UserHeader = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const phoneLink = isMobile ? "tel:+923170000000" : "https://wa.me/923170000000";
  const emailLink = "https://mail.google.com/mail/?view=cm&fs=1&to=baskit@gmail.com";

  const isActive = (href: string) => href !== "#" && pathname === href;

  return (
    <>
      {/* HEADER 1 */}
      <div className="flex items-center justify-between w-full px-6 lg:px-20 py-[18px] border-b border-[#25252533] relative">
        {/* LEFT */}
        <div className="items-center gap-5 hidden sm:flex">
          <Link href="https://facebook.com" target="_blank">
            <Image src="/images/icons/facebook.svg" width={20} height={20} alt="icon" />
          </Link>
          <Link href="https://instagram.com" target="_blank">
            <Image src="/images/icons/instagram.svg" width={20} height={20} alt="icon" />
          </Link>
          <Link href="https://tiktok.com" target="_blank">
            <Image src="/images/icons/tiktok.svg" width={20} height={20} alt="icon" />
          </Link>
          <h1 className="text-[#252525B8] text-[14px]">
            Best special offers! 25% off
          </h1>
        </div>

        {/* LOGO */}
        <div>
          <Image src="/images/logo.svg" width={100} height={27} alt="logo" />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-5">
          <Image src="/images/icons/search.svg" width={20} height={20} alt="icon" />
          <Image src="/images/icons/heart.svg" width={20} height={20} alt="icon" />

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1 cursor-pointer transition-opacity duration-300 hover:opacity-70"
          >
            <Image src="/images/icons/cart.svg" width={20} height={20} alt="cart icon" />
            <span className="text-[#252525B8] text-[14px]">( 0 )</span>
          </button>

          <button className="lg:hidden" onClick={() => setMenuOpen(true)}>
            <Menu />
          </button>
        </div>
      </div>

      {/* HEADER 2 — desktop */}
      <div className="hidden lg:flex items-center justify-between w-full px-20 py-2.5 border-b border-[#25252533]">
        <div className="flex items-center gap-5">
          <Link href={phoneLink} target="_blank" className="text-[#252525B8] text-[14px]">
            +92 317 0000000
          </Link>
          <Link href={emailLink} target="_blank" className="text-[#252525B8] text-[14px]">
            baskit@gmail.com
          </Link>
        </div>

        {/* NAV LINKS */}
        <div className="flex items-center gap-5">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`text-[14px] transition-all duration-150
                ${isActive(href)
                  ? "text-[#252525] font-semibold"
                  : "text-[#252525B8] font-normal hover:text-[#252525]"
                }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div>
          <Link
            href="https://www.google.com/maps/place/Vordx+Technologies"
            target="_blank"
            className="text-[#252525B8] text-[14px]"
          >
            145G Block, DHA Phase 1, Lahore
          </Link>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        <div className="flex flex-col gap-4 px-6">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-[15px] transition-all duration-150
                ${isActive(href)
                  ? "text-[#252525] font-semibold"
                  : "text-[#252525B8] font-normal"
                }`}
            >
              {label}
            </Link>
          ))}

          <hr />

          <Link href={phoneLink}>+92 317 0000000</Link>
          <Link href={emailLink} target="_blank">baskit@gmail.com</Link>
          <Link href="https://www.google.com/maps/place/Vordx+Technologies" target="_blank">
            145G Block, DHA Phase 1, Lahore
          </Link>
        </div>
      </div>

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