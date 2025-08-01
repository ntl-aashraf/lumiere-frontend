/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.ytimg.com", // YouTube thumbnails
      "img.youtube.com", // Alternative YouTube thumbnails
      "yt3.ggpht.com", // YouTube channel avatars
      "placehold.co", // Your placeholder service
      // Add your existing domains here if any
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ytimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
