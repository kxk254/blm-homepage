import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.66.66.4",
        port: "8000",
        pathname: "/media/**",
      },
      { protocol: "https", hostname: "blmf.jp" },
    ],
  },
};

export default nextConfig;
