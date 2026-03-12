import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { type PropsWithChildren, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/providers/query-client';
import { themeTokens } from '@/shared/theme/tokens';
import { ModalHost } from '@/shared/ui/overlays/modal-host';
import { ToastViewport } from '@/shared/ui/overlays/toast-viewport';

function SystemChrome() {
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(themeTokens.colors.canvas);
  }, []);

  return <StatusBar style="dark" />;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SystemChrome />
          {children}
          <ToastViewport />
          <ModalHost />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
