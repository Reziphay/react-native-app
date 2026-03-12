import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth-api';
import { normalizePhoneNumber } from '@/features/auth/lib/phone';
import { useAuthFlowStore } from '@/features/auth/store/auth-flow-store';
import type { OtpRequestPayload } from '@/features/auth/types/auth-types';

export function useRequestOtpMutation() {
  return useMutation({
    mutationFn: async (payload: OtpRequestPayload) => {
      const phoneNumber = normalizePhoneNumber(payload.phoneNumber);
      const result = await authApi.requestOtp({
        phoneNumber,
        roleHint: payload.roleHint,
      });

      return {
        phoneNumber,
        result: result.data,
        roleHint: payload.roleHint,
      };
    },
    onSuccess: ({ phoneNumber, result, roleHint }) => {
      useAuthFlowStore.getState().setOtpFlow({
        expiresAt: result.expiresAt,
        otpRequestId: result.otpRequestId,
        phoneNumber,
        resendAvailableAt: result.resendAvailableAt,
        roleHint,
      });
    },
  });
}
