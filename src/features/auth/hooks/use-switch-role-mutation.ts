import { useMutation } from '@tanstack/react-query';

import { authApi } from '@/features/auth/api/auth-api';
import { invalidateRoleQueries } from '@/features/auth/lib/invalidate-role-queries';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { queryClient } from '@/providers/query-client';
import { qk } from '@/shared/api/query-keys';
import { UserRole } from '@/shared/enums/domain';

export function useSwitchRoleMutation() {
  return useMutation({
    mutationFn: (role: UserRole) => authApi.switchRole({ role }),
    onSuccess: async ({ data }) => {
      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        const nextUser = {
          ...currentUser,
          activeRole: data.activeRole,
          roles: data.roles,
        };

        useAuthStore.getState().setUser(nextUser);
        queryClient.setQueryData(qk.auth.me, nextUser);
      } else {
        useAuthStore.getState().switchRoleLocal(data.activeRole);
      }

      await invalidateRoleQueries();
    },
  });
}
