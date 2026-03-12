import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth-api';
import { getAuthDeviceInfo } from '@/features/auth/lib/auth-device';
import { useAuthFlowStore } from '@/features/auth/store/auth-flow-store';
import type { OtpFlowState } from '@/features/auth/store/auth-flow-store';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { queryClient } from '@/providers/query-client';
import { qk } from '@/shared/api/query-keys';

interface VerifyOtpInput {
  code: string;
  otpFlow: OtpFlowState;
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: ({ code, otpFlow }: VerifyOtpInput) =>
      authApi.verifyOtp({
        code,
        device: getAuthDeviceInfo(),
        otpRequestId: otpFlow.otpRequestId,
        phoneNumber: otpFlow.phoneNumber,
      }),
    onSuccess: ({ data }) => {
      queryClient.setQueryData(qk.auth.me, data.user);
      useAuthStore.getState().setSession({
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        user: data.user,
      });
      useAuthFlowStore.getState().clearOtpFlow();
    },
  });
}
