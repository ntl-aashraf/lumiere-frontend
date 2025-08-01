"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookmarkCheck, Heart, BookmarkPlus } from "lucide-react";

const MovieCard = ({
  data,
  isFavorite,
  isInWatchLater,
  onToggleFavorite,
  onToggleWatchLater,
}) => {
  // console.log(data);
  const videoId = data.videoId;
  const title = data.title;
  const thumbnail = data.thumbnail;
  const description = data.description;
  const channelTitle = data.channelTitle;
  const year = data.year;
  const watchUrl =
    data.watchUrl || `https://www.youtube.com/watch?v=${videoId}`;
  const publishedDate = data.publishedAt
    ? new Date(data.publishedAt).toLocaleDateString()
    : "";

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(data);
  };

  const handleWatchLaterClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWatchLater(data);
  };

  return (
    <div className="relative hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out rounded-xl overflow-hidden w-full sm:w-[300px] movie-card group">
      {/* Action Buttons - Top Right Corner */}
      <div className="absolute top-2 right-2 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleFavoriteClick}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
            isFavorite
              ? "bg-red-500 text-white shadow-lg"
              : "bg-black/50 text-white hover:bg-red-500"
          }`}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        <button
          onClick={handleWatchLaterClick}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
            isInWatchLater
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-black/50 text-white hover:bg-blue-500"
          }`}
          title={
            isInWatchLater ? "Remove from watch later" : "Add to watch later"
          }
        >
          {isInWatchLater ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <BookmarkPlus className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Clickable Link Area */}
      <Link
        href={watchUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="block !no-underline"
      >
        <div className="w-full h-[350px] relative">
          <Image
            src={
              thumbnail || "https://placehold.co/300x450?text=Video+Thumbnail"
            }
            alt={title}
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 5v10l8-5-8-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="py-2 px-2 flex flex-col">
          <h3 className="text-xl font-semibold line-clamp-1">
            {title || "Untitled Video"}
          </h3>
          <p className="text-sm text-gray-500 mb-1">
            {channelTitle || "Unknown Channel"}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {description
              ? description.slice(0, 100) + "..."
              : "No description available"}
          </p>
          <div className="text-xs text-gray-400">
            <span>📅 {year || publishedDate || "N/A"} </span>
            <span className="ml-2">🎥 YouTube Video</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
