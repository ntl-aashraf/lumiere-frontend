"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { validatePassword } from "@/lib/validationFunctions";
import { useAuth } from "@/hooks/AuthContext";
import axios from "axios";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = password === confirmPassword && isValidPassword;

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token || typeof token !== "string") {
      toast.error("Invalid or missing token.");
      return;
    }

    if (!isFormValid) {
      toast.error("Make sure both passwords match and are valid.");
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);
      await resetPassword(password, token);
      setStatus("success");
      setMessage("Password reset successful! Redirecting...");
      toast.success("Password updated successfully!");

      setTimeout(() => {
        router.push("/login"); // Or redirect to home if you want
      }, 3000);
    } catch (err) {
      console.error("Reset error:", err);
      setStatus("error");
      setMessage(
        err?.response?.data?.message || "Failed to reset your password"
      );
      toast.error("Password reset failed.");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4">Resetting your password...</p>
        </div>
      </div>
    );
  }

  if (status === "success" || status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          {status === "success" ? (
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
              <h2 className="mt-4 text-2xl font-bold">Password Reset!</h2>
              <p className="mt-2 text-sm">{message}</p>
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
              <h2 className="mt-4 text-2xl font-bold">Reset Failed</h2>
              <p className="mt-2 text-sm">{message}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="center-flex-col h-screen">
      <h1 className="text-xl font-bold mb-2">Reset Password</h1>
      <p className="italic text-center w-full px-5 md:w-[60%] text-gray-500">
        Use your genius brain to remember this one 😎
      </p>

      <form
        onSubmit={handleResetPassword}
        className="flex flex-col gap-4 w-full max-w-md px-5 mt-6"
      >
        <div className="input-group">
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              setIsValidPassword(validatePassword(val));
            }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting || loading}
          className="btn-lg disabled:opacity-50"
        >
          {loading ? "Reseting..." : " Reset Password"}
        </button>
      </form>
    </main>
  );
};

export default ResetPasswordPage;
