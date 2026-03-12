import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AccountSummaryCard } from '@/features/auth/components/account-summary-card';
import { signOutFromSession } from '@/features/auth/lib/auth-session-manager';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { routes } from '@/shared/constants/routes';
import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';

export default function CustomerShellRoute() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <Screen contentClassName="gap-6" scroll>
      <SurfaceCard className="gap-4 bg-accent px-6 py-6">
        <View className="gap-2">
          <AppText className="text-surface/75" variant="eyebrow">
            Customer workspace
          </AppText>
          <AppText className="text-surface" variant="display">
            Your session is active.
          </AppText>
          <AppText className="text-surface/80">
            OTP sign-in and account hydration are live. Discovery and
            reservation flows will build on top of this shell next.
          </AppText>
        </View>
      </SurfaceCard>

      <AccountSummaryCard
        actions={
          <>
            <AppButton
              label={
                user.verification.emailVerified
                  ? 'Manage email verification'
                  : 'Verify email'
              }
              onPress={() => router.push(routes.authEmailVerify)}
            />
            <AppButton
              label="Sign out"
              loading={isSigningOut}
              onPress={async () => {
                setIsSigningOut(true);

                try {
                  await signOutFromSession();
                } finally {
                  setIsSigningOut(false);
                  router.replace(routes.publicWelcome);
                }
              }}
              tone="secondary"
            />
          </>
        }
        description="The customer shell is using the authenticated profile payload as its source of truth."
        user={user}
      />
    </Screen>
  );
}
