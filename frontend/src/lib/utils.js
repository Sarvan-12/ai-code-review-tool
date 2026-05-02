/**
 * Simple class name merger utility (replaces clsx + tailwind-merge)
 * Filters out falsy values and joins class strings.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
