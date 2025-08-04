"use client";

import React, { Suspense } from "react";
import { useFavorites } from "@/hooks/SaveVideoContext";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import { Trash2, BookmarkCheck, Clock } from "lucide-react";

export default function WatchLaterPage() {
  const { watchLater, clearWatchLater } = useFavorites();
  const safeWatchLater = Array.isArray(watchLater) ? watchLater : [];

  return (
    <>
      <Suspense fallback={<div className="p-4"></div>}>
        <Navbar />
      </Suspense>

      <div className="p-6 space-y-6 w-[90%] m-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Clock className="text-blue-500" />
            Watch Later ({safeWatchLater.length})
          </h1>

          {safeWatchLater.length > 0 && (
            <button
              onClick={clearWatchLater}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {safeWatchLater.length < 1 ? (
          <div className="text-center py-16">
            <BookmarkCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Nothing to watch later
            </h2>
            <p className="text-gray-500">
              Save videos for later by clicking the bookmark icon on any video
              card.
            </p>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center gap-4 gap-y-4 flex-wrap">
            {safeWatchLater.map((item, index) => (
              <MovieCard
                key={item.videoId || item.id || `watch-${index}`}
                data={item}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
