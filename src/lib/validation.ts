export type ValidationResult = { valid: true } | { valid: false; errors: Record<string, string> };

export function validateRequired(fields: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};
  Object.entries(fields).forEach(([name, value]) => {
    if (value === undefined || value === null || String(value).trim() === '') errors[name] = 'This field is required.';
  });
  return Object.keys(errors).length ? { valid: false, errors } : { valid: true };
}

export const validators = {
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Enter a valid email address.',
  phone: (value: string) => /^[+\d][\d\s-]{7,}$/.test(value) ? null : 'Enter a valid phone number.',
  dateRange: (from: string, to: string) => from <= to ? null : 'End date must be on or after the start date.',
  cgpa: (value: number) => value >= 0 && value <= 10 ? null : 'CGPA must be between 0 and 10.',
  mark: (value: number, maximum = 100) => value >= 0 && value <= maximum ? null : `Marks must be between 0 and ${maximum}.`,
};
