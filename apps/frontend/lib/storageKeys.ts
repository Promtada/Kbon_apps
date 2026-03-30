/**
 * 🔑 Centralized localStorage key constants for Kbon Platform.
 * Prefixed with "kbon-" to avoid collisions with other apps on localhost.
 */

export const STORAGE_KEYS = {
  USER: 'kbon-user',
  ACCESS_TOKEN: 'kbon-access-token',
  ADMIN_TOKEN: 'kbon-admin-token',
  AUTH_STORAGE: 'kbon-auth-storage',
  CART: 'kbon-cart-storage',
  REMEMBERED_EMAIL: 'kbon-remembered-email',
} as const;
