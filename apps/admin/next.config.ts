import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── Transpile workspace packages ────────────────────────── */
  transpilePackages: [
    "@tattva/ui",
    "@tattva/database",
    "@tattva/auth",
    "@tattva/analytics",
    "@tattva/shared-types",
    "@tattva/config",
    "@tattva/logger",
  ],

  /* ── Security & Quality ──────────────────────────────────── */
  reactStrictMode: true,
  poweredByHeader: false,

  /* ── Experimental ────────────────────────────────────────── */
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
