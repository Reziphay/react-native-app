import { useMutation } from '@tanstack/react-query';
import * as Linking from 'expo-linking';

import { authApi } from '@/features/auth/api/auth-api';
import { useAuthFlowStore } from '@/features/auth/store/auth-flow-store';
import { routes } from '@/shared/constants/routes';

interface RequestEmailVerificationInput {
  email: string;
}

export function useRequestEmailVerificationMutation() {
  return useMutation({
    mutationFn: ({ email }: RequestEmailVerificationInput) =>
      authApi.requestEmailVerification({
        email: email.trim(),
        redirectUri: Linking.createURL(routes.authEmailVerify),
      }),
    onSuccess: ({ data }) => {
      useAuthFlowStore.getState().setPendingEmail(data.email);
    },
  });
}
