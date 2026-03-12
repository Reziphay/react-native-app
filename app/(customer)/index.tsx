import { Redirect } from 'expo-router';

import { routes } from '@/shared/constants/routes';

export default function CustomerShellRoute() {
  return <Redirect href={routes.customerHome} />;
}
