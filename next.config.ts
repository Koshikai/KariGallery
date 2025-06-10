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
  // Windows環境での問題を回避（standaloneモードを無効化）
  // experimental: {},
  // Netlify最適化（Windows環境では一時的に無効化）
  // output: "standalone",
};

export default nextConfig;
