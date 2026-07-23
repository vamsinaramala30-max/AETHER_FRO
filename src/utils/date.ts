/**
 * Formats ISO date string or Date object to human-readable date representation.
 */
export const formatDate = (date: Date | string | number, locale = 'en-US'): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};

/**
 * Returns relative time string (e.g., '2 hours ago', 'in 3 days').
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((d.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const cutoffs = [
    { amount: 60, unit: 'second' },
    { amount: 60, unit: 'minute' },
    { amount: 24, unit: 'hour' },
    { amount: 7, unit: 'day' },
    { amount: 4.35, unit: 'week' },
    { amount: 12, unit: 'month' },
    { amount: Number.POSITIVE_INFINITY, unit: 'year' },
  ] as const;

  let duration = Math.abs(diffInSeconds);
  for (let i = 0; i < cutoffs.length; i++) {
    const cutoff = cutoffs[i];
    if (duration < cutoff.amount) {
      const unit = cutoff.unit as Intl.RelativeTimeFormatUnit;
      return rtf.format(Math.round(diffInSeconds > 0 ? duration : -duration), unit);
    }
    duration /= cutoff.amount;
  }
  return formatDate(d);
};