import type { NextConfig } from "next";

const backend = (process.env.API_INTERNAL_URL ?? "http://127.0.0.1:4000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
      { source: "/health/db", destination: `${backend}/health/db` },
      { source: "/health", destination: `${backend}/health` },
    ];
  },
};

export default nextConfig;
