import { useLocalSearchParams } from 'expo-router';

import { PhoneAuthScreen } from '@/features/auth/screens/phone-auth-screen';
import { UserRole } from '@/shared/enums/domain';

function resolveRoleHint(
  value: string | string[] | undefined,
): UserRole | undefined {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate) {
    return undefined;
  }

  if (candidate === UserRole.CUSTOMER || candidate === UserRole.SERVICE_OWNER) {
    return candidate;
  }

  return undefined;
}

export default function PhoneAuthRoute() {
  const params = useLocalSearchParams<{ roleHint?: string | string[] }>();

  return <PhoneAuthScreen roleHint={resolveRoleHint(params.roleHint)} />;
}
