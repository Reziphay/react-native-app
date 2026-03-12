import { type TextProps, Text } from 'react-native';

import { cn } from '@/shared/lib/cn';

type TextVariant =
  | 'body'
  | 'caption'
  | 'display'
  | 'eyebrow'
  | 'label'
  | 'title';

interface AppTextProps extends TextProps {
  className?: string;
  variant?: TextVariant;
}

const variantClasses: Record<TextVariant, string> = {
  body: 'font-sans text-base leading-6 text-ink',
  caption: 'font-sans text-sm leading-5 text-ink-soft',
  display: 'font-display text-[34px] leading-[40px] text-ink',
  eyebrow: 'font-sans text-xs uppercase tracking-[2px] text-accent-strong',
  label: 'font-sans text-base font-semibold leading-6 text-ink',
  title: 'font-display text-[24px] font-semibold leading-[30px] text-ink',
};

export function AppText({
  className,
  variant = 'body',
  ...rest
}: AppTextProps) {
  return <Text className={cn(variantClasses[variant], className)} {...rest} />;
}
