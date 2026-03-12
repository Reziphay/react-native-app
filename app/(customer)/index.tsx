import { routes } from '@/shared/constants/routes';
import { FlowPlaceholder } from '@/shared/ui/composite/flow-placeholder';

export default function CustomerShellRoute() {
  return (
    <FlowPlaceholder
      actionHref={routes.publicWelcome}
      actionLabel="Back to foundation"
      description="Discovery, reservation, and review flows will be implemented inside this customer shell."
      eyebrow="Customer Shell"
      title="Route group prepared for the UCR experience"
    />
  );
}
