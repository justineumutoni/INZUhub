import { z } from 'zod';

/**
 * Validation schema for User Registration
 */
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required.')
      .min(2, 'Full name must be at least 2 characters.'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required.')
      .email('Enter a valid email address.'),
    password: z
      .string()
      .min(1, 'Password is required.')
      .min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Validation schema for Sign In
 */
export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
  password: z
    .string()
    .min(1, 'Password is required.'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

/**
 * Validation schema for Password Reset
 */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Validation schema for Profile Editing
 */
export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required.')
    .min(2, 'Full name must be at least 2 characters.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required.'),
  location: z
    .string()
    .trim()
    .min(1, 'Location is required.'),
  status: z
    .string()
    .trim()
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Helper to parse Zod errors into a field -> error message map
 */
export function formatZodErrors(error: z.ZodError): { [key: string]: string } {
  const errors: { [key: string]: string } = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key && typeof key === 'string' && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
