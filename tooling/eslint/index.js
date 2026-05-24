"use strict";

const { resolve } = require("node:path");

// ---------------------------------------------------------------------------
// Base — TypeScript + Import rules (shared by all configs)
// ---------------------------------------------------------------------------
const base = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: true,
    tsconfigRootDir: process.cwd(),
  },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier", // MUST be last — disables rules that conflict with Prettier
  ],
  rules: {
    /* ── TypeScript strictness ─────────────────────────────────────── */
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-unnecessary-type-conversion": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTaggedTemplates: true, allowTernary: true },
    ],

    /* ── Import ordering & hygiene ─────────────────────────────────── */
    "import/no-cycle": "off", // Too slow for large repos — use madge separately
    "import/no-self-import": "error",
    "import/no-duplicates": ["error", { "prefer-inline": true }],
    "import/no-unused-modules": "off",
    "import/newline-after-import": ["error", { count: 1, considerComments: true }],
    "import/no-default-export": "off",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",   // Node.js built-ins
          "external",  // npm packages
          "internal",  // aliases via tsconfig paths
          "parent",    // ../ imports
          "sibling",   // ./ imports
          "index",     // ./index
          "type",
        ],
        "newlines-between": "never",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],

    /* ── General best practices ────────────────────────────────────── */
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    "eqeqeq": ["error", "always", { null: "ignore" }],
    "no-else-return": "error",
    "no-param-reassign": "error",
    "prefer-template": "error",
    "prefer-arrow-callback": "error",
    "arrow-body-style": ["error", "as-needed"],
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["../*"],
            message:
              "Use path aliases (@tattva/*) instead of relative parent imports. See tsconfig.base.json paths.",
          },
        ],
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
  overrides: [
    {
      files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
      ...jsOverride(),
    },
  ],
};

// ---------------------------------------------------------------------------
// React — extends base with React + React Hooks rules
// ---------------------------------------------------------------------------
const react = {
  ...base,
  plugins: [...(base.plugins || []), "react", "react-hooks"],
  extends: [
    ...(Array.isArray(base.extends) ? base.extends : [base.extends]),
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    ...(base.settings || {}),
    react: { version: "detect" },
  },
  rules: {
    ...base.rules,

    /* ── React rules ──────────────────────────────────────────────── */
    "react/prop-types": "off", // We use TypeScript
    "react/react-in-jsx-scope": "off", // Not needed in React 17+
    "react/no-unescaped-entities": "off",
    "react/self-closing-comp": "error",
    "react/jsx-boolean-value": ["error", "never", { always: ["multiline"] }],
    "react/jsx-curly-brace-presence": [
      "error",
      { props: "never", children: "never", propElementValues: "always" },
    ],
    "react/jsx-sort-props": [
      "error",
      {
        callbacksLast: true,
        shorthandFirst: true,
        multiline: "last",
        reservedFirst: true,
      },
    ],
    "react/function-component-definition": [
      "error",
      { namedComponents: "arrow-function" },
    ],
    "react/hook-use-state": "error",
    "react/no-danger": "warn",

    /* ── React Hooks rules ────────────────────────────────────────── */
    "react-hooks/exhaustive-deps": "warn",
  },
};

// ---------------------------------------------------------------------------
// Next.js — extends react with Next.js-specific rules
// ---------------------------------------------------------------------------
const next = {
  ...react,
  extends: [
    ...(Array.isArray(react.extends) ? react.extends : [react.extends]),
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "next/core-web-vitals",
    "next/typescript",
  ],
  rules: {
    ...react.rules,

    /* ── Next.js rules ────────────────────────────────────────────── */
    "@next/next/no-html-link-for-pages": "error",
    "@next/next/no-img-element": "error",
    "@next/next/no-page-custom-font": "error",
    "@next/next/no-sync-scripts": "error",
    "@next/next/no-title-in-document-head": "error",
    "@next/next/no-unwanted-polyfillio": "error",
    "@typescript-eslint/no-var-requires": "off", // Next.js requires some CommonJS
  },
  overrides: [
    ...(base.overrides || []),
    {
      files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
      ...jsOverride(),
    },
    {
      files: ["middleware.ts", "middleware.js"],
      rules: {
        "import/no-default-export": "off", // Next.js middleware requires default export
      },
    },
    {
      files: ["**/route.ts", "**/route.js"],
      rules: {
        "import/no-default-export": "off", // Next.js route handlers use named exports
      },
    },
    {
      files: ["**/layout.tsx", "**/layout.ts", "**/page.tsx", "**/page.ts"],
      rules: {
        "import/no-default-export": "off", // Next.js pages/layouts require default export
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function jsOverride() {
  return {
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  };
}

// ---------------------------------------------------------------------------
// Exports — consumers use: extends: ["@tattva/eslint-config/base"] etc.
// ---------------------------------------------------------------------------
module.exports = { base, react, next };
