import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://127.0.0.1:52867", "http://localhost:52867", "127.0.0.1", "localhost"],
};

export default nextConfig;
