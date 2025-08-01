"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/AuthContext";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/");
      toast.error("You are already logged in.");
      return;
    }
  }, [user, router]);

  async function handleLoginFormSubmit(e) {
    e.preventDefault();
    console.log("I am clicked");
    setLoading(true);
    try {
      await login(usernameOrEmail, password);
      router.push("/");
    } catch (err) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="center-flex-col h-screen">
      <h1>Login</h1>
      <form className="flex flex-col gap-4 w-full max-w-md px-5">
        <div className="input-group">
          <label htmlFor="username">Username or Email:</label>
          <input
            value={usernameOrEmail}
            onChange={(e) => {
              setUsernameOrEmail(e.target.value);
            }}
            type="text"
            id="username"
            name="username"
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
            }}
            id="password"
            name="password"
            required
          />
          <Link className="italic inline-link" href={"/forget-password"}>
            Forget password
          </Link>
        </div>
        <div className="input-group">
          <Link href={"/signup"} className="italic">
            Create a new account
          </Link>
        </div>
        <button
          className="btn-lg"
          type="submit"
          onClick={handleLoginFormSubmit}
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>
    </main>
  );
};

export default Page;
