import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS conflict resolution.
 *
 * Combines `clsx` for conditional class construction with `tailwind-merge`
 * to intelligently resolve conflicting Tailwind utility classes.
 *
 * @example
 * ```tsx
 * <div className={cn("px-4 py-2", isActive && "bg-blue-500", className)} />
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
