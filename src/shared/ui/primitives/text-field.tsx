import {
  TextInput,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
  type TextInputProps,
} from 'react-native';

import { cn } from '@/shared/lib/cn';
import { themeTokens } from '@/shared/theme/tokens';
import { AppText } from '@/shared/ui/primitives/app-text';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  errorMessage?: string;
  helperText?: string;
  inputClassName?: string;
  keyboardType?: KeyboardTypeOptions;
  label: string;
  returnKeyType?: ReturnKeyTypeOptions;
}

export function TextField({
  autoCapitalize = 'none',
  autoCorrect = false,
  className,
  errorMessage,
  helperText,
  inputClassName,
  keyboardType,
  label,
  placeholderTextColor = themeTokens.colors.inkSoft,
  returnKeyType,
  ...rest
}: TextFieldProps) {
  return (
    <View className={cn('gap-2', className)}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        className={cn(
          'min-h-14 rounded-2xl border border-border bg-surface px-4 py-3 text-base text-ink',
          errorMessage && 'border-danger',
          inputClassName,
        )}
        keyboardType={keyboardType}
        placeholderTextColor={placeholderTextColor}
        returnKeyType={returnKeyType}
        {...rest}
      />
      {errorMessage ? (
        <AppText className="text-danger" variant="caption">
          {errorMessage}
        </AppText>
      ) : helperText ? (
        <AppText variant="caption">{helperText}</AppText>
      ) : null}
    </View>
  );
}
