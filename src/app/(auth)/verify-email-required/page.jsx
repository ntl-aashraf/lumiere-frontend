"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";

const Page = () => {
  const { user, resendVerificationEmail, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResendEmail = async () => {
    if (user?.emailVerified === true) {
      router.push("/");
    }
    if (!user?.email) return;

    try {
      setLoading(true);
      await resendVerificationEmail(user.email);
    } catch (error) {
      console.error("Resend email error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-yellow-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold ">
            Email Verification Required
          </h2>
          <p className="mt-2 text-sm">
            Please verify your email address to continue. We have sent a
            verification link to:
          </p>
          <p className="mt-1 text-sm font-medium ">{user?.email}</p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Out
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs">
            Check your spam folder if you do not see the email in your inbox.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
