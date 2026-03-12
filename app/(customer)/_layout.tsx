import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { UserRole } from '@/shared/enums/domain';
import { routes } from '@/shared/constants/routes';

export default function CustomerLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const activeRole = useAuthStore((state) => state.activeRole);

  if (!isAuthenticated) {
    return <Redirect href={routes.authHome} />;
  }

  if (activeRole === UserRole.SERVICE_OWNER) {
    return <Redirect href={routes.providerHome} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
