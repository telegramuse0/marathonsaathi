import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-7dbceed351f24aee94fcc229ac9bff07.r2.dev",
      },
      {
        protocol: "https",
        hostname: "iskconnewtown.com",
      },
    ],
  },
};

export default nextConfig;