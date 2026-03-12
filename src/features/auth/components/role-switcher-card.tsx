import { View } from 'react-native';

import { useSwitchRoleMutation } from '@/features/auth/hooks/use-switch-role-mutation';
import { mapApiErrorToMessage } from '@/shared/api/errors';
import { UserRole } from '@/shared/enums/domain';
import type { UserProfileDto } from '@/shared/types/entities';
import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';

const roleMeta: Record<
  UserRole,
  {
    description: string;
    label: string;
  }
> = {
  [UserRole.CUSTOMER]: {
    description: 'Browse services, request reservations, and manage customer activity.',
    label: 'Customer',
  },
  [UserRole.SERVICE_OWNER]: {
    description: 'Manage services, brands, and provider-side reservation work.',
    label: 'Service owner',
  },
};

interface RoleSwitcherCardProps {
  user: UserProfileDto;
}

export function RoleSwitcherCard({ user }: RoleSwitcherCardProps) {
  const switchRoleMutation = useSwitchRoleMutation();

  return (
    <SurfaceCard className="gap-4">
      <View className="gap-2">
        <AppText variant="title">Active role</AppText>
        <AppText className="text-ink-soft">
          Switching roles keeps the same session open and moves you into the
          matching workspace.
        </AppText>
      </View>

      <View className="gap-3">
        {user.roles.map((role) => {
          const isActive = role === user.activeRole;
          const isLoading =
            switchRoleMutation.isPending &&
            switchRoleMutation.variables === role;

          return (
            <SurfaceCard className="gap-3 rounded-2xl bg-canvas px-4 py-4" key={role}>
              <View className="gap-1">
                <AppText variant="label">{roleMeta[role].label}</AppText>
                <AppText className="text-ink-soft">
                  {roleMeta[role].description}
                </AppText>
              </View>
              <AppButton
                disabled={isActive}
                label={isActive ? 'Current role' : `Switch to ${roleMeta[role].label}`}
                loading={isLoading}
                onPress={() => switchRoleMutation.mutate(role)}
                tone={isActive ? 'secondary' : 'primary'}
              />
            </SurfaceCard>
          );
        })}
      </View>

      {switchRoleMutation.isError ? (
        <AppText className="text-danger" variant="caption">
          {mapApiErrorToMessage(switchRoleMutation.error)}
        </AppText>
      ) : null}
    </SurfaceCard>
  );
}
