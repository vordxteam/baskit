"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

// ─── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-checked={enabled}
      role="switch"
      className={`relative inline-flex w-[33px] h-[23px] items-center shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
        enabled ? "bg-[#D35565]" : "bg-gray-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out  ${
          enabled ? "translate-x-[19px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb() {
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Profile", href: "/profile" },
    { label: "Account settings", href: "/account-settings" },
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-x-2">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={crumb.href} className="flex items-center gap-x-2">
            {isLast ? (
              <span className="text-[13px] text-gray-800 font-normal font-sans">
                {crumb.label}
              </span>
            ) : (
              <>
                <Link
                  href={crumb.href}
                  className="text-[13px] text-gray-500 hover:text-gray-800 transition-colors duration-150 font-sans"
                >
                  {crumb.label}
                </Link>
                <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="h-px bg-gray-200 w-full" />;
}

// ─── Toggle Row ──────────────────────────────────────────────────────────────
function ToggleRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-8 py-8">
      <div>
        <p className="text-[20px] leading-7 text-[#252525] tobia-normal">
          {title}
        </p>
        <p className="mt-1.5 text-[16px] text-[#25252599] leading-5 font-normal">
          {description}
        </p>
      </div>
      <div className="flex-shrink-0 pt-0.5">
        <Toggle enabled={enabled} onChange={onToggle} />
      </div>
    </div>
  );
}

// ─── Link Row ────────────────────────────────────────────────────────────────
function LinkRow({
  title,
  description,
  onClick,
  danger = false,
  href,
}: {
  title: string;
  description: string;
  onClick?: () => void;
  danger?: boolean;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start justify-between gap-8 py-8 group w-full text-left">
      <div>
        <p
          className={`tobia-normal leading-7 text-[20px]  transition-colors duration-150 ${
            danger
              ? "text-rose-500 group-hover:text-rose-600"
              : "text-gray-900 group-hover:text-gray-600"
          }`}
        >
          {title}
        </p>
        <p className="mt-1.5 text-[16px]  text-[#25252599] leading-5 font-normal">
          {description}
        </p>
      </div>
      <div className="flex-shrink-0 pt-0.5">
        <ArrowRight
          className={`w-5 h-5 transition-all duration-150 group-hover:translate-x-0.5 ${
            danger ? "text-rose-400" : "text-gray-400"
          }`}
        />
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full">
        {inner}
      </button>
    );
  }

  return <Link href={href ?? "#"} className="block">{inner}</Link>;
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative z-10 bg-gray-50 w-full max-w-[600px]  p-5 text-center shadow-lg">
        <h2 className="tobia-normal text-[24px] leading-7 text-[#252525] mb-3">
          Delete your account
        </h2>
        <p className="text-[16px] text-[#25252599] font-normal leading-5 mb-10 max-w-[398px] mx-auto">
          Deleting your account will permanently remove your data and cannot be
          undone.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 border border-gray-300 text-[18px] leading-6 text-[#252525] font-normal hover:bg-gray-50 transition-colors duration-150 focus:outline-none"
          >
            Go back
          </button>
          <button
            type="button"
            className="flex-1 h-11 bg-[#ED3F3F] hover:bg-rose-600 text-[18px] leading-5 text-white  font-normal transition-colors duration-150 focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="">
        <div className="mx-auto w-full max-w-[1440px]">

          {/* Breadcrumb */}
          <div className="px-10 pt-5 pb-4">
            <Breadcrumb />
          </div>



          {/* Content */}
          <div className="mx-auto w-full max-w-[1040px] px-6 sm:px-10 lg:px-0 pt-12 pb-24">
            <h1 className="tobia-normal text-[28px] text-[#252525] leading-8 mb-6">
              Account settings
            </h1>

            <div className="w-full">
              <ToggleRow
                title="Email notifications"
                description="Receive updates about your orders, offers, and important account activity."
                enabled={emailEnabled}
                onToggle={() => setEmailEnabled((v) => !v)}
              />

              <Divider />

              <ToggleRow
                title="SMS alerts"
                description="Get instant text updates for order status and delivery notifications."
                enabled={smsEnabled}
                onToggle={() => setSmsEnabled((v) => !v)}
              />

              <Divider />

              <LinkRow
                title="Change password"
                description="Update your password to keep your account secure."
                href="/account-settings/change-password"
              />

              <Divider />

              <LinkRow
                title="Delete account"
                description="Once you delete your account, there is no going back. Please be certain."
                danger
                onClick={() => setDeleteOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {deleteOpen && <DeleteModal onClose={() => setDeleteOpen(false)} />}
    </>
  );
}