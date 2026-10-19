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
    const response = await api.post<any>('/contact', data);
    const body = response?.data || response;
    return {
      success: Boolean(body?.success ?? true),
      message: body?.message || 'Your message has been sent successfully.',
      data: body?.data || (body?.id ? { id: body.id, referenceId: body.referenceId, receivedAt: body.receivedAt } : undefined),
    };
  },

  submitFeedbackForm: async (data: ContactFormData): Promise<ContactSubmissionResult> => {
    const response = await api.post<any>('/feedback', data);
    const body = response?.data || response;
    return {
      success: Boolean(body?.success ?? true),
      message: body?.message || 'Your feedback has been sent successfully.',
      data: body?.data || (body?.id ? { id: body.id, referenceId: body.referenceId, receivedAt: body.receivedAt } : undefined),
    };
  },
};
