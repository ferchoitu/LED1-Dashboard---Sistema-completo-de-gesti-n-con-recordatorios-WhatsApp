import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: 'export' to allow dynamic routes
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
