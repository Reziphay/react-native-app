import { authApi } from '@/features/auth/api/auth-api';
import { resetAuthSession } from '@/features/auth/lib/auth-session-reset';
import { loadPersistedAuthSession } from '@/features/auth/lib/auth-session-storage';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { queryClient } from '@/providers/query-client';
import { isUnauthorizedError, mapApiErrorToMessage } from '@/shared/api/errors';
import { qk } from '@/shared/api/query-keys';

export async function signOutFromSession() {
  const refreshToken = useAuthStore.getState().refreshToken;

  try {
    if (refreshToken) {
      await authApi.logout({ refreshToken });
    }
  } catch {
    // The local reset is the authoritative fallback for logout.
  } finally {
    await resetAuthSession();
  }
}

export async function bootstrapAuthSession() {
  const authStore = useAuthStore.getState();

  authStore.setBootstrapped(false);

  const persistedSession = await loadPersistedAuthSession();

  if (!persistedSession) {
    await resetAuthSession({ clearQueryCache: false });
    return;
  }

  authStore.hydrateSession(persistedSession);

  try {
    const meResult = await authApi.getMe();

    queryClient.setQueryData(qk.auth.me, meResult.data);
    useAuthStore.getState().setUser(meResult.data);
    useAuthStore.getState().markBootstrapped();
  } catch (error) {
    if (isUnauthorizedError(error)) {
      await resetAuthSession();
      return;
    }

    useAuthStore.getState().setBootstrapError(mapApiErrorToMessage(error));
  }
}
