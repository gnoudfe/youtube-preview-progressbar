import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/youtube-preview-progressbar",
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
