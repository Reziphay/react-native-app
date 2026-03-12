import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';

export default function ModalPreviewRoute() {
  const router = useRouter();

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', padding: 24 }}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={() => router.back()}
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(31, 26, 23, 0.42)',
        }}
      />
      <SurfaceCard className="gap-4">
        <AppText variant="eyebrow">Modal Host</AppText>
        <AppText variant="title">Global modal layer is connected</AppText>
        <AppText className="text-ink-soft">
          This route exists to validate modal presentation before sheets and
          confirmation flows are added.
        </AppText>
        <AppButton label="Close" onPress={() => router.back()} />
      </SurfaceCard>
    </View>
  );
}
