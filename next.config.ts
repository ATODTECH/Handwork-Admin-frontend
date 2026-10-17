import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/dashboard/overview", permanent: false },
      { source: "/dashboard", destination: "/dashboard/overview", permanent: false },
    ]
  },
};

export default nextConfig;
