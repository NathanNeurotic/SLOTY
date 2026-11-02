/**
 * Dual LocalStorage + Cookie Session Persistence Manager
 * Ensures slot machine balances, VIP XP, active bets, settings,
 * and game state survive browser restarts, mobile webviews, and tab closures.
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

  // Write string to both localStorage and persistent cookie
  setItem(key: string, value: string): void {
    // 1. Write to localStorage
    try {
      localStorage.setItem(key, value);
    } catch {
      // localStorage blocked
    }

    // 2. Mirror into persistent cookie (365 days, SameSite=Lax, path=/)
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
