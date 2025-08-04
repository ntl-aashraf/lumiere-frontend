"use client";

import React from "react";
// import { useFavorites } from "@/hooks/FavoritesContext";
import { useFavorites } from "@/hooks/SaveVideoContext";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import { Trash2, Heart } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  const safeFavorites = Array.isArray(favorites) ? favorites : [];
  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6 w-[90%] m-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Heart className="text-red-500" />
            My Favorites ({safeFavorites.length})
          </h1>

          {safeFavorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {safeFavorites.length < 1 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-500">
              Start adding videos to your favorites by clicking the heart icon
              on any video card.
            </p>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center gap-4 gap-y-4 flex-wrap">
            {safeFavorites.map((item, index) => (
              <MovieCard
                key={item.videoId || item.id || `fav-${index}`}
                data={item}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
