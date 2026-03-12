import {
  createApiErrorFromPayload,
  type AppApiError,
} from '@/shared/api/errors';
import type {
  ApiFailureResponse,
  ApiMeta,
  ApiResponse,
  ApiResult,
  ApiSuccessResponse,
} from '@/shared/types/api';

function isApiSuccessResponse<TData, TMeta>(
  payload: ApiResponse<TData, TMeta>,
): payload is ApiSuccessResponse<TData, TMeta> {
  return payload.success === true;
}

export function isApiFailurePayload(
  payload: unknown,
): payload is ApiFailureResponse {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'success' in payload &&
    payload.success === false &&
    'error' in payload
  );
}

export function unwrapApiResponse<TData, TMeta = ApiMeta>(
  payload: ApiResponse<TData, TMeta>,
): ApiResult<TData, TMeta> {
  if (isApiSuccessResponse(payload)) {
    return {
      data: payload.data,
      meta: payload.meta,
    };
  }

  throw createApiErrorFromPayload(payload.error);
}

export function extractApiData<TData, TMeta = ApiMeta>(
  payload: ApiResponse<TData, TMeta>,
) {
  return unwrapApiResponse(payload).data;
}

export type { AppApiError };
