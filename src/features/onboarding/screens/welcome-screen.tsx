import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { env } from '@/shared/config/env';
import { routes } from '@/shared/constants/routes';
import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';

const shellLinks = [
  {
    description: 'OTP, email verification, and session restore will be built here.',
    href: routes.authHome,
    label: 'Auth Shell',
    tone: 'primary' as const,
  },
  {
    description: 'Route group reserved for discovery, reservation, and review screens.',
    href: routes.customerHome,
    label: 'Customer Shell',
    tone: 'secondary' as const,
  },
  {
    description: 'Brand, service, and provider operations will be built in this shell.',
    href: routes.providerHome,
    label: 'Provider Shell',
    tone: 'secondary' as const,
  },
];

const foundationPillars = [
  'Expo Router based route groups',
  'QueryClient, SafeArea, and GestureHandler provider chain',
  'Zustand powered global toast and modal host store',
  'NativeWind theme tokens and environment helpers',
];

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen contentClassName="gap-6" scroll>
      <SurfaceCard className="gap-5 bg-accent px-6 py-6">
        <View className="gap-2">
          <AppText className="text-surface/75" variant="eyebrow">
            Reziphay / Step 1
          </AppText>
          <AppText className="text-surface" variant="display">
            The mobile foundation is now in place.
          </AppText>
          <AppText className="text-surface/80" variant="body">
            Router structure, provider wiring, and initial design tokens are set
            up for the dual-role reservation experience.
          </AppText>
        </View>

        <AppButton
          label="Open modal preview"
          onPress={() => router.push(routes.modalPreview)}
          tone="ghost"
        />
      </SurfaceCard>

      <SurfaceCard className="gap-4">
        <AppText variant="title">What does this foundation include?</AppText>
        <View className="gap-3">
          {foundationPillars.map((pillar) => (
            <View
              className="flex-row items-start gap-3 rounded-2xl bg-canvas px-4 py-3"
              key={pillar}
            >
              <View className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
              <AppText className="flex-1 text-ink-soft">{pillar}</AppText>
            </View>
          ))}
        </View>
      </SurfaceCard>

      <View className="gap-3">
        {shellLinks.map((item) => (
          <SurfaceCard className="gap-4" key={item.label}>
            <View className="gap-2">
              <AppText variant="label">{item.label}</AppText>
              <AppText className="text-ink-soft">{item.description}</AppText>
            </View>
            <AppButton
              label={`${item.label} preview`}
              onPress={() => router.push(item.href)}
              tone={item.tone}
            />
          </SurfaceCard>
        ))}
      </View>

      <SurfaceCard className="gap-2 bg-surface-muted">
        <AppText variant="label">Environment</AppText>
        <AppText className="text-ink-soft">API: {env.apiBaseUrl}</AppText>
        <AppText className="text-ink-soft">Profile: {env.appEnv}</AppText>
        <AppText className="text-ink-soft">
          Mock mode: {env.enableMocks ? 'active' : 'inactive'}
        </AppText>
      </SurfaceCard>
    </Screen>
  );
}
