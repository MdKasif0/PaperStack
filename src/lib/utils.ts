import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's default scales. Our custom `text-*`
 * type tokens (display, h1…label) must be registered as font-size classes,
 * otherwise `cn()` drops them when they appear alongside a `text-<color>`
 * class (it assumes both are colours and keeps the last one).
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "body-lg",
            "body",
            "small",
            "label",
          ],
        },
      ],
      "max-w": [{ "max-w": ["site"] }],
      rounded: [{ rounded: ["xs", "sm", "md"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
