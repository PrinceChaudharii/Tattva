// ─── @tattva/config ──────────────────────────────────────────────────────────
// Barrel export for shared configurations

// Tailwind
export {
  brandColors,
  subjectColors,
  tattvaPreset,
  createTailwindConfig,
} from "./tailwind/index.js";

// TypeScript
export {
  strictCompilerOptions,
  libraryCompilerOptions,
  reactCompilerOptions,
  nextJsCompilerOptions,
  pathAliases,
  createCompilerOptions,
} from "./typescript/index.js";
