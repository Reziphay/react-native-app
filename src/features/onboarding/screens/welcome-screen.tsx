import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { env } from '@/shared/config/env';
import { routes } from '@/shared/constants/routes';
import { UserRole } from '@/shared/enums/domain';
import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';

const onboardingPromises = [
  'Use one account for both customer and service owner roles.',
  'Sign in with a phone number and keep the session restored across launches.',
  'Verify email with a magic link without breaking the active session.',
];

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen contentClassName="gap-6" scroll>
      <SurfaceCard className="gap-5 bg-accent px-6 py-6">
        <View className="gap-2">
          <AppText className="text-surface/75" variant="eyebrow">
            Reziphay
          </AppText>
          <AppText className="text-surface" variant="display">
            Flexible reservations for customers and service owners.
          </AppText>
          <AppText className="text-surface/80" variant="body">
            Start with the role you need right now. You can stay inside the same
            account and switch context later.
          </AppText>
        </View>
      </SurfaceCard>

      <SurfaceCard className="gap-4">
        <AppText variant="title">What is ready in this build?</AppText>
        <View className="gap-3">
          {onboardingPromises.map((pillar) => (
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

      <SurfaceCard className="gap-3">
        <AppText variant="title">Choose how you want to continue</AppText>
        <AppButton
          label="Continue as customer"
          onPress={() =>
            router.push({
              params: {
                roleHint: UserRole.CUSTOMER,
              },
              pathname: routes.authPhone,
            })
          }
        />
        <AppButton
          label="Continue as service owner"
          onPress={() =>
            router.push({
              params: {
                roleHint: UserRole.SERVICE_OWNER,
              },
              pathname: routes.authPhone,
            })
          }
          tone="secondary"
        />
        <AppButton
          label="Already have a code?"
          onPress={() => router.push(routes.authPhone)}
          tone="secondary"
        />
      </SurfaceCard>

      <SurfaceCard className="gap-2 bg-surface-muted">
        <AppText variant="label">Environment snapshot</AppText>
        <AppText className="text-ink-soft">API: {env.apiBaseUrl}</AppText>
        <AppText className="text-ink-soft">Profile: {env.appEnv}</AppText>
        <AppText className="text-ink-soft">
          Mock mode: {env.enableMocks ? 'active' : 'inactive'}
        </AppText>
      </SurfaceCard>
    </Screen>
  );
}
