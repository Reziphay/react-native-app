import { ActivityIndicator, View } from 'react-native';

import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';

interface FullScreenLoaderProps {
  description?: string;
  title?: string;
}

export function FullScreenLoader({
  description,
  title = 'Loading',
}: FullScreenLoaderProps) {
  return (
    <Screen contentClassName="justify-center items-center" scroll={false}>
      <View className="w-full max-w-[320px] items-center gap-4">
        <ActivityIndicator size="large" />
        <View className="items-center gap-1">
          <AppText variant="title">{title}</AppText>
          {description ? (
            <AppText className="text-center text-ink-soft">
              {description}
            </AppText>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}
