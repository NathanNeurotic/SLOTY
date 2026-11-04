/**
 * LocalStorage-first persistence with a cookie fallback.
 * localStorage is the primary store. Cookies are written ONLY when
 * localStorage is unavailable (private/sandboxed webviews), so normal
 * browsers do not ship every game-state key back to the server as a
 * cookie on each request.
 */

const COOKIE_MAX_AGE_DAYS = 365;

export const storage = {
  // Read string with localStorage primary and cookie fallback
  getItem(key: string): string | null {
    // 1. Try localStorage
    try {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    } catch {
      // localStorage may be disabled in private/sandboxed webviews
    }

    // 2. Fallback to document.cookie
    try {
      if (typeof document !== 'undefined') {
        const nameEQ = `${encodeURIComponent(key)}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
          }
        }
      }
    } catch {
      // Cookie access fallback
    }

    return null;
  },

  // Write string to localStorage; fall back to a persistent cookie only
  // when localStorage is unavailable
  setItem(key: string, value: string): void {
    // 1. Write to localStorage (primary store)
    try {
      localStorage.setItem(key, value);
      return;
    } catch {
      // localStorage blocked — fall through to the cookie fallback
    }

    // 2. Fallback: persistent cookie (365 days, SameSite=Lax, path=/)
    try {
      if (typeof document !== 'undefined') {
        const date = new Date();
        date.setTime(date.getTime() + COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
        const expires = `; expires=${date.toUTCString()}`;
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
          value
        )}${expires}; path=/; SameSite=Lax`;
      }
    } catch {
      // Cookie writing fallback
    }
  },

  // Remove a key from both stores
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // localStorage blocked
    }
    try {
      if (typeof document !== 'undefined') {
        document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
      }
    } catch {
      // Cookie access fallback
    }
  },

  // Number helper
  getNumber(key: string, defaultValue: number): number {
    const val = this.getItem(key);
    if (val === null) return defaultValue;
    const parsed = Number(val);
    return isNaN(parsed) ? defaultValue : parsed;
  },

  // Boolean helper
  getBoolean(key: string, defaultValue: boolean): boolean {
    const val = this.getItem(key);
    if (val === null) return defaultValue;
    return val === 'true';
  },

  // JSON helper
  getJSON<T>(key: string, defaultValue: T): T {
    const val = this.getItem(key);
    if (val === null) return defaultValue;
    try {
      return JSON.parse(val) as T;
    } catch {
      return defaultValue;
    }
  },

  setJSON<T>(key: string, value: T): void {
    this.setItem(key, JSON.stringify(value));
  },
};
