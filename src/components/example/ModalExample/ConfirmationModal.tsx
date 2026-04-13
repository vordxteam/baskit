"use client";

import React, { useEffect } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}: ConfirmationModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const iconBg = {
    danger: "bg-red-50 dark:bg-red-500/10",
    warning: "bg-yellow-50 dark:bg-yellow-500/10",
    info: "bg-blue-50 dark:bg-blue-500/10",
  }[variant];

  const iconColor = {
    danger: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  }[variant];

  const btnColor = {
    danger:
      "bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white",
    warning:
      "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 text-white",
    info: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white",
  }[variant];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-gray-200 dark:ring-white/10 overflow-hidden animate-modal-in">
        {/* Top accent bar */}
        <div
          className={`h-1 w-full ${
            variant === "danger"
              ? "bg-gradient-to-r from-red-400 to-red-600"
              : variant === "warning"
              ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
              : "bg-gradient-to-r from-blue-400 to-blue-600"
          }`}
        />

        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${iconBg}`}>
            {variant === "danger" && (
              <svg className={`h-7 w-7 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            )}
            {variant === "warning" && (
              <svg className={`h-7 w-7 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            {variant === "info" && (
              <svg className={`h-7 w-7 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            )}
          </div>

          {/* Text */}
          <div className="text-center">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/20"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${btnColor}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}