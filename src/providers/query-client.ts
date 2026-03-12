import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import {
  mapApiErrorToMessage,
  shouldPresentErrorAsToast,
} from '@/shared/api/errors';
import { useUiStore } from '@/shared/store/ui-store';

function handleQueryLayerError(error: unknown) {
  if (!shouldPresentErrorAsToast(error)) {
    return;
  }

  useUiStore.getState().showToast({
    title: mapApiErrorToMessage(error),
    tone: 'error',
  });
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: handleQueryLayerError,
  }),
  queryCache: new QueryCache({
    onError: handleQueryLayerError,
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
