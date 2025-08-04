"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEST_PUBLIC_BACKEND_PATH,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post("/api/auth/refresh");
        const newAccessToken = refreshResponse.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    // Don't check auth on reset password page
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/reset-password"
    ) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get("/api/auth/check-auth");
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await api.post("/api/auth/signup", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const { user, accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      setUser(user);
      setIsAuthenticated(true);

      toast.success(
        "Account created successfully! Please check your email to verify your account."
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";

      if (error.response?.status === 409) {
        toast.error(`Account already exists: ${errorMessage}`);
      } else if (error.response?.status === 400) {
        toast.error(`Invalid data: ${errorMessage}`);
      } else {
        toast.error(errorMessage);
      }

      throw error;
    }
  };

  const login = async (usernameOrEmail, password) => {
    try {
      const response = await api.post("/api/auth/login", {
        usernameOrEmail: usernameOrEmail.trim(),
        password,
      });

      const { user, accessToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      setUser(user);
      setIsAuthenticated(true);
      router.push("/");
      toast.success("Login successful!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";

      if (error.response?.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error(errorMessage);
      }

      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    }
  };

  const refreshToken = async () => {
    try {
      const response = await api.post("/api/auth/refresh");
      const newAccessToken = response.data.accessToken;

      localStorage.setItem("accessToken", newAccessToken);
      return true;
    } catch (error) {
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      await api.post("/api/auth/resend-verification", { email });
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification email";
      toast.error(errorMessage);
      throw error;
    }
  };

  const sendResetPasswordLink = async (email) => {
    try {
      await api.post("/api/auth/forget-password", { email });
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification email";
      toast.error(errorMessage);
      throw error;
    }
  };

  const resetPassword = async (password, token) => {
    try {
      await api.post("/api/auth/reset-password", { password, token });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification email";
      toast.error(errorMessage);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    login,
    logout,
    refreshToken,
    resendVerificationEmail,
    sendResetPasswordLink,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
