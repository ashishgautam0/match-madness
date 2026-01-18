import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed 'output: export' for Vercel deployment
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
