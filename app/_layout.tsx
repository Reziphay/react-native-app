import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';

import { useAuthBootstrap } from '@/features/auth/hooks/use-auth-bootstrap';
import { BootstrapRecoveryScreen } from '@/features/auth/screens/bootstrap-recovery-screen';
import { AppProviders } from '@/providers/app-providers';
import { themeTokens } from '@/shared/theme/tokens';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { bootstrapped, bootstrapError, retryBootstrap } = useAuthBootstrap();

  return (
    <AppProviders>
      {!bootstrapped ? null : bootstrapError ? (
        <BootstrapRecoveryScreen
          message={bootstrapError}
          onRetry={retryBootstrap}
        />
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: themeTokens.colors.canvas },
          }}
        >
          <Stack.Screen name="(public)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(customer)" />
          <Stack.Screen name="(provider)" />
          <Stack.Screen name="modal" />
        </Stack>
      )}
    </AppProviders>
  );
}
