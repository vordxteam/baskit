

"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { products } from "../../../../../data/products";
import { useRouter } from "next/navigation";
import Link from "next/link";
type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const cartItems = [
  {
    id: 1,
    name: "Sunshine Mix",
    price: 3999,
    qty: 1,
    image: "/images/product4.png",
  },
  {
    id: 2,
    name: "Tropical Vibes",
    price: 3999,
    qty: 1,
    image: "/images/product5.png",
  },
];

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);
const router = useRouter();

const handleCheckout = () => {
  onClose(); // Close the drawer first
  router.push("/checkout"); // Then navigate
};
  return (
    
    <div
      className={`fixed inset-0 z-[999] transition-all duration-500 ${
        isOpen ? "pointer-events-auto bg-black/30" : "pointer-events-none bg-black/0"
      }`}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-[600px] bg-[#F5F1E8] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-5 pb-5 pt-5 md:px-5">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2525251F] pb-5">
            <h2 className="text-[32px] leading-none tobia-normal font-medium text-[#252525]">
              Your baskit
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 hover:bg-[#2525250D]"
              aria-label="Close cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#252525]">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="mt-5 flex-1 scrollbar-hide overflow-y-auto pl-[47px]">

            {/* Cart items */}
            <div className="space-y-7">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-[86px] w-[72px] shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[20px] leading-6 font-normal text-[#252525]">
                        {item.name}
                      </h3>
                      <p className="mt-1.5 text-[20px] tobia-normal leading-5 text-[#252525]">
                        PKR {item.price.toLocaleString()}
                      </p>
                      <div className="mt-5 flex h-8 w-[78px] items-center border border-[#25252533]">
                        <button className="flex h-full w-[28px] items-center justify-center text-[#252525B8]">−</button>
                        <span className="flex-1 text-center text-[14px] text-[#252525]">{item.qty}</span>
                        <button className="flex h-full w-[28px] items-center justify-center text-[#252525B8]">+</button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-1 opacity-70 transition-opacity hover:opacity-100"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Image src="/images/icons/delete.svg" alt="del" height={20} width={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions Slider */}
            <div className="mt-8">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[16px] md:text-[20px] tobia-normal text-[#252525]">
                  Goes well with your baskit
                </h3>
                {/* Prev/Next buttons — exact same UI as before */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="flex h-8 w-8 items-center justify-center border border-[#25252526] text-[#252525CC]"
                    aria-label="Previous"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="flex h-8 w-8 items-center justify-center border border-[#25252526] text-[#252525CC]"
                    aria-label="Next"
                  >
                    ›
                  </button>
                </div>
              </div>

              {/* Swiper — 3 visible slides, same card UI as before */}
              <Swiper
                modules={[Navigation]}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                slidesPerView={3}
                spaceBetween={12}
                loop={products.length > 3}
              >
                {products.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-end">
                        <button
                          type="button"
                          className="opacity-70 transition-opacity hover:opacity-100"
                          aria-label={`Add ${item.name} to wishlist`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#252525]">
                            <path
                              d="M12 20.5C12 20.5 4 15.36 4 9.5C4 7.01472 6.01472 5 8.5 5C10.04 5 11.398 5.775 12 6.96C12.602 5.775 13.96 5 15.5 5C17.9853 5 20 7.01472 20 9.5C20 15.36 12 20.5 12 20.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="relative mx-auto h-[76px] w-[64px]">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>

                      <h4 className="mt-3 text-[16px] leading-5 text-[#252525]">{item.name}</h4>
                      <p className="mt-3 text-[16px] leading-5 text-[#252525]">
                        PKR {item.price.toLocaleString()}
                      </p>

                      <button
                        type="button"
                        className="mt-3 h-[38px] w-full border border-[#252525] text-[13px] text-[#252525] transition-colors duration-300 hover:bg-[#252525] hover:text-white"
                      >
                        Add to Baskit
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 border-t border-[#25252514] pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[20px] text-[#252525] tobia-normal">Cart subtotal</span>
              <span className="text-[16px] tobia-normal md:text-[20px] text-[#252525]">PKR 4,999</span>
            </div>
            <div className="space-y-3">
              <button 
  onClick={handleCheckout}
  className="flex h-[48px] w-full items-center justify-center bg-[#252525] text-[15px] text-white transition-opacity duration-300 hover:opacity-90"
>
  Proceed to checkout
</button>
              <button
                onClick={onClose}
                className="flex h-[48px] w-full items-center justify-center border border-[#25252580] text-[15px] text-[#252525] transition-colors duration-300 hover:bg-[#252525] hover:text-white"
              >
                Continue shopping
              </button>
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;