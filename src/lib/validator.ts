export const validators = {
  isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  isUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  isPhone(value: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 Standard
    return phoneRegex.test(value.replace(/[\s()-]/g, ''));
  },

  isRequired(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },

  hasLength(value: string, options: { min?: number; max?: number }): boolean {
    const len = value.trim().length;
    if (options.min !== undefined && len < options.min) return false;
    if (options.max !== undefined && len > options.max) return false;
    return true;
  },

  isStrongPassword(value: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    if (value.length < 8) errors.push('Must be at least 8 characters long');
    if (!/[A-Z]/.test(value)) errors.push('Must contain at least one uppercase letter');
    if (!/[a-z]/.test(value)) errors.push('Must contain at least one lowercase letter');
    if (!/[0-9]/.test(value)) errors.push('Must contain at least one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
      errors.push('Must contain at least one special character');

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};