

"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageWithEmptyState from "@/components/ui/ImageWithEmptyState";
import { formatPrice, getCartSelectionEntries } from "@/utils/cart";
import { useCart } from "@/hooks/useCart";
type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push("/shipping");
  };

  const handleViewCart = () => {
    onClose();
    router.push("/checkout");
  };
  return (
    
    <div
      className={`fixed inset-0 z-50 transition-all duration-800 ${
        isOpen ? "pointer-events-auto bg-black/30" : "pointer-events-none bg-black/0"
      }`}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-[600px] bg-[#F5F1E8] shadow-2xl transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
              {items.length === 0 ? (
                <div className="py-20 text-center pr-6">
                  <p className="text-[16px] text-[#25252599] font-light">Your baskit is empty.</p>
                </div>
              ) : items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-[86px] w-[72px] shrink-0 overflow-hidden bg-[#F5F1E8]">
                    <ImageWithEmptyState
                      src={item.imageUrl}
                      alt={item.name}
                      className="object-contain"
                      sizes="72px"
                    />
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[20px] leading-6 font-normal text-[#252525]">
                        {item.name}
                      </h3>
                      {getCartSelectionEntries(item.customization).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                          {getCartSelectionEntries(item.customization).map((entry) => (
                            <p key={entry.label} className="text-[12px] leading-4 text-[#25252599]">
                              {entry.label}: <span className="text-[#252525]">{entry.value}</span>
                            </p>
                          ))}
                        </div>
                      )}
                      <p className="mt-1.5 text-[20px] tobia-normal leading-5 text-[#252525]">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                      <div className="mt-5 flex h-8 w-[78px] items-center border border-[#25252533]">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="flex h-full w-7 items-center justify-center text-[#252525B8]"
                        >−</button>
                        <span className="flex-1 text-center text-[14px] text-[#252525]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-full w-7 items-center justify-center text-[#252525B8]"
                        >+</button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-1 opacity-70 transition-opacity hover:opacity-100"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.id)}
                    >
                      <Image src="/images/icons/delete.svg" alt="del" height={20} width={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 border-t border-[#25252514] pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[20px] text-[#252525] tobia-normal">Cart subtotal</span>
              <span className="text-[16px] tobia-normal md:text-[20px] text-[#252525]">{formatPrice(subtotal)}</span>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleViewCart}
                className="flex h-12 w-full items-center justify-center bg-[#252525] text-[15px] text-white transition-opacity duration-300 hover:opacity-90"
              >
                Proceed to checkout
              </button>
              <button
                onClick={onClose}
                className="flex h-12 w-full items-center justify-center border border-[#25252580] text-[15px] text-[#252525] transition-colors duration-300 hover:bg-[#252525] hover:text-white"
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