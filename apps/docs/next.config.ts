import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── MDX Support ─────────────────────────────────────────── */
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  /* ── Transpile workspace packages ────────────────────────── */
  transpilePackages: [
    "@tattva/ui",
    "@tattva/content",
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

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
