import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["127.0.0.1"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
