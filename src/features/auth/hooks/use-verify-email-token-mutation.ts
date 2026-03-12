import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth-api';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { queryClient } from '@/providers/query-client';
import { qk } from '@/shared/api/query-keys';

export function useVerifyEmailTokenMutation() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: async () => {
      if (!useAuthStore.getState().isAuthenticated) {
        return;
      }

      const meResult = await authApi.getMe();

      queryClient.setQueryData(qk.auth.me, meResult.data);
      useAuthStore.getState().setUser(meResult.data);
    },
  });
}
