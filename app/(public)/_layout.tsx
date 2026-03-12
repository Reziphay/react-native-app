import { Redirect, Stack } from 'expo-router';

import { resolveAuthenticatedRoute } from '@/features/auth/lib/auth-routing';
import { useAuthStore } from '@/features/auth/store/auth-store';

export default function PublicLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const activeRole = useAuthStore((state) => state.activeRole);

  if (isAuthenticated) {
    return <Redirect href={resolveAuthenticatedRoute(activeRole)} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
