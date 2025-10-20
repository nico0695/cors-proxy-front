import { decodeJwt } from "jose";
import type { AuthTokens, PublicUser } from "./types";

// In-memory storage for access token (faster access, cleared on page reload)
let accessTokenRef = "";

// Refresh timer reference
let refreshTimeoutId: NodeJS.Timeout | null = null;

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
  USER: "auth_user",
} as const;

/**
 * Decode JWT token and extract claims
 */
export function decodeToken(token: string): {
  exp?: number;
  iat?: number;
  userId?: string;
  [key: string]: unknown;
} {
  try {
    return decodeJwt(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return {};
  }
}

/**
 * Check if a token is expired or will expire soon
 */
export function isTokenExpired(
  token: string,
  bufferMs: number = 5000
): boolean {
  const decoded = decodeToken(token);
  if (!decoded.exp) return true;

  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const now = Date.now();

  return now >= expiryTime - bufferMs;
}

/**
 * Get access token from memory or localStorage
 */
export function getAccessToken(): string | null {
  if (!isBrowser) return null;

  // Try in-memory first
  if (accessTokenRef) {
    return accessTokenRef;
  }

  // Fall back to localStorage
  const stored = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (stored) {
    accessTokenRef = stored;
    return stored;
  }

  return null;
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Get stored user from localStorage
 */
export function getStoredUser(): PublicUser | null {
  if (!isBrowser) return null;

  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Store tokens and user in memory and localStorage
 */
export function setSession(tokens: AuthTokens, user: PublicUser): void {
  if (!isBrowser) return;

  // Store in memory for fast access
  accessTokenRef = tokens.accessToken;

  // Store in localStorage for persistence
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

  // Schedule token refresh
  scheduleTokenRefresh(tokens.accessToken);
}

/**
 * Update access token (called after refresh)
 */
export function updateAccessToken(accessToken: string): void {
  if (!isBrowser) return;

  accessTokenRef = accessToken;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

  // Reschedule refresh
  scheduleTokenRefresh(accessToken);
}

/**
 * Clear session from memory and localStorage
 */
export function clearSession(): void {
  if (!isBrowser) return;

  // Clear memory
  accessTokenRef = "";

  // Clear localStorage
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);

  // Clear refresh timer
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }
}

/**
 * Schedule automatic token refresh before expiry
 */
export function scheduleTokenRefresh(
  accessToken: string,
  onRefresh?: () => Promise<void>
): void {
  if (!isBrowser) return;

  // Clear existing timer
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }

  const decoded = decodeToken(accessToken);
  if (!decoded.exp) return;

  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  const refreshWindow =
    Number(process.env.NEXT_PUBLIC_AUTH_REFRESH_WINDOW) || 60000; // Default 60s

  // Calculate when to refresh (before expiry)
  const refreshTime = expiryTime - refreshWindow;
  const timeUntilRefresh = refreshTime - now;

  // Only schedule if there's time left
  if (timeUntilRefresh > 0) {
    refreshTimeoutId = setTimeout(() => {
      if (onRefresh) {
        onRefresh().catch((error) => {
          console.error("Auto-refresh failed:", error);
          clearSession();
        });
      }
    }, timeUntilRefresh);
  }
}

/**
 * Cancel scheduled refresh
 */
export function cancelTokenRefresh(): void {
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }
}
