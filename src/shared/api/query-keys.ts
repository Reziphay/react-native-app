export const qk = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  brands: {
    detail: (id: string) => ['brands', 'detail', id] as const,
    joinRequests: (id: string) => ['brands', id, 'joinRequests'] as const,
    members: (id: string) => ['brands', id, 'members'] as const,
    mine: ['brands', 'mine'] as const,
    reviews: (id: string, params?: unknown) =>
      ['brands', id, 'reviews', params] as const,
  },
  discover: {
    brands: (params?: unknown) => ['discover', 'brands', params] as const,
    categories: ['discover', 'categories'] as const,
    providers: (params?: unknown) => ['discover', 'providers', params] as const,
    services: (params?: unknown) => ['discover', 'services', params] as const,
  },
  notifications: {
    list: (params?: unknown) => ['notifications', 'list', params] as const,
    unreadCount: ['notifications', 'unreadCount'] as const,
  },
  providers: {
    detail: (id: string) => ['providers', 'detail', id] as const,
    qr: ['provider', 'me', 'qr'] as const,
    reviews: (id: string, params?: unknown) =>
      ['providers', id, 'reviews', params] as const,
  },
  reservations: {
    detail: (id: string) => ['reservations', 'detail', id] as const,
    me: (params?: unknown) => ['reservations', 'me', params] as const,
    providerDetail: (id: string) =>
      ['provider', 'reservations', 'detail', id] as const,
    providerList: (params?: unknown) =>
      ['provider', 'reservations', params] as const,
  },
  services: {
    detail: (id: string) => ['services', 'detail', id] as const,
    list: (params?: unknown) => ['services', 'list', params] as const,
    reviews: (id: string, params?: unknown) =>
      ['services', id, 'reviews', params] as const,
  },
  users: {
    devices: ['users', 'me', 'devices'] as const,
    penalties: ['users', 'me', 'penalties'] as const,
    settings: ['users', 'me', 'settings'] as const,
  },
};
