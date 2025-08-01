"use client";

import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEST_PUBLIC_BACKEND_PATH,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(favorites);
    console.log(watchLater);
  }, [favorites, watchLater]);

  const loadUserData = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const [favRes, watchRes] = await Promise.all([
        api.get("/api/favorites"),
        api.get("/api/watch-later"),
      ]);

      console.log(favRes);
      console.log(watchLater);
      setFavorites(favRes.data || []);
      setWatchLater(watchRes.data || []);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load your saved videos");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    } else {
      setFavorites([]);
      setWatchLater([]);
    }
  }, [isAuthenticated, loadUserData]);

  const requireAuth = () => {
    if (!isAuthenticated || !user) {
      toast.error("Please login first");
      return false;
    }
    return true;
  };

  // ========= FAVORITES =========

  const addToFavorites = async (video) => {
    if (!requireAuth()) return;

    try {
      const dto = mapVideoToDto(video);
      console.log("📦 Sending DTO to backend:", dto);
      const res = await api.post("/api/favorites", dto);
      setFavorites((prev) => [res.data, ...(Array.isArray(prev) ? prev : [])]);
      toast.success("Added to favorites!");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.info("Already in favorites!");
      } else {
        toast.error("Failed to add to favorites");
      }
      console.error(err);
    }
  };

  const removeFromFavorites = async (video) => {
    if (!requireAuth()) return;
    console.log("video being deleted: ", video);
    try {
      const id = video.videoId;
      console.log(id);
      await api.delete(`/api/favorites/${id}`);
      setFavorites((prev) =>
        prev.filter((v) => v.id !== id && v.videoId !== id)
      );
      toast.success("Removed from favorites!");
    } catch (err) {
      toast.error("Failed to remove from favorites");
      console.error(err);
    }
  };

  const isFavorite = (video) => {
    const id = video.id || video.videoId;
    if (favorites.length < 1) {
      return;
    }
    return (
      Array.isArray(favorites) &&
      favorites.some((v) => v.videoId === id || v.id === id)
    );
  };

  const clearFavorites = async () => {
    if (!requireAuth()) return;

    try {
      await api.delete("/api/favorites");
      setFavorites([]);
      toast.success("All favorites cleared!");
    } catch (err) {
      toast.error("Failed to clear favorites");
      console.error(err);
    }
  };

  // ========= WATCH LATER =========

  const addToWatchLater = async (video) => {
    if (!requireAuth()) return;

    try {
      const dto = mapVideoToDto(video);
      console.log("Prepared Dto: ", dto);
      const res = await api.post("/api/watch-later", dto);
      setWatchLater((prev) => [res.data, ...(Array.isArray(prev) ? prev : [])]);
      toast.success("Added to watch later!");
    } catch (err) {
      if (err.response?.status === 409) {
        toast.info("Already in watch later!");
      } else {
        toast.error("Failed to add to watch later");
      }
      console.error(err);
    }
  };

  const removeFromWatchLater = async (video) => {
    if (!requireAuth()) return;

    try {
      const id = video.id || video.videoId;
      await api.delete(`/api/watch-later/${id}`);
      setWatchLater((prev) =>
        prev.filter((v) => v.id !== id && v.videoId !== id)
      );
      toast.success("Removed from watch later!");
    } catch (err) {
      toast.error("Failed to remove from watch later");
      console.error(err);
    }
  };

  const isInWatchLater = (video) => {
    const id = video.id || video.videoId;
    if (watchLater.length < 1) {
      return;
    }

    return (
      Array.isArray(watchLater) &&
      watchLater.some((v) => v.videoId === id || v.id === id)
    );
  };

  const clearWatchLater = async () => {
    if (!requireAuth()) return;

    try {
      await api.delete("/api/watch-later");
      setWatchLater([]);
      toast.success("Watch later list cleared!");
    } catch (err) {
      toast.error("Failed to clear watch later");
      console.error(err);
    }
  };

  // ========= VIDEO MAPPER =========

  const mapVideoToDto = (video) => {
    const dto = {
      videoId: video.videoId,
      title: video.title,
      watchUrl: video.watchUrl,
      type: video.type || "video",
    };

    if (video.description) dto.description = video.description;
    if (video.thumbnail) dto.thumbnail = video.thumbnail;
    if (video.channelTitle) dto.channelTitle = video.channelTitle;
    if (video.channelId) dto.channelId = video.channelId;
    if (video.publishedAt) dto.publishedAt = video.publishedAt;
    if (video.year) dto.year = video.year;

    return dto;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        watchLater,
        loading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearFavorites,
        addToWatchLater,
        removeFromWatchLater,
        isInWatchLater,
        clearWatchLater,
        refreshUserData: loadUserData,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
