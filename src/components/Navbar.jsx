"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/AuthContext";
import { Menu, X } from "lucide-react";
import ProtectedRoute from "./ProtectedRoute";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const query = useSearchParams().get("q");

  const [menuOpen, setMenuOpen] = useState(false);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const inputElements = [desktopSearchRef.current, mobileSearchRef.current];

    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const input = event.target;
        if (input?.value) {
          router.push(`/watch?q=${input.value}`);
        }
      }
    };

    inputElements.forEach((input) => {
      if (input) input.addEventListener("keydown", handleKeyDown);
    });

    return () => {
      inputElements.forEach((input) => {
        if (input) input.removeEventListener("keydown", handleKeyDown);
      });
    };
  }, [router]);

  return (
    <ProtectedRoute>
      <nav className="h-[75px] px-4 md:px-10 flex items-center justify-between gap-5 shadow-xs sticky top-0 z-50 bg-[#ede0d4] w-full">
        <Link
          href="/"
          className="text-xl font-bold italic tracking-wider !no-underline"
        >
          Lumiere
        </Link>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Links */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-[75px] left-0 w-full bg-[#ede0d4] p-4 md:p-0 md:static md:flex md:flex-row md:items-center md:justify-center md:gap-4 z-40`}
        >
          <Link
            href="/watch?q=movie"
            className={`block md:inline ${
              query === "movie" ? "font-bold text-black" : "text-gray-600"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Movies
          </Link>
          <Link
            href="/watch?q=tvSeries"
            className={`block md:inline ${
              query === "tvSeries" ? "font-bold text-black" : "text-gray-600"
            }`}
            onClick={() => setMenuOpen(false)}
          >
            TV Shows
          </Link>
          <Link
            href="/favourites"
            className="block md:inline"
            onClick={() => setMenuOpen(false)}
          >
            Favourites
          </Link>
          <Link
            href="/watch-later"
            className="block md:inline"
            onClick={() => setMenuOpen(false)}
          >
            Watch Later
          </Link>

          {/* Mobile search + logout */}
          <div className="mt-4 md:hidden flex flex-col gap-2">
            <input
              type="text"
              ref={mobileSearchRef}
              placeholder="Search here..."
              className="border border-gray-400 px-2 py-1 rounded"
            />
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="bg-black text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Desktop search & logout */}
        <div className="hidden md:flex items-center gap-3">
          <input
            type="text"
            ref={desktopSearchRef}
            className="border border-gray-400 focus:border-gray-800 px-2 py-1"
            placeholder="Search here..."
          />
          <button
            onClick={() => {
              logout();
            }}
            className="bg-black text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </nav>
    </ProtectedRoute>
  );
};

export default Navbar;
