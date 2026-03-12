export const apiRoutes = {
  auth: {
    emailVerify: '/auth/email/verify',
    emailVerifyRequest: '/auth/email/verify/request',
    logout: '/auth/logout',
    me: '/auth/me',
    otpRequest: '/auth/otp/request',
    otpVerify: '/auth/otp/verify',
    refresh: '/auth/refresh',
    switchRole: '/auth/switch-role',
  },
  discover: {
    brands: '/discover/brands',
    categories: '/discover/categories',
    providers: '/discover/providers',
    services: '/discover/services',
  },
  users: {
    devices: '/users/me/devices',
    me: '/users/me',
    settings: '/users/me/settings',
  },
} as const;
