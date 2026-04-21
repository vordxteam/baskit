"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedOrderNumber = orderNumber.trim();
    const normalizedEmail = email.trim();

    if (!normalizedOrderNumber || !normalizedEmail) {
      setFormError("Please enter both order ID and email.");
      return;
    }

    setFormError("");
    const params = new URLSearchParams({
      orderNumber: normalizedOrderNumber,
      email: normalizedEmail,
    });

    router.push(`/track-order/tracking?${params.toString()}`);
  };

  return (
    <div className="bg-[#F7F5EC] px-4 pb-16 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-[13px] font-normal text-[#25252580] sm:mb-10">
          <Link href="/" className="transition-colors hover:text-[#252525]">
            Home
          </Link>
          <svg
            className="h-3.5 w-3.5 text-[#25252566]"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Link href="/profile" className="transition-colors hover:text-[#252525]">
            Profile
          </Link>
          <svg
            className="h-3.5 w-3.5 text-[#25252566]"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[#252525]">Track order</span>
        </div>

        {/* Main Card */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-[550px] border border-[#25252526] bg-transparent px-5 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14">
            <div className="text-center">
              <h1 className="text-[28px] font-normal leading-8 text-[#252525]">
                Track your order
              </h1>
              <p className="mx-auto mt-2 text-[16px] font-normal leading-5 text-[#252525CC]">
                Enter your order details to track your shipment
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5 sm:mt-12">
              <div>
                <label
                  htmlFor="orderId"
                  className="mb-2 block text-[14px] font-normal text-[#252525]"
                >
                  Order ID
                </label>
                <input
                  id="orderId"
                  type="text"
                  placeholder="Enter your order ID"
                  value={orderNumber}
                  onChange={(event) => setOrderNumber(event.target.value)}
                  className="h-12 w-full border border-[#25252526] bg-transparent px-4 text-[14px] text-[#252525] outline-none placeholder:text-[#25252566] transition-colors focus:border-[#25252580]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[14px] font-normal text-[#252525]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full border border-[#25252526] bg-transparent px-4 text-[14px] text-[#252525] outline-none placeholder:text-[#25252566] transition-colors focus:border-[#25252580]"
                />
              </div>

              {formError && (
                <p className="text-[13px] text-[#B91C1C]">{formError}</p>
              )}

              <Button type="submit" variant="primary" className="w-full">
                Track Order
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;