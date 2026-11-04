import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Exhibition's demo moved beside the other templates' demos; old links still work.
  async redirects() {
    return [
      { source: "/exhibition", destination: "/templates/demo/exhibition", permanent: true },
      { source: "/exhibition/works", destination: "/templates/demo/exhibition/works", permanent: true },
    ];
  },
  images: {
    // 75 is the default; 90 is for the template screenshots, where small text must stay crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
