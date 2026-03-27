import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const DEFAULT_API_BASE_URL = "http://localhost:8080";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  return normalizeBaseUrl(
    process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL
  );
}

export function joinUrl(baseUrl: string, path: string) {
  const normalizedPath =
    path.startsWith("?") ? path : `/${path.replace(/^\/+/, "")}`;

  return `${normalizeBaseUrl(baseUrl)}${normalizedPath}`;
}
