import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { cn } from '@/shared/lib/cn';
import { AppText } from '@/shared/ui/primitives/app-text';

interface ShellNavItem {
  href: Href;
  key: string;
  label: string;
}

interface ShellNavProps {
  activeKey: string;
  items: readonly ShellNavItem[];
}

export function ShellNav({ activeKey, items }: ShellNavProps) {
  const router = useRouter();

  return (
    <View className="flex-row gap-3 rounded-[28px] border border-border bg-surface px-3 py-3">
      {items.map((item) => {
        const isActive = item.key === activeKey;

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            className={cn(
              'min-h-14 flex-1 justify-center rounded-2xl px-3',
              isActive ? 'bg-accent' : 'bg-canvas',
            )}
            key={item.key}
            onPress={() => router.replace(item.href)}
          >
            <AppText
              className={cn(
                'text-center',
                isActive ? 'text-surface' : 'text-ink-soft',
              )}
              variant="label"
            >
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
