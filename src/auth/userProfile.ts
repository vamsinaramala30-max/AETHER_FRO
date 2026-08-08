export interface NormalizedUserProfile {
  id: string;
  email: string;
  name: string;
  fullName: string;
  firstName: string;
  lastName: string;
  displayName: string;
  initials: string;
  avatarUrl?: string | null;
  bio?: string | null;
  company?: string | null;
  role?: string;
  timezone?: string | null;
  language?: string | null;
  isEmailVerified?: boolean;
  [key: string]: unknown;
}

function normalizeDisplayName(
  input: Partial<NormalizedUserProfile> | Record<string, unknown>,
): string {
  const fullName =
    typeof input.fullName === 'string' && input.fullName.trim() !== ''
      ? input.fullName.trim()
      : typeof input.name === 'string' && input.name.trim() !== ''
        ? input.name.trim()
        : '';

  if (fullName) {
    return fullName;
  }

  const firstName = typeof input.firstName === 'string' ? input.firstName.trim() : '';
  const lastName = typeof input.lastName === 'string' ? input.lastName.trim() : '';
  const combined = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (combined) {
    return combined;
  }

  const email = typeof input.email === 'string' ? input.email.trim() : '';
  return email ? email.split('@')[0] : 'User';
}

function normalizeEmail(input: Partial<NormalizedUserProfile> | Record<string, unknown>): string {
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  return email;
}

function normalizeInitials(
  input: Partial<NormalizedUserProfile> | Record<string, unknown>,
): string {
  const fullName = normalizeDisplayName(input);
  if (fullName && fullName !== 'User') {
    const words = fullName.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      return words[0][0]?.toUpperCase() || 'U';
    }
    return `${words[0][0] || ''}${words[words.length - 1][0] || ''}`.toUpperCase();
  }

  const email = normalizeEmail(input);
  return email ? email[0].toUpperCase() : 'U';
}

export function normalizeUserProfile<T extends Record<string, unknown> = Record<string, unknown>>(
  input: Partial<NormalizedUserProfile> | T | null | undefined,
): NormalizedUserProfile {
  const source = (input ?? {}) as Record<string, unknown>;
  const fullName =
    typeof source.fullName === 'string' && source.fullName.trim() !== ''
      ? source.fullName.trim()
      : typeof source.name === 'string' && source.name.trim() !== ''
        ? source.name.trim()
        : [source.firstName, source.lastName]
            .filter((value): value is string => typeof value === 'string' && value.trim() !== '')
            .join(' ')
            .trim();

  const fullNameParts = (fullName || '').split(/\s+/).filter(Boolean);
  const firstName =
    typeof source.firstName === 'string' && source.firstName.trim() !== ''
      ? source.firstName.trim()
      : fullNameParts[0] || '';
  const lastName =
    typeof source.lastName === 'string' && source.lastName.trim() !== ''
      ? source.lastName.trim()
      : fullNameParts.slice(1).join(' ') || '';
  const displayName = normalizeDisplayName({
    ...source,
    firstName,
    lastName,
    fullName,
    name: fullName,
  });
  const email = normalizeEmail(source);

  return {
    id: typeof source.id === 'string' && source.id.trim() !== '' ? source.id : 'user-unknown',
    email,
    name: fullName || displayName,
    fullName: fullName || displayName,
    firstName,
    lastName,
    displayName,
    initials: normalizeInitials({ ...source, firstName, lastName, fullName, name: fullName }),
    avatarUrl: typeof source.avatarUrl === 'string' ? source.avatarUrl : undefined,
    bio: typeof source.bio === 'string' ? source.bio : undefined,
    company: typeof source.company === 'string' ? source.company : undefined,
    role: typeof source.role === 'string' ? source.role : undefined,
    timezone: typeof source.timezone === 'string' ? source.timezone : undefined,
    language: typeof source.language === 'string' ? source.language : undefined,
    isEmailVerified:
      typeof source.isEmailVerified === 'boolean' ? source.isEmailVerified : undefined,
  };
}
