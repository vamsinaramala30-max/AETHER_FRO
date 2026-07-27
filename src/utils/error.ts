/**
 * Normalizes unknown catch block errors into uniform message strings.
 */
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;

  if (typeof error === 'object' && error !== null) {
    const apiError = error as { error?: { message?: string } };
    if (typeof apiError.error?.message === 'string' && apiError.error.message.trim() !== '') {
      return apiError.error.message;
    }
  }

  return 'An unexpected error occurred. Please try again.';
};
