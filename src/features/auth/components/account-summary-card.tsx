import { type ReactNode } from 'react';
import { View } from 'react-native';

import { UserRole } from '@/shared/enums/domain';
import type { UserProfileDto } from '@/shared/types/entities';
import { AppText } from '@/shared/ui/primitives/app-text';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';

interface AccountSummaryCardProps {
  actions?: ReactNode;
  description?: string;
  user: UserProfileDto;
}

const roleLabels: Record<UserRole, string> = {
  [UserRole.CUSTOMER]: 'Customer',
  [UserRole.SERVICE_OWNER]: 'Service owner',
};

function VerificationRow({
  label,
  value,
  verified,
}: {
  label: string;
  value: string;
  verified: boolean;
}) {
  return (
    <View className="gap-1 rounded-2xl bg-canvas px-4 py-3">
      <View className="flex-row items-center justify-between gap-3">
        <AppText variant="label">{label}</AppText>
        <View
          className={`rounded-full px-3 py-1 ${verified ? 'bg-success/15' : 'bg-warning/15'}`}
        >
          <AppText
            className={verified ? 'text-success' : 'text-warning'}
            variant="caption"
          >
            {verified ? 'Verified' : 'Pending'}
          </AppText>
        </View>
      </View>
      <AppText className="text-ink-soft">{value}</AppText>
    </View>
  );
}

export function AccountSummaryCard({
  actions,
  description,
  user,
}: AccountSummaryCardProps) {
  const emailValue =
    user.verification.email?.trim() || user.email?.trim() || 'No email added';

  return (
    <SurfaceCard className="gap-4">
      <View className="gap-2">
        <AppText variant="eyebrow">Account</AppText>
        <AppText variant="title">{user.fullName}</AppText>
        <AppText className="text-ink-soft">
          {description ??
            'Current account state is refreshed from the latest authenticated profile data.'}
        </AppText>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {user.roles.map((role) => (
          <View className="rounded-full bg-accentSoft px-3 py-2" key={role}>
            <AppText variant="caption">{roleLabels[role]}</AppText>
          </View>
        ))}
        <View className="rounded-full bg-surface-muted px-3 py-2">
          <AppText variant="caption">
            Active role: {roleLabels[user.activeRole]}
          </AppText>
        </View>
      </View>

      <VerificationRow
        label="Phone"
        value={user.verification.phoneNumber || user.phoneNumber}
        verified={user.verification.phoneVerified}
      />
      <VerificationRow
        label="Email"
        value={emailValue}
        verified={user.verification.emailVerified}
      />

      {actions ? <View className="gap-3">{actions}</View> : null}
    </SurfaceCard>
  );
}
