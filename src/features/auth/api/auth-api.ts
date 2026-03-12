import type { AxiosInstance, AxiosResponse } from 'axios';

import type {
  EmailVerifyRequestPayload,
  EmailVerifyRequestResult,
  EmailVerifyResult,
  LogoutPayload,
  LogoutResult,
  OtpRequestPayload,
  OtpRequestResult,
  OtpVerifyPayload,
  OtpVerifyResult,
  RefreshSessionPayload,
  RefreshSessionResult,
  SwitchRolePayload,
  SwitchRoleResult,
} from '@/features/auth/types/auth-types';
import { apiClient, type RequestConfig } from '@/shared/api/http-client';
import { unwrapApiResponse } from '@/shared/api/response';
import { apiRoutes } from '@/shared/api/routes';
import type { ApiResponse } from '@/shared/types/api';
import type { UserProfileDto } from '@/shared/types/entities';

async function requestWithClient<TData, TBody = unknown>(
  client: AxiosInstance | undefined,
  config: {
    data?: TBody;
    method: 'GET' | 'POST';
    params?: Record<string, string>;
    skipAuth?: boolean;
    skipRefresh?: boolean;
    url: string;
  },
) {
  if (!client) {
    if (config.method === 'GET') {
      const result = await apiClient.get<TData>(config.url, {
        params: config.params,
        skipAuth: config.skipAuth,
        skipRefresh: config.skipRefresh,
      });

      return result.data;
    }

    const result = await apiClient.post<TData, never, TBody>(
      config.url,
      config.data,
      {
        skipAuth: config.skipAuth,
        skipRefresh: config.skipRefresh,
      },
    );

    return result.data;
  }

  const response = await client.request<
    ApiResponse<TData>,
    AxiosResponse<ApiResponse<TData>, TBody>,
    TBody
  >({
    data: config.data,
    method: config.method,
    params: config.params,
    skipAuth: config.skipAuth,
    skipRefresh: config.skipRefresh,
    url: config.url,
  } as RequestConfig<TBody>);

  return unwrapApiResponse(response.data).data;
}

export const authApi = {
  getMe: () => apiClient.get<UserProfileDto>(apiRoutes.auth.me),
  logout: (payload: LogoutPayload) =>
    apiClient.post<LogoutResult, never, LogoutPayload>(
      apiRoutes.auth.logout,
      payload,
      {
        skipRefresh: true,
      },
    ),
  refresh: (payload: RefreshSessionPayload, client?: AxiosInstance) =>
    requestWithClient<RefreshSessionResult, RefreshSessionPayload>(client, {
      data: payload,
      method: 'POST',
      skipAuth: true,
      skipRefresh: true,
      url: apiRoutes.auth.refresh,
    }),
  requestEmailVerification: (payload: EmailVerifyRequestPayload) =>
    apiClient.post<EmailVerifyRequestResult, never, EmailVerifyRequestPayload>(
      apiRoutes.auth.emailVerifyRequest,
      payload,
    ),
  requestOtp: (payload: OtpRequestPayload) =>
    apiClient.post<OtpRequestResult, never, OtpRequestPayload>(
      apiRoutes.auth.otpRequest,
      payload,
      {
        skipAuth: true,
        skipRefresh: true,
      },
    ),
  switchRole: (payload: SwitchRolePayload) =>
    apiClient.post<SwitchRoleResult, never, SwitchRolePayload>(
      apiRoutes.auth.switchRole,
      payload,
    ),
  verifyEmail: (token: string) =>
    requestWithClient<EmailVerifyResult>(undefined, {
      method: 'GET',
      params: {
        token,
      },
      url: apiRoutes.auth.emailVerify,
    }),
  verifyOtp: (payload: OtpVerifyPayload) =>
    apiClient.post<OtpVerifyResult, never, OtpVerifyPayload>(
      apiRoutes.auth.otpVerify,
      payload,
      {
        skipAuth: true,
        skipRefresh: true,
      },
    ),
};
