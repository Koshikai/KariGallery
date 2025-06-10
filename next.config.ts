import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack設定（experimental.turboは非推奨）
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      // Supabase Storage
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      // Netlify CDN
      {
        protocol: "https",
        hostname: "*.netlify.app",
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
  // Netlify最適化設定
  trailingSlash: false,
  reactStrictMode: true,
  // 環境変数の暴露設定
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
