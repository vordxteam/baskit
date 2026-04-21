"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const publicAuthRoutes = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/change-password",
];

const clearAuthStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenTimestamp");
  localStorage.removeItem("session");
  localStorage.removeItem("rememberMe");
};

const isAdminRoute = (pathname: string) => pathname === "/admin" || pathname.startsWith("/admin/");

const isPublicAuthRoute = (pathname: string) => publicAuthRoutes.includes(pathname);

const isUserAreaRoute = (pathname: string) => !isAdminRoute(pathname) && !isPublicAuthRoute(pathname);

const isAdminRole = (role: string) => role === "ADMIN";

const isCustomerRole = (role: string) => role === "CUSTOMER" || role === "USER";

const guestPublicRouteBases = [
  "/gift-hampers",
  "/bouqets",
  "/product",
  "/track-order",
  "/get-a-qoute",
  "/bouqets-customization",
  "/checkout",
  "/shipping",
  "/about",
  "/top-selling",
  "/bouqets-summary",
  "/basket-summary",
  "/favorites",
  "/help",
  "/HomePage",
];

const isGuestPublicRoute = (pathname: string) => {
  if (pathname === "/") {
    return true;
  }

  return guestPublicRouteBases.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  );
};

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("accessToken");
      const role = (localStorage.getItem("role") || "").toUpperCase();
      const sessionStr = localStorage.getItem("session");
      const tokenTimestamp = localStorage.getItem("tokenTimestamp");

      const hasValidToken =
        !!accessToken && accessToken !== "null" && accessToken !== "undefined";

      const adminRoute = isAdminRoute(pathname);
      const userRoute = isUserAreaRoute(pathname);
      const authRoute = isPublicAuthRoute(pathname);
      const guestPublicRoute = isGuestPublicRoute(pathname);

      // ✅ 1. Session expiry check (ONLY if token exists)
      if (hasValidToken && tokenTimestamp && sessionStr) {
        const sessionSeconds = Number(sessionStr);
        const tokenTime = Number(tokenTimestamp);
        const currentTime = Date.now();
        const sessionMs = sessionSeconds * 1000;

        if (
          Number.isFinite(sessionSeconds) &&
          sessionSeconds > 0 &&
          Number.isFinite(tokenTime) &&
          tokenTime > 0 &&
          currentTime > tokenTime + sessionMs
        ) {
          clearAuthStorage();
          router.push("/signin");
          return;
        }
      }

      // ✅ 2. Guest routes = ALWAYS allowed (no redirects, no clearing)
      if (guestPublicRoute) {
        return;
      }

      // ❌ 3. No token → block protected routes
      if (!hasValidToken && !authRoute) {
        router.push("/signin");
        return;
      }

      if (!hasValidToken) {
        return;
      }

      // ❌ 4. Invalid role → clear + redirect
      if (!isAdminRole(role) && !isCustomerRole(role)) {
        clearAuthStorage();
        router.push("/signin");
        return;
      }

      // ✅ 5. Admin logic
      if (isAdminRole(role)) {
        if (userRoute || authRoute) {
          router.push("/admin");
        }
        return;
      }

      // ✅ 6. Customer logic
      if (isCustomerRole(role)) {
        if (adminRoute) {
          router.push("/");
        }
        return;
      }

      // fallback safety
      if (adminRoute) {
        router.push("/");
      }
    };

    checkAuth();
  }, [pathname, router]);

  return <>{children}</>;
}