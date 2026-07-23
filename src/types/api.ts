import { PaginatedMeta } from './common';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginatedMeta;
  timestamp: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
  timestamp: string;
}