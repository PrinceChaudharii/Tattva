import type { Config } from "tailwindcss";

// ─── Education Brand Colors ──────────────────────────────────────────────────

/**
 * Tattva brand color palette.
 * Inspired by Indian education heritage with modern accessibility.
 */
export const brandColors = {
  /** Primary — deep saffron (knowledge) */
  primary: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407",
  },
  /** Secondary — scholarly green */
  secondary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },
  /** Accent — turmeric gold */
  accent: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
    950: "#422006",
  },
  /** Neutral — slate */
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
} as const;

// ─── Subject Colors ──────────────────────────────────────────────────────────

/**
 * Default color mapping for NCERT subjects.
 */
export const subjectColors: Record<string, string> = {
  Mathematics: "#3b82f6",
  Physics: "#8b5cf6",
  Chemistry: "#10b981",
  Biology: "#22c55e",
  English: "#f59e0b",
  Hindi: "#ef4444",
  History: "#f97316",
  Geography: "#06b6d4",
  Civics: "#6366f1",
  Economics: "#ec4899",
  "Computer Science": "#14b8a6",
} as const;

// ─── Shared Tailwind Preset ──────────────────────────────────────────────────

/**
 * Shared Tailwind CSS configuration preset for the Tattva monorepo.
 *
 * @example
 * ```ts
 * // tailwind.config.ts
 * import { tattvaPreset } from "@tattva/config/tailwind";
 *
 * export default {
 *   ...tattvaPreset,
 *   content: ["./src/**/*.{ts,tsx}"],
 * };
 * ```
 */
export const tattvaPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: brandColors.primary,
        secondary: brandColors.secondary,
        accent: brandColors.accent,
        background: brandColors.neutral[50],
        foreground: brandColors.neutral[950],
        card: brandColors.neutral[50],
        "card-foreground": brandColors.neutral[950],
        popover: brandColors.neutral[50],
        "popover-foreground": brandColors.neutral[950],
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#fafafa",
        },
        muted: {
          DEFAULT: brandColors.neutral[100],
          foreground: brandColors.neutral[500],
        },
        "accent-color": {
          DEFAULT: brandColors.accent[500],
          foreground: brandColors.accent[950],
        },
        input: brandColors.neutral[200],
        ring: brandColors.primary[500],
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Merriweather", "Georgia", "serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      spacing: {
        "4.5": "1.125rem",
        "18": "4.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
} satisfies Partial<Config>;

/**
 * Generate the full Tailwind config for a specific app or package.
 */
export function createTailwindConfig(
  overrides?: Partial<Config>
): Partial<Config> {
  return {
    ...tattvaPreset,
    ...overrides,
    theme: {
      ...tattvaPreset.theme,
      ...overrides?.theme,
      extend: {
        ...tattvaPreset.theme?.extend,
        ...overrides?.theme?.extend,
      },
    },
  };
}
