"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useStreaming } from "@/hooks/StreamingContext";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

const Page = () => {
  const { logout, user } = useAuth();
  const { data, loading, error, search } = useStreaming();
  const router = useRouter();

  useEffect(() => {
    search("movie", "Drama"); // load dramas on mount
  }, []);

  return (
    <ProtectedRoute>
      {/* <Navbar /> */}
      <main
        id="landing"
        className="landing w-full min-h-[calc(100vh-75px)] flex flex-col items-center justify-center px-4 py-12 text-white text-center"
      >
        <h1 className="text-4xl md:text-5xl z-100 font-bold italic !text-white animate-fadeIn">
          Welcome to Lumiere
        </h1>

        <p className="mt-3 text-lg md:text-xl z-100 !text-white max-w-lg animate-slideIn">
          We stream drama. But not the kind of you do :)
        </p>

        <button
          onClick={() => router.push("/watch?q=movies")}
          className="mt-8 px-6 py-3 z-100 bg-white text-black text-sm md:text-base font-semibold rounded-full shadow hover:scale-105 transition-transform duration-200 animate-fadeIn delay-200"
        >
          🎬 Start Watching
        </button>

        {loading && <p className="mt-6 text-gray-400 italic">Loading...</p>}
        {error && <p className="mt-6 text-red-500">{error}</p>}
      </main>
    </ProtectedRoute>
  );
};

export default Page;
