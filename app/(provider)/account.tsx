import { AccountHomeScreen } from '@/features/auth/screens/account-home-screen';
import { routes } from '@/shared/constants/routes';

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

export default function ProviderAccountRoute() {
  return (
    <AccountHomeScreen
      activeNavKey="account"
      description="Use the same account state across provider operations, email verification, and fast role switching."
      eyebrow="Provider account"
      navItems={providerNavItems}
      title="Shared account controls"
    />
  );
}
