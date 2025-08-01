"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/hooks/AuthContext";
import { toast } from "sonner";

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, resendVerificationEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");
  useEffect(() => {
    if (token && typeof token === "string") {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (token) => {
    const baseURL = process.env.NEXT_PUBLIC_NEST_PUBLIC_BACKEND_PATH;
    try {
      setLoading(true);
      const response = await axios.get(
        baseURL + `/api/auth/verify-email?token=${token}`
      );

      setVerificationStatus("success");
      setMessage(response.data.message || "Email verified successfully!");
      toast.success("Email verified successfully!");
      console.log(response.data);
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      setVerificationStatus("error");
      const errorMessage =
        error.response?.data?.message || "Email verification failed";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {verificationStatus === "success" ? (
            <div className="text-green-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="mt-4 text-2xl font-bold">Email Verified!</h2>
              <p className="mt-2 text-sm ">{message}</p>
              <p className="mt-2 text-sm ">Redirecting to dashboard...</p>
            </div>
          ) : (
            <div className="text-red-600">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h2 className="mt-4 text-2xl font-bold">Verification Failed</h2>
              <p className="mt-2 text-sm ">{message}</p>

              {user && !user.emailVerified && (
                <div className="mt-6">
                  <button
                    onClick={handleResendEmail}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Resend Verification Email"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
