/**
 * Validates file properties before triggering upload operations.
 */
export interface FileValidationOptions {
  maxSizeInBytes?: number;
  allowedTypes?: string[];
}

export const validateFileForUpload = (
  file: File,
  options: FileValidationOptions = {}
): { valid: boolean; error?: string } => {
  if (options.maxSizeInBytes && file.size > options.maxSizeInBytes) {
    return { valid: false, error: 'File size exceeds maximum allowed threshold.' };
  }
  if (options.allowedTypes && options.allowedTypes.length > 0) {
    const isAllowed = options.allowedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });
    if (!isAllowed) {
      return { valid: false, error: 'Unsupported file format.' };
    }
  }
  return { valid: true };
};