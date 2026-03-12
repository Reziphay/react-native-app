import { type Href, useRouter } from 'expo-router';
import { View } from 'react-native';

import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';

interface FlowPlaceholderProps {
  actionHref: Href;
  actionLabel: string;
  description: string;
  eyebrow: string;
  title: string;
}

export function FlowPlaceholder({
  actionHref,
  actionLabel,
  description,
  eyebrow,
  title,
}: FlowPlaceholderProps) {
  const router = useRouter();

  return (
    <Screen contentClassName="justify-center" scroll={false}>
      <SurfaceCard className="gap-5">
        <View className="gap-2">
          <AppText variant="eyebrow">{eyebrow}</AppText>
          <AppText variant="title">{title}</AppText>
          <AppText className="text-ink-soft">{description}</AppText>
        </View>
        <AppButton
          label={actionLabel}
          onPress={() => router.replace(actionHref)}
        />
      </SurfaceCard>
    </Screen>
  );
}
