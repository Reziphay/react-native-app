import { clearPersistedAuthSession } from '@/features/auth/lib/auth-session-storage';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { queryClient } from '@/providers/query-client';

export async function resetAuthSession(options?: {
  clearQueryCache?: boolean;
}) {
  useAuthStore.getState().clearSession();
  await clearPersistedAuthSession();

  if (options?.clearQueryCache ?? true) {
    queryClient.clear();
  }
}
