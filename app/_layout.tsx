import { Stack } from 'expo-router';

import { AppProviders } from '@/providers/app-providers';
import { themeTokens } from '@/shared/theme/tokens';

export default function RootLayout() {
  return (
    <AppProviders>
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
    </AppProviders>
  );
}
