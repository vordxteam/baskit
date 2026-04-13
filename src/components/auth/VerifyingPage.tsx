"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";

const VerifyingPage = () => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds === 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full lg:w-1/2 px-4">
      <div className="w-full max-w-md text-center bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-black dark:text-white mb-3">
          Verify Your Email 📧
        </h2>

        {/* Message */}
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          We’ve sent a verification link to your email.  
          Please check your inbox and click the link to continue.
        </p>

        {/* Timer */}
        <div className="mb-5">
          {seconds > 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You can resend the email in{" "}
              <span className="font-semibold">{seconds}s</span>
            </p>
          ) : (
            <p className="text-sm text-green-600">
              You can now resend the email.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Button disabled={seconds > 0}>
            Resend Email
          </Button>
        </div>

      </div>
    </div>
  );
};

export default VerifyingPage;