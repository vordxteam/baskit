"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const authRoutes = ["/signin", "/signup", "/forgot-password", "/reset-password", "/change-password", "/"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem("accessToken");
      const sessionStr = localStorage.getItem("session");
      const tokenTimestamp = localStorage.getItem("tokenTimestamp");

      // Check session expiry
      if (tokenTimestamp && sessionStr) {
        const sessionMs = parseInt(sessionStr) * 1000;
        const tokenTime = parseInt(tokenTimestamp);
        const currentTime = Date.now();

        if (currentTime > tokenTime + sessionMs) {
          // Session expired
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("tokenTimestamp");
          localStorage.removeItem("session");
          localStorage.removeItem("rememberMe");
          router.push("/signin");
          return;
        }
      }

      const isAuthRoute = authRoutes.includes(pathname);
      const hasToken = !!accessToken;

      if (hasToken && isAuthRoute) {
        // User has token, can't access auth routes
        router.push("/admin");
      } else if (!hasToken && !isAuthRoute) {
        // No token, can't access private routes
        router.push("/signin");
      }
    };

    checkAuth();
  }, [pathname, router]);

  return <>{children}</>;
}