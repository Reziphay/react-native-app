import { clearPersistedAuthSession } from '@/features/auth/lib/auth-session-storage';
import { useAuthFlowStore } from '@/features/auth/store/auth-flow-store';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { queryClient } from '@/providers/query-client';

export async function resetAuthSession(options?: {
  clearQueryCache?: boolean;
}) {
  useAuthStore.getState().clearSession();
  useAuthFlowStore.getState().clearOtpFlow();
  useAuthFlowStore.getState().setPendingEmail(null);
  await clearPersistedAuthSession();

  if (options?.clearQueryCache ?? true) {
    queryClient.clear();
  }
}
