"use client";

import { Mail, Phone } from "lucide-react";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Profile", href: "/profile" },
  { label: "Help & support", active: true },
];

const supportCards = [
  {
    icon: Mail,
    title: "Email support",
    detail: "support@baskit.com",
    buttonLabel: "Send email",
    href: "mailto:support@baskit.com",
  },
  {
    icon: Phone,
    title: "Phone support",
    detail: "+92345689872",
    buttonLabel: "Send message",
    href: "tel:+92345689872",
  },
];

export default function HelpSupport() {
  return (
    <section className="max-w-[1440px] mx-auto">
      {/* Breadcrumb */}
      <nav className="px-6 py-3">
        <ol className="flex flex-wrap items-center gap-1.5">
          {breadcrumbs.map((crumb, i) => (
            <li key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-sm font-light text-gray-400">{">"}</span>}
              {crumb.active ? (
                <span className="text-sm font-light leading-5 tracking-wide text-[#252525]">
                  {crumb.label}
                </span>
              ) : (
                <a
                  href={crumb.href}
                  className="text-sm font-regular leading-5 tracking-wide text-[#252525] transition-colors hover:text-gray-600"
                >
                  {crumb.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Content */}
      <div className="mx-auto w-full max-w-[1040px] sm:py-10">
        {/* Heading */}
        <h1 className="tobia-normal text-[28px] leading-8 text-[#252525] mb-15">
          How we can help?
        </h1>

        {/* Cards */}
        <div className="flex gap-5 md:flex-row flex-col ">
          {supportCards.map(({ icon: Icon, title, detail, buttonLabel, href }) => (
            <div
              key={title}
              className="flex border border-[#2525251F] flex-1 flex-col items-center gap-4 p-10 text-center"
            >
              <Icon size={36} strokeWidth={1.25} className="text-[#252525]" />
              <p className="tobia-normal text-[24px] leading-7 text-[#252525]">{title}</p>
              <p className="text-[16px] font-normal leading-5  text-[#25252599]">{detail}</p>
              <a
                href={href}
                className="mt-1 bg-[#252525] px-5 py-3 text-sm font-normal tracking-wide text-white transition-colors hover:bg-gray-800 "
              >
                {buttonLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}