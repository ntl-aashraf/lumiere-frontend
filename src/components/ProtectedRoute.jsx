"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import { toast } from "sonner";

const ProtectedRoute = ({ children, requireEmailVerification = true }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        toast.error("You need to login.");
        router.push("/login");
        return;
      }

      if (user && !user.emailVerified) {
        router.push("/verify-email-required");
        return;
      }
    }
  }, [loading, isAuthenticated, user, requireEmailVerification, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (requireEmailVerification && user && !user.emailVerified) {
    return null; // Will redirect to email verification required page
  }

  return <>{children}</>;
};

export default ProtectedRoute;
