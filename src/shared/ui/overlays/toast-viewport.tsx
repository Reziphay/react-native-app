import { View } from 'react-native';

import { useUiStore } from '@/shared/store/ui-store';
import { cn } from '@/shared/lib/cn';
import { AppText } from '@/shared/ui/primitives/app-text';

const toneMap = {
  error: 'border-danger bg-surface',
  neutral: 'border-border bg-surface',
  success: 'border-success bg-surface',
} as const;

export function ToastViewport() {
  const toasts = useUiStore((state) => state.toasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={{
        bottom: 24,
        left: 16,
        position: 'absolute',
        right: 16,
        zIndex: 60,
      }}
    >
      <View className="gap-3">
        {toasts.map((toast) => (
          <View
            className={cn(
              'rounded-2xl border px-4 py-3 shadow-sm',
              toneMap[toast.tone],
            )}
            key={toast.id}
          >
            <AppText variant="label">{toast.title}</AppText>
            {toast.description ? (
              <AppText className="mt-1 text-ink-soft">
                {toast.description}
              </AppText>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
