/**
 * Validates file properties before triggering upload operations.
 */
export interface FileValidationOptions {
  maxSizeInBytes?: number;
  allowedTypes?: string[];
}

export const validateFileForUpload = (
  file: File,
  options: FileValidationOptions = {},
): { valid: boolean; error?: string } => {
  if (
    typeof options.maxSizeInBytes === 'number' &&
    options.maxSizeInBytes > 0 &&
    file.size > options.maxSizeInBytes
  ) {
    return { valid: false, error: 'File size exceeds maximum allowed threshold.' };
  }
  if (Array.isArray(options.allowedTypes) && options.allowedTypes.length > 0) {
    const allowed = options.allowedTypes;
    const isAllowed = allowed.some((type) => {
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
