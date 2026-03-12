import { useLocalSearchParams } from 'expo-router';

import { EmailVerifyScreen } from '@/features/auth/screens/email-verify-screen';

function resolveToken(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function EmailVerifyRoute() {
  const params = useLocalSearchParams<{ token?: string | string[] }>();

  return <EmailVerifyScreen token={resolveToken(params.token)} />;
}
