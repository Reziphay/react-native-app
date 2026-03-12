import { View } from 'react-native';

import { signOutFromSession } from '@/features/auth/lib/auth-session-manager';
import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';

interface BootstrapRecoveryScreenProps {
  message: string;
  onRetry: () => void | Promise<void>;
}

export function BootstrapRecoveryScreen({
  message,
  onRetry,
}: BootstrapRecoveryScreenProps) {
  return (
    <Screen contentClassName="justify-center" scroll={false}>
      <SurfaceCard className="gap-5">
        <View className="gap-2">
          <AppText variant="eyebrow">Session Restore</AppText>
          <AppText variant="title">
            We could not restore the current session
          </AppText>
          <AppText className="text-ink-soft">{message}</AppText>
        </View>
        <View className="gap-3">
          <AppButton label="Try again" onPress={() => void onRetry()} />
          <AppButton
            label="Sign out"
            onPress={() => void signOutFromSession()}
            tone="secondary"
          />
        </View>
      </SurfaceCard>
    </Screen>
  );
}
