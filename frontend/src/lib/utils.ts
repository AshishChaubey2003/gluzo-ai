import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

/** Stagger animation delay classes */
export function staggerDelay(index: number): string {
  const delays = ["", "animation-delay-100", "animation-delay-200", "animation-delay-300", "animation-delay-400"];
  return delays[Math.min(index, delays.length - 1)];
}
