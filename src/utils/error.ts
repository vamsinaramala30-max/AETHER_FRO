import { ApiErrorResponse } from '../types/api';

/**
 * Normalizes unknown catch block errors into uniform message strings.
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiErrorResponse;
    if (apiError.error && apiError.error.message) {
      return apiError.error.message;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};