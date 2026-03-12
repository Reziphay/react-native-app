import { routes } from '@/shared/constants/routes';
import { FlowPlaceholder } from '@/shared/ui/composite/flow-placeholder';

export default function AuthShellRoute() {
  return (
    <FlowPlaceholder
      actionHref={routes.publicWelcome}
      actionLabel="Back to onboarding"
      description="OTP, magic link, and session bootstrap flows will be added to this shell in Step 4."
      eyebrow="Auth Shell"
      title="Reserved stack for authentication flows"
    />
  );
}
