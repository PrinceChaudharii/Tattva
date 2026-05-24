import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── Transpile workspace packages ────────────────────────── */
  transpilePackages: [
    "@tattva/database",
    "@tattva/auth",
    "@tattva/shared-types",
    "@tattva/config",
    "@tattva/logger",
  ],

  /* ── Security & Quality ──────────────────────────────────── */
  reactStrictMode: true,
  poweredByHeader: false,

  /* ── API-specific ────────────────────────────────────────── */
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
