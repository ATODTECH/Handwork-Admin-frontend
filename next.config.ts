import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/admin", destination: "/admin/dashboard/overview", permanent: false },
      { source: "/admin/dashboard", destination: "/admin/dashboard/overview", permanent: false },
    ]
  },
};

export default nextConfig;
