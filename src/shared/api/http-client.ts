import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { authApi } from '@/features/auth/api/auth-api';
import { resetAuthSession } from '@/features/auth/lib/auth-session-reset';
import { useAuthStore } from '@/features/auth/store/auth-store';
import {
  AppApiError,
  isUnauthorizedError,
  toAppApiError,
} from '@/shared/api/errors';
import { isApiFailurePayload, unwrapApiResponse } from '@/shared/api/response';
import { env } from '@/shared/config/env';
import type { ApiMeta, ApiResponse, ApiResult } from '@/shared/types/api';
import type { AuthTokensDto } from '@/shared/types/entities';

interface RequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

interface RetryableRequestConfig<
  D = unknown,
> extends InternalAxiosRequestConfig<D> {
  _retry?: boolean;
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

const baseHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const baseConfig = {
  baseURL: env.apiBaseUrl,
  headers: baseHeaders,
  timeout: 20_000,
} satisfies AxiosRequestConfig;

const refreshClient = axios.create(baseConfig);
const httpClient = axios.create(baseConfig);

let refreshPromise: Promise<AuthTokensDto> | null = null;

function setAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  accessToken: string,
) {
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

  headers.set('Authorization', `Bearer ${accessToken}`);
  config.headers = headers;

  return config;
}

async function refreshAccessToken() {
  const { refreshToken, updateTokens } = useAuthStore.getState();

  if (!refreshToken) {
    throw new AppApiError({
      code: 'UNAUTHORIZED',
      message: 'Refresh token missing',
      status: 401,
    });
  }

  if (!refreshPromise) {
    refreshPromise = authApi
      .refresh(
        {
          refreshToken,
        },
        refreshClient,
      )
      .then((result) => {
        updateTokens(result.tokens);

        return result.tokens;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function shouldAttemptRefresh(
  config?: RetryableRequestConfig,
  error?: unknown,
) {
  if (!config || config._retry || config.skipRefresh) {
    return false;
  }

  if (
    config.url?.includes('/auth/refresh') ||
    config.url?.includes('/auth/otp/request') ||
    config.url?.includes('/auth/otp/verify')
  ) {
    return false;
  }

  return isUnauthorizedError(error);
}

httpClient.interceptors.request.use((config) => {
  const requestConfig = config as RetryableRequestConfig;

  if (requestConfig.skipAuth) {
    return requestConfig;
  }

  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    return requestConfig;
  }

  return setAuthorizationHeader(requestConfig, accessToken);
});

httpClient.interceptors.response.use(
  (response) => {
    if (isApiFailurePayload(response.data)) {
      throw new AppApiError({
        code: response.data.error.code,
        details: response.data.error.details,
        message: response.data.error.message,
        status: response.status,
      });
    }

    return response;
  },
  async (error) => {
    const config = error.config as RetryableRequestConfig | undefined;

    if (shouldAttemptRefresh(config, error)) {
      try {
        const tokens = await refreshAccessToken();

        if (!config) {
          return Promise.reject(toAppApiError(error));
        }

        config._retry = true;
        setAuthorizationHeader(config, tokens.accessToken);

        return httpClient.request(config);
      } catch (refreshError) {
        await resetAuthSession();

        return Promise.reject(toAppApiError(refreshError));
      }
    }

    const normalizedError = toAppApiError(error);

    if (isUnauthorizedError(normalizedError)) {
      await resetAuthSession();
    }

    return Promise.reject(normalizedError);
  },
);

async function request<TData, TMeta = ApiMeta, D = unknown>(
  client: AxiosInstance,
  config: RequestConfig<D>,
): Promise<ApiResult<TData, TMeta>> {
  const response = await client.request<
    ApiResponse<TData, TMeta>,
    AxiosResponse<ApiResponse<TData, TMeta>, D>,
    D
  >(config);

  return unwrapApiResponse(response.data);
}

export const apiClient = {
  delete: <TData, TMeta = ApiMeta>(url: string, config?: RequestConfig) =>
    request<TData, TMeta>(httpClient, {
      ...config,
      method: 'DELETE',
      url,
    }),
  get: <TData, TMeta = ApiMeta>(url: string, config?: RequestConfig) =>
    request<TData, TMeta>(httpClient, {
      ...config,
      method: 'GET',
      url,
    }),
  patch: <TData, TMeta = ApiMeta, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>,
  ) =>
    request<TData, TMeta, D>(httpClient, {
      ...config,
      data,
      method: 'PATCH',
      url,
    }),
  post: <TData, TMeta = ApiMeta, D = unknown>(
    url: string,
    data?: D,
    config?: RequestConfig<D>,
  ) =>
    request<TData, TMeta, D>(httpClient, {
      ...config,
      data,
      method: 'POST',
      url,
    }),
};

export type { RequestConfig };
export { httpClient, refreshClient };
