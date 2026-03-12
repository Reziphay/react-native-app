import { isAxiosError } from 'axios';

import type {
  ApiErrorDetails,
  ApiErrorPayload,
  ApiFailureResponse,
} from '@/shared/types/api';

const defaultErrorMessage = 'An unexpected error occurred. Please try again.';

export const apiErrorCodes = {
  accountClosed: 'ACCOUNT_CLOSED',
  accountSuspended: 'ACCOUNT_SUSPENDED',
  emailVerifyTokenExpired: 'EMAIL_VERIFY_TOKEN_EXPIRED',
  noShowNotAllowedYet: 'NO_SHOW_NOT_ALLOWED_YET',
  otpExpired: 'OTP_EXPIRED',
  otpInvalid: 'OTP_INVALID',
  reservationAlreadyExpired: 'RESERVATION_ALREADY_EXPIRED',
  reservationNotAllowed: 'RESERVATION_NOT_ALLOWED',
  reviewAlreadyExistsForReservation: 'REVIEW_ALREADY_EXISTS_FOR_RESERVATION',
  reviewNotAllowed: 'REVIEW_NOT_ALLOWED',
  roleNotAvailable: 'ROLE_NOT_AVAILABLE',
  serviceHasActiveReservations: 'SERVICE_HAS_ACTIVE_RESERVATIONS',
  tooManyRequests: 'TOO_MANY_REQUESTS',
  unauthorized: 'UNAUTHORIZED',
  validationError: 'VALIDATION_ERROR',
} as const;

export type ApiErrorCode =
  | (typeof apiErrorCodes)[keyof typeof apiErrorCodes]
  | string;

const apiErrorMessages: Partial<Record<ApiErrorCode, string>> = {
  ACCOUNT_CLOSED: 'This account is closed, so the action cannot continue.',
  ACCOUNT_SUSPENDED: 'This account is temporarily suspended.',
  EMAIL_VERIFY_TOKEN_EXPIRED: 'The email verification link has expired.',
  NO_SHOW_NOT_ALLOWED_YET: 'This action is not available yet.',
  OTP_EXPIRED: 'The code has expired. You can request a new one.',
  OTP_INVALID: 'The code you entered is invalid.',
  RESERVATION_ALREADY_EXPIRED:
    'The reservation timing is no longer current. Please refresh and check again.',
  RESERVATION_NOT_ALLOWED:
    'A reservation cannot be created for this service right now.',
  REVIEW_ALREADY_EXISTS_FOR_RESERVATION:
    'A review already exists for this reservation.',
  REVIEW_NOT_ALLOWED:
    'A reservation must be completed before a review can be submitted.',
  ROLE_NOT_AVAILABLE: 'This role is not currently available for switching.',
  SERVICE_HAS_ACTIVE_RESERVATIONS:
    'This action cannot be completed while active reservations exist.',
  TOO_MANY_REQUESTS: 'Too many requests were sent. Please wait and try again.',
  UNAUTHORIZED: 'Your session has ended. Please sign in again.',
  VALIDATION_ERROR: 'Some fields need to be corrected before continuing.',
};

const inlineErrorCodes = new Set<ApiErrorCode>([
  apiErrorCodes.emailVerifyTokenExpired,
  apiErrorCodes.otpExpired,
  apiErrorCodes.otpInvalid,
  apiErrorCodes.validationError,
]);

export class AppApiError<
  TDetails extends ApiErrorDetails = ApiErrorDetails,
> extends Error {
  code: ApiErrorCode;
  details?: TDetails;
  isNetworkError: boolean;
  status?: number;

  constructor({
    code,
    details,
    isNetworkError = false,
    message,
    status,
  }: {
    code: ApiErrorCode;
    details?: TDetails;
    isNetworkError?: boolean;
    message: string;
    status?: number;
  }) {
    super(message);
    this.name = 'AppApiError';
    this.code = code;
    this.details = details;
    this.isNetworkError = isNetworkError;
    this.status = status;
  }
}

export function createApiErrorFromPayload<
  TDetails extends ApiErrorDetails = ApiErrorDetails,
>(payload: ApiErrorPayload<TDetails>, status?: number) {
  return new AppApiError<TDetails>({
    code: payload.code,
    details: payload.details,
    message: payload.message,
    status,
  });
}

function isApiFailureResponse(
  value: unknown,
): value is ApiFailureResponse<ApiErrorDetails> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    value.success === false &&
    'error' in value
  );
}

export function toAppApiError(error: unknown) {
  if (error instanceof AppApiError) {
    return error;
  }

  if (isAxiosError(error)) {
    if (isApiFailureResponse(error.response?.data)) {
      return createApiErrorFromPayload(
        error.response.data.error,
        error.response?.status,
      );
    }

    if (error.response) {
      return new AppApiError({
        code: String(error.response.status),
        message: error.message || defaultErrorMessage,
        status: error.response.status,
      });
    }

    return new AppApiError({
      code: 'NETWORK_ERROR',
      isNetworkError: true,
      message:
        'A network connection could not be established. Check your internet connection.',
    });
  }

  if (error instanceof Error) {
    return new AppApiError({
      code: 'UNKNOWN_ERROR',
      message: error.message || defaultErrorMessage,
    });
  }

  return new AppApiError({
    code: 'UNKNOWN_ERROR',
    message: defaultErrorMessage,
  });
}

export function mapApiErrorToMessage(error: unknown) {
  const normalized = toAppApiError(error);

  return apiErrorMessages[normalized.code] ?? normalized.message;
}

export function getApiFieldErrors(error: unknown) {
  const normalized = toAppApiError(error);

  return normalized.details?.fieldErrors ?? {};
}

export function shouldPresentErrorAsToast(error: unknown) {
  const normalized = toAppApiError(error);

  return !inlineErrorCodes.has(normalized.code);
}

export function isUnauthorizedError(error: unknown) {
  const normalized = toAppApiError(error);

  return (
    normalized.code === apiErrorCodes.unauthorized || normalized.status === 401
  );
}
