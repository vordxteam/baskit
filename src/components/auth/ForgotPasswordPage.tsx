"use client";

import { useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { authApi } from "@/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.forgotPassword({ email });
      setMessage(res.message || "Reset link sent to your email.");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 w-full lg:w-1/2">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button disabled={loading} type="submit">
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}