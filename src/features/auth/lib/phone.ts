const phoneCharacterPattern = /[^\d+]/g;
const nonDigitPattern = /\D/g;

export function normalizePhoneNumber(input: string) {
  const cleaned = input.trim().replace(phoneCharacterPattern, '');
  const normalizedPlus = cleaned.startsWith('+')
    ? `+${cleaned.slice(1).replace(nonDigitPattern, '')}`
    : cleaned.replace(nonDigitPattern, '');

  if (!normalizedPlus.startsWith('+') && normalizedPlus.length > 0) {
    return `+${normalizedPlus}`;
  }

  return normalizedPlus;
}

export function formatPhoneNumberPreview(input: string) {
  const normalized = normalizePhoneNumber(input);

  if (!normalized) {
    return '';
  }

  const prefix = normalized.startsWith('+') ? '+' : '';
  const digits = normalized.replace(nonDigitPattern, '');

  if (digits.length <= 3) {
    return `${prefix}${digits}`;
  }

  if (digits.length <= 6) {
    return `${prefix}${digits.slice(0, 3)} ${digits.slice(3)}`;
  }

  if (digits.length <= 9) {
    return `${prefix}${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return `${prefix}${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9, 13)}`.trim();
}

export function isValidPhoneNumber(input: string) {
  const normalized = normalizePhoneNumber(input);
  const digits = normalized.replace(nonDigitPattern, '');

  return digits.length >= 8 && digits.length <= 15;
}
