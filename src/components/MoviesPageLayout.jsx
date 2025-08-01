"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { useStreaming } from "@/hooks/StreamingContext";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useFavorites } from "@/hooks/SaveVideoContext";
import { useAuth } from "@/hooks/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function WatchPage() {
  const { data, loading, error, search, hasMore } = useStreaming();
  const { user } = useAuth();
  const {
    favorites,
    watchLater,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToWatchLater,
    removeFromWatchLater,
    isInWatchLater,
  } = useFavorites();
  const observerRef = useRef();
  const sentinelRef = useRef();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  // 👇 Initial fetch
  useEffect(() => {
    if (query) {
      search(query, true);
    }
  }, [query]);

  // 👇 Infinite scroll logic
  const loadMore = useCallback(() => {
    if (query && hasMore && !loading) {
      search(query, false);
    }
  }, [query, hasMore, loading, search]);

  // 👇 Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading 100px before the sentinel comes into view
      }
    );

    observerRef.current = observer;

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, loading]);

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6 w-[90%] m-auto">
        <h1 className="text-3xl font-bold text-center">
          {query ? `Results for "${query}"` : "YouTube Videos"}
        </h1>

        {error && (
          <div className="text-red-500 text-center bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-row items-center justify-center gap-4 gap-y-4 flex-wrap">
          {data.map((item, index) => {
            const id = item.id || item.videoId;

            return (
              <MovieCard
                key={id || `video-${index}`}
                data={item}
                isFavorite={isFavorite(item)}
                isInWatchLater={isInWatchLater(item)}
                onToggleFavorite={() =>
                  isFavorite(item)
                    ? removeFromFavorites(item)
                    : addToFavorites(item)
                }
                onToggleWatchLater={() =>
                  isInWatchLater(item)
                    ? removeFromWatchLater(item)
                    : addToWatchLater(item)
                }
              />
            );
          })}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            <span className="ml-2 text-gray-600">Loading more videos...</span>
          </div>
        )}

        {/* Sentinel element for intersection observer */}
        {hasMore && !loading && data.length > 0 && (
          <div
            ref={sentinelRef}
            className="h-10 flex justify-center items-center"
          >
            <div className="text-gray-400 text-sm">Scroll for more videos</div>
          </div>
        )}

        {/* No more content message */}
        {!hasMore && data.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>You've seen all available videos for this search!</p>
          </div>
        )}

        {/* No results message */}
        {!loading && data.length === 0 && query && !error && (
          <div className="text-center py-8 text-gray-500">
            <p>No videos found for "{query}". Try different keywords.</p>
          </div>
        )}

        {/* API Key missing warning */}
        {error && error.includes("API") && (
          <div className="text-center py-4 text-sm text-amber-600 bg-amber-50 rounded-lg">
            <p>Make sure you've added your YouTube API key to .env.local</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
