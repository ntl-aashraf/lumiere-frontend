"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/AuthContext";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const { sendResetPasswordLink } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetFormSubmit(e) {
    e.preventDefault();
    if (email === "") {
      toast.error("Please enter email");
      return;
    }
    setLoading(true);
    try {
      await sendResetPasswordLink(email);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="center-flex-col h-screen">
      <h1 className="px-5 text-center">Forgot Password?</h1>
      <p className="italic text-center w-full px-5 md:w-[60%]">
        Don't worry! Just enter your email that you registered with and we'll
        send the password reset link there.
        <br />
        <br />
        Make sure to see spam folder as well :)
      </p>
      <form className="flex flex-col gap-4 w-full max-w-md px-5">
        <div className="input-group">
          <label htmlFor="email">Email Address:</label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            id="email"
            name="email"
            required
          />
        </div>
        <button
          className="btn-lg"
          type="submit"
          onClick={handleResetFormSubmit}
          disabled={loading}
        >
          {loading ? "Sending Email" : "Submit"}
        </button>
      </form>
    </main>
  );
};

export default Page;
