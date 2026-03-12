import { routes } from '@/shared/constants/routes';
import { FlowPlaceholder } from '@/shared/ui/composite/flow-placeholder';

export default function ProviderShellRoute() {
  return (
    <FlowPlaceholder
      actionHref={routes.publicWelcome}
      actionLabel="Back to foundation"
      description="Brand, service, and provider reservation operations will live under this shell."
      eyebrow="Provider Shell"
      title="Route group prepared for the USO experience"
    />
  );
}
