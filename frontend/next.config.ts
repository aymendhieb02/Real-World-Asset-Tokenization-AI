import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Disable source maps to prevent errors
  productionBrowserSourceMaps: false,
  // Turbopack configuration (Next.js 16+ uses Turbopack by default)
  // Empty config to silence the warning about webpack vs turbopack
  turbopack: {},
};

export default nextConfig;
