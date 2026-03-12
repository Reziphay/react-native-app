import { type PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/shared/lib/cn';
import { themeTokens } from '@/shared/theme/tokens';

interface ScreenProps extends PropsWithChildren {
  className?: string;
  contentClassName?: string;
  scroll?: boolean;
}

export function Screen({
  children,
  className,
  contentClassName,
  scroll = true,
}: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{ backgroundColor: themeTokens.colors.canvas, flex: 1 }}
      >
        <ScrollView
          className={cn('flex-1', className)}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <View className={cn('flex-1 px-5 pb-8 pt-6', contentClassName)}>
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: themeTokens.colors.canvas, flex: 1 }}
    >
      <View
        className={cn('flex-1 px-5 pb-8 pt-6', className, contentClassName)}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
