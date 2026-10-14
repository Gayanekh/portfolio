import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // 75 is the default; 90 is for the template screenshots, where small text must stay crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
