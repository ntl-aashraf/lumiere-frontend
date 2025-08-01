"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  validateEmail,
  validatePassword,
  validateUserName,
} from "@/lib/validationFunctions";
import Link from "next/link";
import { useAuth } from "@/hooks/AuthContext";

const page = () => {
  const router = useRouter();
  const { signup, user } = useAuth();
  const [username, setUserName] = useState("");
  const [isValidUserName, setIsValidUserName] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      toast.info("You are already logged in");
      router.push("/");
      return;
    }
  }, [user, router]);

  function validateUserNameAvailability() {
    if (!isValidUserName) {
      toast.error("Username can contain only alphanumeric and underscore.");
      return;
    }
  }

  function validateEmailAvailability() {
    if (!isValidEmail) {
      toast.error("Invalid email address");
      return;
    }
  }

  function validatePasswordField() {
    if (!isValidPassword) {
      toast.error(
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }
  }

  useEffect(() => {
    if (isValidEmail && isValidUserName && isValidPassword) {
      setSaveBtnDisabled(false);
    } else {
      setSaveBtnDisabled(true);
    }
  }, [isValidUserName, isValidEmail, isValidPassword]);

  async function handleSignupFormSubmit(e) {
    e.preventDefault();
    console.log("I am clicked");
    setLoading(true);
    try {
      await signup(username, email, password);
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Signup failed. Please try again.";

        if (error.response?.status === 409) {
          toast.error(`Account already exists: ${errorMessage}`);
        } else if (error.response?.status === 400) {
          toast.error(`Invalid data: ${errorMessage}`);
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Network error. Please try again.");
      }

      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="center-flex-col h-screen">
      <h1>Sign Up</h1>
      <form className="flex flex-col gap-4 w-full max-w-md px-5">
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            value={username}
            onChange={(e) => {
              setUserName(e.target.value);
              setIsValidUserName(validateUserName(e.target.value));
            }}
            onBlur={() => validateUserNameAvailability(username)}
            type="text"
            id="username"
            name="username"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setIsValidEmail(validateEmail(event.target.value));
            }}
            onBlur={() => validateEmailAvailability(email)}
            type="email"
            id="email"
            name="email"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsValidPassword(validatePassword(e.target.value));
            }}
            onBlur={() => {
              validatePasswordField();
            }}
            id="password"
            name="password"
            required
          />
        </div>
        <div className="input-group">
          <Link href={"/login"} className="italic  !hover:underline">
            Already have an account? Login here
          </Link>
        </div>
        <button
          className="btn-lg"
          type="submit"
          onClick={handleSignupFormSubmit}
          disabled={saveBtnDisabled || loading}
        >
          {loading ? "creating..." : "Sign Up"}
        </button>
      </form>
    </main>
  );
};

export default page;
