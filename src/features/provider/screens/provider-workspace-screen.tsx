import { View } from 'react-native';

import { routes } from '@/shared/constants/routes';
import { ShellNav } from '@/shared/ui/composite/shell-nav';
import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';

const providerNavItems = [
  {
    href: routes.providerWorkspace,
    key: 'workspace',
    label: 'Workspace',
  },
  {
    href: routes.providerAccount,
    key: 'account',
    label: 'Account',
  },
] as const;

const workspaceCards = [
  {
    description:
      'Brand creation, join requests, and ownership workflows will land here next.',
    title: 'Brand operations',
  },
  {
    description:
      'Service creation, updates, and scheduling controls will build on this shell.',
    title: 'Service operations',
  },
  {
    description:
      'Provider-side reservation queues and response deadlines will connect here.',
    title: 'Reservation control',
  },
] as const;

export function ProviderWorkspaceScreen() {
  return (
    <Screen contentClassName="gap-6" scroll>
      <SurfaceCard className="gap-4 bg-accent px-6 py-6">
        <View className="gap-2">
          <AppText className="text-surface/75" variant="eyebrow">
            Provider workspace
          </AppText>
          <AppText className="text-surface" variant="display">
            Manage operations in the active service-owner role.
          </AppText>
          <AppText className="text-surface/80">
            Role switching is now live. This workspace is the provider-side
            foundation for brands, services, and reservation actions.
          </AppText>
        </View>
      </SurfaceCard>

      <View className="gap-3">
        {workspaceCards.map((card) => (
          <SurfaceCard className="gap-2" key={card.title}>
            <AppText variant="label">{card.title}</AppText>
            <AppText className="text-ink-soft">{card.description}</AppText>
          </SurfaceCard>
        ))}
      </View>

      <SurfaceCard className="gap-2 bg-surface-muted">
        <AppText variant="label">Current scope</AppText>
        <AppText className="text-ink-soft">
          This step focuses on shell separation and active-role management. The
          provider data workflows attach to this workspace next.
        </AppText>
      </SurfaceCard>

      <ShellNav activeKey="workspace" items={providerNavItems} />
    </Screen>
  );
}
