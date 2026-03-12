import { Redirect } from 'expo-router';

import { routes } from '@/shared/constants/routes';

export default function AuthShellRoute() {
  return <Redirect href={routes.authPhone} />;
}
