import { queryClient } from '@/providers/query-client';
import { qk } from '@/shared/api/query-keys';

const roleScopedQueryKeys = [
  qk.auth.me,
  qk.brands.mine,
  ['provider', 'reservations'] as const,
  ['reservations', 'me'] as const,
  ['notifications', 'list'] as const,
] as const;

export async function invalidateRoleQueries() {
  await Promise.all(
    roleScopedQueryKeys.map((queryKey) =>
      queryClient.invalidateQueries({ queryKey }),
    ),
  );
}
