import { Redirect } from 'expo-router';

import { resolveAuthenticatedRoute } from '@/features/auth/lib/auth-routing';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { routes } from '@/shared/constants/routes';

export default function IndexRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const activeRole = useAuthStore((state) => state.activeRole);

  if (!isAuthenticated) {
    return <Redirect href={routes.authHome} />;
  }

  return <Redirect href={resolveAuthenticatedRoute(activeRole)} />;
}
