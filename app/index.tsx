import { Redirect } from 'expo-router';

import { routes } from '@/shared/constants/routes';

export default function IndexRoute() {
  return <Redirect href={routes.publicWelcome} />;
}
