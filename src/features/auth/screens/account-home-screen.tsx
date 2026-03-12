import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { AccountSummaryCard } from '@/features/auth/components/account-summary-card';
import { RoleSwitcherCard } from '@/features/auth/components/role-switcher-card';
import { signOutFromSession } from '@/features/auth/lib/auth-session-manager';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { routes } from '@/shared/constants/routes';
import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';
import { ShellNav } from '@/shared/ui/composite/shell-nav';

interface AccountHomeScreenProps {
  activeNavKey: string;
  description: string;
  eyebrow: string;
  navItems: readonly {
    href: Href;
    key: string;
    label: string;
  }[];
  title: string;
}

export function AccountHomeScreen({
  activeNavKey,
  description,
  eyebrow,
  navItems,
  title,
}: AccountHomeScreenProps) {
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
            {eyebrow}
          </AppText>
          <AppText className="text-surface" variant="display">
            {title}
          </AppText>
          <AppText className="text-surface/80">{description}</AppText>
        </View>
      </SurfaceCard>

      <RoleSwitcherCard user={user} />

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
        description="This account area is shared across role shells and stays in sync with the authenticated profile."
        user={user}
      />

      <ShellNav activeKey={activeNavKey} items={navItems} />
    </Screen>
  );
}
