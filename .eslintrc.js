/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  ignorePatterns: [
    'dist/**',
    '.next/**',
    'node_modules/**',
    '.turbo/**',
    'drizzle/**',
    'coverage/**',
    '*.tsbuildinfo',
  ],
  rules: {
    // Delegate rule enforcement to individual package configs
    // This root config exists primarily to set root: true and base extensions
  },
};
