import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Next.js 15の新機能を活用
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // TypeScript設定
  typescript: {
    ignoreBuildErrors: false,
  },
  // ESLint設定
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Netlify最適化
  output: "standalone",
};

export default nextConfig;
