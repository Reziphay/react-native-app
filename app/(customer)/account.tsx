import { AccountHomeScreen } from '@/features/auth/screens/account-home-screen';
import { routes } from '@/shared/constants/routes';

const customerNavItems = [
  {
    href: routes.customerDiscover,
    key: 'discover',
    label: 'Discover',
  },
  {
    href: routes.customerAccount,
    key: 'account',
    label: 'Account',
  },
] as const;

export default function CustomerAccountRoute() {
  return (
    <AccountHomeScreen
      activeNavKey="account"
      description="Manage verification, switch roles without logout, and keep the shared session intact."
      eyebrow="Customer account"
      navItems={customerNavItems}
      title="Shared account controls"
    />
  );
}
