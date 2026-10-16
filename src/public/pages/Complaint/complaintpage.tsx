import React, { useState } from 'react';
import { PublicPageLayout } from '../../components/publicpagelayout';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, HelpCircle, FileText } from 'lucide-react';
import { useAuth } from '@/app/providers/authprovider';

export type ComplaintCategory =
  | 'Feature not working as described'
  | 'Misleading or inaccurate claim'
  | 'Privacy or data-handling concern'
  | 'Billing or subscription issue'
  | 'AI response or accuracy issue'
  | 'Accessibility issue'
  | 'Other concern';

const COMPLAINT_CATEGORIES: { value: ComplaintCategory; label: string; description: string }[] = [
  {
    value: 'Feature not working as described',
    label: 'Feature not working as described',
    description: 'An advertised workflow, button, or tool does not function as represented.',
  },
  {
    value: 'Misleading or inaccurate claim',
    label: 'Misleading or inaccurate claim',
    description: 'Marketing statement, performance metric, or feature promise appears untrue.',
  },
  {
    value: 'Privacy or data-handling concern',
    label: 'Privacy or data-handling concern',
    description: 'Questions or grievances regarding personal data, logs, or storage retention.',
  },
  {
    value: 'Billing or subscription issue',
    label: 'Billing or subscription issue',
    description: 'Questions about plan terms, beta access, or workspace entitlement fees.',
  },
  {
    value: 'AI response or accuracy issue',
    label: 'AI response or accuracy issue',
    description: 'Concerns regarding inaccurate model completions, hallucinations, or unsafe outputs.',
  },
  {
    value: 'Accessibility issue',
    label: 'Accessibility issue',
    description: 'Screen-reader, keyboard navigation, contrast, or motor-control barriers.',
  },
  {
    value: 'Other concern',
    label: 'Other concern',
    description: 'Any other platform issue, legal inquiry, or consumer rights representation.',
  },
];

interface ComplaintFormState {
  fullName: string;
  email: string;
  category: ComplaintCategory;
  affectedFeatureOrPage: string;
  inaccurateClaim: string;
  expectedOutcome: string;
  actualOutcome: string;
  description: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  affectedFeatureOrPage?: string;
  inaccurateClaim?: string;
  description?: string;
}

interface SubmissionResponse {
  referenceId: string;
  receivedAt: string;
  status: string;
  nextSteps: string;
  escalationInfo: string;
}

export const ComplaintPage: React.FC = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState<ComplaintFormState>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    category: 'Feature not working as described',
    affectedFeatureOrPage: '',
    inaccurateClaim: '',
    expectedOutcome: '',
    actualOutcome: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.affectedFeatureOrPage.trim()) {
      errs.affectedFeatureOrPage = 'Please identify the affected feature, tool, or page.';
    }

    if (formData.category === 'Misleading or inaccurate claim' && !formData.inaccurateClaim.trim()) {
      errs.inaccurateClaim = 'Please quote or describe the specific claim believed to be inaccurate.';
    }

    if (!formData.description.trim()) {
      errs.description = 'Please explain what happened in detail.';
    } else if (formData.description.trim().length < 15) {
      errs.description = 'Please provide at least 15 characters of detail.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (isSubmitting || submissionResult) return;
    if (!validate()) return;

    setIsSubmitting(true);

    const apiBase =
      (typeof import.meta !== 'undefined' &&
        (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL) ||
      '/api/v1';
    const complaintUrl = `${apiBase.replace(/\/+$/, '')}/complaint`;

    try {
      const response = await fetch(complaintUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          category: formData.category,
          affectedFeatureOrPage: formData.affectedFeatureOrPage.trim(),
          inaccurateClaim: formData.inaccurateClaim.trim() || undefined,
          expectedOutcome: formData.expectedOutcome.trim() || undefined,
          actualOutcome: formData.actualOutcome.trim() || undefined,
          description: formData.description.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success) {
        setSubmissionResult({
          referenceId: data?.data?.referenceId || `ATH-CMP-${Date.now().toString(36).toUpperCase()}`,
          receivedAt: data?.data?.receivedAt || new Date().toISOString(),
          status: data?.data?.status || 'RECEIVED',
          nextSteps:
            data?.data?.nextSteps ||
            'Your complaint has been formally logged in our review queue. Our engineering team will review the claim and inspect actual feature behavior.',
          escalationInfo:
            data?.data?.escalationInfo ||
            'If this concerns statutory rights or remains unresolved, contact vkgroups127@gmail.com with your Reference ID.',
        });
      } else {
        const errorMsg =
          data?.error?.message ||
          data?.message ||
          `Submission failed (HTTP ${response.status}). Please check your input and try again.`;
        setSubmitError(errorMsg);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error && err.message
          ? `Network error: ${err.message}. Please check your connection and retry.`
          : 'Unable to reach the submission server. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicPageLayout>
      <div className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        {/* Ambient background blur */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-rose-600/10 blur-3xl" />
          <div className="absolute right-10 top-1/3 h-[20rem] w-[20rem] rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-rose-300">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              Transparency & Resolution
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              User Complaint & Issue Resolution System
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              AETHER is committed to truthful claims, reliable software, and transparent communication.
              If a feature fails, an advertisement is misleading, or actual service does not match our
              representations, report it below for formal investigation.
            </p>
          </div>

          {/* Consumer Rights Commitment Notice */}
          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-xl sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
                <p className="font-semibold text-white">Our Truthful Representation Commitment</p>
                <p className="mt-1 text-zinc-400">
                  We investigate all submissions concerning feature capabilities, marketing statements,
                  data handling practices, or accessibility barriers. Users may seek lawful remedies
                  available under applicable consumer protection legislation. Submitting a complaint
                  does not waive any statutory rights.
                </p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="mt-10 rounded-3xl border border-zinc-800/80 bg-zinc-950/70 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
            {submissionResult ? (
              <div className="space-y-6 text-center" role="status" aria-live="polite">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">Complaint Formally Logged</h2>
                  <p className="mt-2 text-sm text-zinc-300">
                    Your report has been accepted into our authoritative resolution queue.
                  </p>
                </div>

                <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 text-left font-mono text-xs">
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500">Official Reference ID:</span>
                    <span className="font-bold text-cyan-400">{submissionResult.referenceId}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 py-2">
                    <span className="text-zinc-500">Status:</span>
                    <span className="font-semibold text-emerald-400">{submissionResult.status}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-zinc-500">Logged At:</span>
                    <span className="text-zinc-300">
                      {new Date(submissionResult.receivedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mx-auto max-w-lg rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-left text-xs leading-relaxed text-zinc-300">
                  <p className="font-semibold text-indigo-300">Next Steps & Investigation Procedure:</p>
                  <p className="mt-1 text-zinc-400">{submissionResult.nextSteps}</p>

                  <p className="mt-3 font-semibold text-indigo-300">Available Escalation & Consumer Rights:</p>
                  <p className="mt-1 text-zinc-400">{submissionResult.escalationInfo}</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionResult(null);
                      setFormData((prev) => ({
                        ...prev,
                        affectedFeatureOrPage: '',
                        inaccurateClaim: '',
                        expectedOutcome: '',
                        actualOutcome: '',
                        description: '',
                      }));
                    }}
                    className="rounded-xl bg-zinc-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
                  >
                    Submit Another Report
                  </button>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
                  >
                    Return to Homepage
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {submitError && (
                  <div
                    className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 sm:text-sm"
                    role="alert"
                  >
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
                    <div>
                      <p className="font-semibold text-red-200">Submission Unsuccessful</p>
                      <p className="mt-0.5">{submitError}</p>
                    </div>
                  </div>
                )}

                {/* Contact details */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                    >
                      Your Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Jordan Miller"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                      className={`mt-2 block w-full rounded-xl border bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.fullName ? 'border-red-500/50' : 'border-zinc-800'
                      }`}
                    />
                    {errors.fullName && (
                      <p id="fullName-error" className="mt-1 text-xs text-red-400">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                    >
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`mt-2 block w-full rounded-xl border bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.email ? 'border-red-500/50' : 'border-zinc-800'
                      }`}
                    />
                    <span className="mt-1 block text-[11px] text-zinc-500">
                      Required to receive your formal Reference ID and status updates.
                    </span>
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-xs text-red-400">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                  >
                    Issue Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-xl border border-zinc-800 bg-[#0B0D12] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {COMPLAINT_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-zinc-400">
                    {COMPLAINT_CATEGORIES.find((c) => c.value === formData.category)?.description}
                  </p>
                </div>

                {/* Affected Feature or Page */}
                <div>
                  <label
                    htmlFor="affectedFeatureOrPage"
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                  >
                    Affected Feature, Tool, or Page URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="affectedFeatureOrPage"
                    name="affectedFeatureOrPage"
                    value={formData.affectedFeatureOrPage}
                    onChange={handleChange}
                    placeholder="e.g. Smart Daily Planner, /features page, Knowledge Base Search"
                    aria-invalid={!!errors.affectedFeatureOrPage}
                    aria-describedby={
                      errors.affectedFeatureOrPage ? 'affectedFeature-error' : undefined
                    }
                    className={`mt-2 block w-full rounded-xl border bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.affectedFeatureOrPage ? 'border-red-500/50' : 'border-zinc-800'
                    }`}
                  />
                  {errors.affectedFeatureOrPage && (
                    <p id="affectedFeature-error" className="mt-1 text-xs text-red-400">
                      {errors.affectedFeatureOrPage}
                    </p>
                  )}
                </div>

                {/* Inaccurate Claim / Representation */}
                <div>
                  <label
                    htmlFor="inaccurateClaim"
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                  >
                    Specific Claim or Representation Believed Inaccurate{' '}
                    {formData.category === 'Misleading or inaccurate claim' ? (
                      <span className="text-red-400">*</span>
                    ) : (
                      <span className="text-zinc-500">(Optional)</span>
                    )}
                  </label>
                  <textarea
                    id="inaccurateClaim"
                    name="inaccurateClaim"
                    rows={2}
                    value={formData.inaccurateClaim}
                    onChange={handleChange}
                    placeholder="Quote or describe the claim (e.g. 'Site states 100% accuracy' or 'States integration X is available')"
                    aria-invalid={!!errors.inaccurateClaim}
                    aria-describedby={errors.inaccurateClaim ? 'inaccurateClaim-error' : undefined}
                    className={`mt-2 block w-full rounded-xl border bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.inaccurateClaim ? 'border-red-500/50' : 'border-zinc-800'
                    }`}
                  />
                  {errors.inaccurateClaim && (
                    <p id="inaccurateClaim-error" className="mt-1 text-xs text-red-400">
                      {errors.inaccurateClaim}
                    </p>
                  )}
                </div>

                {/* Expected vs Actual Outcome */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="expectedOutcome"
                      className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                    >
                      Expected Outcome <span className="text-zinc-500">(Optional)</span>
                    </label>
                    <textarea
                      id="expectedOutcome"
                      name="expectedOutcome"
                      rows={3}
                      value={formData.expectedOutcome}
                      onChange={handleChange}
                      placeholder="What did you expect to happen based on product documentation?"
                      className="mt-2 block w-full rounded-xl border border-zinc-800 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="actualOutcome"
                      className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                    >
                      Actual Outcome <span className="text-zinc-500">(Optional)</span>
                    </label>
                    <textarea
                      id="actualOutcome"
                      name="actualOutcome"
                      rows={3}
                      value={formData.actualOutcome}
                      onChange={handleChange}
                      placeholder="What actually occurred when you used the feature?"
                      className="mt-2 block w-full rounded-xl border border-zinc-800 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Detailed Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                  >
                    Explanation & Steps to Reproduce <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide relevant details, steps taken, error messages, or context to help our engineering team verify the issue..."
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? 'description-error' : undefined}
                    className={`mt-2 block w-full rounded-xl border bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.description ? 'border-red-500/50' : 'border-zinc-800'
                    }`}
                  />
                  {errors.description && (
                    <p id="description-error" className="mt-1 text-xs text-red-400">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Privacy & Discretion Notice */}
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-xs text-zinc-400">
                  <span className="font-semibold text-zinc-300">Privacy Safeguard: </span>
                  Information submitted through this form is encrypted in transit and stored
                  confidentially in our operational feedback queue. It is reviewed exclusively by
                  authorized engineers and support staff to resolve issues and improve platform transparency.
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-indigo-600 to-indigo-700 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Logging Formal Complaint...
                      </>
                    ) : (
                      'Submit Formal Complaint'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Links */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
            <Link to="/contact" className="hover:text-white">
              General Contact & Questions →
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms of Service →
            </Link>
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy Policy →
            </Link>
            <Link to="/help" className="hover:text-white">
              Help Center & FAQs →
            </Link>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
};

export default ComplaintPage;
