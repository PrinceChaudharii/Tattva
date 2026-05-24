import type { CompilerOptions } from "typescript";

// ─── Shared TypeScript Configuration References ──────────────────────────────

/**
 * Shared strict compiler options for all packages.
 * These mirror the settings in tsconfig.base.json for programmatic access.
 */
export const strictCompilerOptions: CompilerOptions = {
  strict: true,
  noUncheckedIndexedAccess: true,
  noEmit: true,
  esModuleInterop: true,
  skipLibCheck: true,
  forceConsistentCasingInFileNames: true,
  allowUnusedLabels: false,
  allowUnreachableCode: false,
  noFallthroughCasesInSwitch: true,
  noImplicitOverride: true,
  noPropertyAccessFromIndexSignature: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  target: "ES2022" as CompilerOptions["target"],
  module: "ESNext" as CompilerOptions["module"],
  moduleResolution: "bundler" as CompilerOptions["moduleResolution"],
  resolveJsonModule: true,
  isolatedModules: true,
  incremental: true,
} satisfies CompilerOptions;

/**
 * Library-specific compiler options for packages that emit declarations.
 */
export const libraryCompilerOptions: CompilerOptions = {
  ...strictCompilerOptions,
  noEmit: false,
  declaration: true,
  declarationMap: true,
  sourceMap: true,
} satisfies CompilerOptions;

/**
 * React-specific compiler options for packages with JSX.
 */
export const reactCompilerOptions: CompilerOptions = {
  ...libraryCompilerOptions,
  jsx: "react-jsx" as CompilerOptions["jsx"],
} satisfies CompilerOptions;

/**
 * Next.js-specific compiler options for apps.
 */
export const nextJsCompilerOptions: CompilerOptions = {
  ...strictCompilerOptions,
  jsx: "preserve" as CompilerOptions["jsx"],
  plugins: [{ name: "next" }],
} satisfies CompilerOptions;

// ─── Path Aliases ────────────────────────────────────────────────────────────

/**
 * Standard path aliases for the monorepo.
 * These map @tattva/* imports to source directories.
 */
export const pathAliases: Record<string, string[]> = {
  "@tattva/ui": ["./packages/ui/src"],
  "@tattva/ui/*": ["./packages/ui/src/*"],
  "@tattva/database": ["./packages/database/src"],
  "@tattva/database/*": ["./packages/database/src/*"],
  "@tattva/auth": ["./packages/auth/src"],
  "@tattva/auth/*": ["./packages/auth/src/*"],
  "@tattva/content": ["./packages/content/src"],
  "@tattva/content/*": ["./packages/content/src/*"],
  "@tattva/search": ["./packages/search/src"],
  "@tattva/search/*": ["./packages/search/src/*"],
  "@tattva/analytics": ["./packages/analytics/src"],
  "@tattva/analytics/*": ["./packages/analytics/src/*"],
  "@tattva/editor": ["./packages/editor/src"],
  "@tattva/editor/*": ["./packages/editor/src/*"],
  "@tattva/shared-types": ["./packages/shared-types/src"],
  "@tattva/shared-types/*": ["./packages/shared-types/src/*"],
  "@tattva/config": ["./packages/config/src"],
  "@tattva/config/*": ["./packages/config/src/*"],
  "@tattva/logger": ["./packages/logger/src"],
  "@tattva/logger/*": ["./packages/logger/src/*"],
};

/**
 * Create compiler options for a specific package.
 *
 * @param packageName - The package name (e.g., "ui", "database")
 * @param options - Additional compiler option overrides
 * @returns Complete compiler options
 */
export function createCompilerOptions(
  packageName: string,
  options?: Partial<CompilerOptions>
): CompilerOptions {
  const isReact = ["ui", "editor"].includes(packageName);
  const base = isReact ? reactCompilerOptions : libraryCompilerOptions;

  return {
    ...base,
    outDir: "dist",
    rootDir: "src",
    ...options,
  };
}
