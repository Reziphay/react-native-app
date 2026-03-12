import { Redirect } from 'expo-router';

import { routes } from '@/shared/constants/routes';

export default function ProviderShellRoute() {
  return <Redirect href={routes.providerHome} />;
}
