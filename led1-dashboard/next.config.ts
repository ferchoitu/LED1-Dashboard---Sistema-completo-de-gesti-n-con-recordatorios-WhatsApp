import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export for Vercel dynamic deployment
  // output: 'export',
  // trailingSlash: true,
  images: {
    // Keep unoptimized for better compatibility
    unoptimized: true
  },
  // Optimize for Vercel deployment
  poweredByHeader: false,
  reactStrictMode: true,
  // Disable ESLint during builds for faster deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
