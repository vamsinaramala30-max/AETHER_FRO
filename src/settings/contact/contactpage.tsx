import React, { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, Phone, HelpCircle, Shield, FileText } from 'lucide-react';
import { contactService } from './contactservice';
import { useAuth } from '@/app/providers/authprovider';

export const ContactPage: React.FC = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    category: 'General',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; text: string; refId?: string } | null>(null);

  const categories = [
    'General',
    'Bug',
    'Feature Request',
    'Feedback',
    'Account',
    'Security',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setResult({ success: false, text: 'Please fill in all required fields.' });
      return;
    }

    setSubmitting(true);
    setResult(null);

    contactService
      .submitContactForm(formData)
      .then((res) => {
        setResult({
          success: true,
          text: res.message || 'Your message has been sent successfully.',
          refId: res.data?.referenceId,
        });
        setFormData({
          fullName: user?.name || '',
          email: user?.email || '',
          category: 'General',
          subject: '',
          message: '',
        });
      })
      .catch((err: any) => {
        const errorMsg = err?.response?.data?.error || err?.message || 'Unable to send message. Please try again.';
        setResult({ success: false, text: errorMsg });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleWhatsAppAction = () => {
    const text = encodeURIComponent(`Hello AETHER Support, I am contacting you from the AETHER application.\nName: ${user?.name || 'User'}\nEmail: ${user?.email || ''}`);
    window.open(`https://wa.me/919390223123?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
          <MessageSquare className="h-7 w-7 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Contact & Support Center
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Reach out to the AETHER engineering & support team or submit product feedback.
            </p>
          </div>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Primary Email Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Contact Email</h4>
                <a
                  href="mailto:vkgroups127@gmail.com"
                  className="text-sm font-extrabold text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  vkgroups127@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Action Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">WhatsApp Support</h4>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">+91 9390223123</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleWhatsAppAction}
                className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
              >
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Contact / Feedback Form Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">Submit Feedback or Support Request</h3>

          {result && (
            <div
              className={`mb-5 flex items-start gap-3 rounded-xl p-4 text-xs font-semibold ${
                result.success
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400'
              }`}
            >
              {result.success ? (
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              )}
              <div>
                <p>{result.text}</p>
                {result.refId && <p className="mt-1 font-mono text-[11px] text-slate-500">Reference ID: {result.refId}</p>}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                  placeholder="Brief summary of your inquiry"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                placeholder="Describe your issue, feature request, or feedback in detail..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? 'Submitting Message...' : 'Submit Message'}</span>
            </button>
          </form>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="font-bold text-slate-900 dark:text-white">AETHER Operating System</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Help Center</span>
          </div>
          <div>Direct Support: vkgroups127@gmail.com</div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ContactPage;
