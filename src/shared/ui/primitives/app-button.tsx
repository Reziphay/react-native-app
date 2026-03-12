import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
} from 'react-native';

import { cn } from '@/shared/lib/cn';
import { themeTokens } from '@/shared/theme/tokens';
import { AppText } from '@/shared/ui/primitives/app-text';

type ButtonTone = 'ghost' | 'primary' | 'secondary';

interface AppButtonProps extends Omit<PressableProps, 'children'> {
  className?: string;
  label: string;
  loading?: boolean;
  tone?: ButtonTone;
}

const containerToneMap: Record<ButtonTone, string> = {
  ghost: 'border border-surface bg-transparent',
  primary: 'bg-accent',
  secondary: 'border border-border bg-surface',
};

const textToneMap: Record<ButtonTone, string> = {
  ghost: 'text-surface',
  primary: 'text-surface',
  secondary: 'text-ink',
};

export function AppButton({
  className,
  disabled,
  label,
  loading = false,
  tone = 'primary',
  ...rest
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'min-h-14 items-center justify-center rounded-2xl px-5',
        containerToneMap[tone],
        isDisabled && 'opacity-60',
        className,
      )}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={themeTokens.colors.surface} />
      ) : (
        <AppText className={textToneMap[tone]} variant="label">
          {label}
        </AppText>
      )}
    </Pressable>
  );
}
