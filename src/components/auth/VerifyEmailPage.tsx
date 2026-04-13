"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { authApi } from "@/api/auth";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        const data = await authApi.verifyEmail({ token });

        if (data.success) {
          router.push("/");
          setStatus("success");
          setMessage("Your email has been verified successfully.");
        } else {
          throw new Error(data.message || "Verification failed.");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Verification failed.");
      }
    }

    verify();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full lg:w-1/2 px-4">
      <div className="w-full max-w-md text-center bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        {status === "loading" && <p>Verifying your email...</p>}

        {status === "success" && (
          <>
            <h2 className="text-xl font-semibold text-green-600 mb-3">
              Email Verified 🎉
            </h2>
            <p className="mb-5 text-black dark:text-white">{message}</p>
            <Button onClick={() => router.push("/signin")}>
              Go to Sign In
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-xl font-semibold text-red-600 mb-3">
              Verification Failed
            </h2>
            <p className="mb-5 text-black dark:text-white">{message}</p>
            <Button onClick={() => router.push("/signin")}>
              Back to Sign In
            </Button>
          </>
        )}
      </div>
    </div>
  );
}