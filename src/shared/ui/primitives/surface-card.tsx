import { type ViewProps, View } from 'react-native';

import { cn } from '@/shared/lib/cn';

interface SurfaceCardProps extends ViewProps {
  className?: string;
}

export function SurfaceCard({ className, ...rest }: SurfaceCardProps) {
  return (
    <View
      className={cn(
        'rounded-[28px] border border-border bg-surface px-5 py-5',
        className,
      )}
      {...rest}
    />
  );
}
