/**
 * Validation utilities for form inputs, role data, and academic scores across CampusConnect.
 */
export type ValidationResult = { valid: true } | { valid: false; errors: Record<string, string> };

/**
 * Checks required fields in a form dataset and returns a structured validation result.
 * Any field that is undefined, null, or an empty/whitespace-only string is flagged.
 */
export function validateRequired(fields: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};
  Object.entries(fields).forEach(([name, value]) => {
    if (value === undefined || value === null || String(value).trim() === '') errors[name] = 'This field is required.';
  });
  // No errors collected means every required field was present.
  return Object.keys(errors).length ? { valid: false, errors } : { valid: true };
}

/**
 * Common field-level validator functions for email, phone, date ranges, CGPA, and marks.
 * Each validator returns `null` when the value is valid, or a user-facing
 * error message string when it isn't — making these easy to plug into any form.
 */
export const validators = {
  // Basic "something@something.something" shape check, not a full RFC 5322 validation.
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Enter a valid email address.',
  // Allows an optional leading + and at least 7 digits/spaces/dashes, to support international numbers.
  phone: (value: string) => /^[+\d][\d\s-]{7,}$/.test(value) ? null : 'Enter a valid phone number.',
  // Simple string comparison works because dates are expected in ISO (YYYY-MM-DD) form.
  dateRange: (from: string, to: string) => from <= to ? null : 'End date must be on or after the start date.',
  // CGPA is validated on CampusConnect's 0-10 scale.
  cgpa: (value: number) => value >= 0 && value <= 10 ? null : 'CGPA must be between 0 and 10.',
  // Defaults to a 100-mark maximum but accepts a custom ceiling (e.g. for a 50-mark quiz).
  mark: (value: number, maximum = 100) => value >= 0 && value <= maximum ? null : `Marks must be between 0 and ${maximum}.`,
};
