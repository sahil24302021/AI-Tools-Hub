// frontend/src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine class names safely
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
