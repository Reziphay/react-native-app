import type { Href } from 'expo-router';

import { UserRole } from '@/shared/enums/domain';
import { routes } from '@/shared/constants/routes';

export function resolveAuthenticatedRoute(
  activeRole: UserRole | null | undefined,
): Href {
  if (activeRole === UserRole.SERVICE_OWNER) {
    return routes.providerHome;
  }

  return routes.customerHome;
}
