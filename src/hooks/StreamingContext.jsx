"use client";

import React, { useState, useContext, createContext } from "react";
import axios from "axios";
import { toast } from "sonner";

const StreamingContext = createContext();

export const StreamingProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentQuery, setCurrentQuery] = useState("");
  const [nextPageToken, setNextPageToken] = useState("");

  // YouTube API configuration
  const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

  const search = async (q, reset = false) => {
    // Prevent multiple simultaneous requests
    if (loading) return;

    // If no query provided, don't search
    if (!q) return;

    // If it's a new query, reset everything
    if (reset || q !== currentQuery) {
      setData([]);
      setNextPageToken("");
      setHasMore(true);
      setCurrentQuery(q);
    }

    // If no more content available, don't fetch
    if (!hasMore && !reset && q === currentQuery) return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        part: "snippet",
        q: q,
        type: "video", // Change to 'channel' or 'playlist' as needed
        maxResults: 20, // YouTube allows up to 50
        key: YOUTUBE_API_KEY,
      };

      // Add pageToken for pagination (except for first call)
      if (!reset && nextPageToken && q === currentQuery) {
        params.pageToken = nextPageToken;
      }

      const response = await axios.get(YOUTUBE_BASE_URL, { params });

      const youtubeData = response.data;
      const newVideos = youtubeData.items || [];

      console.log("YouTube API response:", {
        totalResults: youtubeData.pageInfo?.totalResults,
        resultsPerPage: youtubeData.pageInfo?.resultsPerPage,
        nextPageToken: youtubeData.nextPageToken,
        itemsCount: newVideos.length,
      });

      // Transform YouTube data to match your existing structure
      const transformedData = newVideos.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        // Ensure HTTPS URLs for thumbnails
        thumbnail:
          item.snippet.thumbnails.high?.url?.replace("http://", "https://") ||
          item.snippet.thumbnails.medium?.url?.replace("http://", "https://") ||
          item.snippet.thumbnails.default?.url?.replace(
            "http://",
            "https://"
          ) ||
          `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        // Add YouTube-specific fields
        videoId: item.id.videoId,
        channelId: item.snippet.channelId,
        // Create a watch URL
        watchUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        // Add any other fields your MovieCard component needs
        year: new Date(item.snippet.publishedAt).getFullYear(),
        type: "video",
      }));

      if (transformedData.length === 0) {
        setHasMore(false);
        if (reset || q !== currentQuery) {
          setData([]);
        }
      } else {
        // Update nextPageToken for pagination
        setNextPageToken(youtubeData.nextPageToken || "");

        // If no nextPageToken, we've reached the end
        if (!youtubeData.nextPageToken) {
          setHasMore(false);
        }

        if (reset || q !== currentQuery) {
          // Fresh search - replace all data
          setData(transformedData);
        } else {
          // Infinite scroll - append new data
          setData((prev) => {
            // YouTube API shouldn't return duplicates with proper pagination,
            // but let's keep duplicate prevention as safety
            const existingIds = new Set(
              prev.map((item) => item.id || item.videoId)
            );
            const uniqueNewData = transformedData.filter(
              (item) => !existingIds.has(item.id || item.videoId)
            );

            console.log(`Adding ${uniqueNewData.length} new videos`);
            return [...prev, ...uniqueNewData];
          });
        }
      }
    } catch (err) {
      console.error("YouTube API ERROR:", err);

      // Handle specific YouTube API errors
      if (err.response?.status === 403) {
        setError("YouTube API quota exceeded. Please try again later.");
        toast.error("API quota exceeded");
      } else if (err.response?.status === 400) {
        setError("Invalid search query. Please try different keywords.");
        toast.error("Invalid search query");
      } else {
        setError("Failed to fetch YouTube data");
        toast.error("API Error: Couldn't load videos");
      }

      // If it's the first page and fails, ensure we can retry
      if (reset || !nextPageToken) {
        setHasMore(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset function to clear all data
  const resetData = () => {
    setData([]);
    setNextPageToken("");
    setHasMore(true);
    setCurrentQuery("");
    setError(null);
  };

  return (
    <StreamingContext.Provider
      value={{
        data,
        loading,
        error,
        search,
        hasMore,
        currentQuery,
        nextPageToken,
        resetData,
      }}
    >
      {children}
    </StreamingContext.Provider>
  );
};

export const useStreaming = () => {
  const context = useContext(StreamingContext);
  if (!context) {
    throw new Error("useStreaming must be used within a StreamingProvider");
  }
  return context;
};
