import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.mohimaa.shop",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev.mohimaa.shop",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
