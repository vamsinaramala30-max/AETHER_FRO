import { api } from '../../shared/api';

export interface ContactFormData {
  fullName: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  company?: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  message: string;
  data?: {
    id: string;
    referenceId: string;
    receivedAt: string;
  };
}

export const contactService = {
  submitContactForm: async (data: ContactFormData): Promise<ContactSubmissionResult> => {
    const response = await api.post<ContactSubmissionResult>('/contact', data);
    return response.data;
  },

  submitFeedbackForm: async (data: ContactFormData): Promise<ContactSubmissionResult> => {
    const response = await api.post<ContactSubmissionResult>('/feedback', data);
    return response.data;
  },
};
