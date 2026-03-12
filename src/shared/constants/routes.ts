import type { Href } from 'expo-router';

export const routes = {
  authEmailVerify: '/auth/email-verify',
  authHome: '/(auth)/phone',
  authOtp: '/(auth)/otp',
  authPhone: '/(auth)/phone',
  customerAccount: '/(customer)/account',
  customerDiscover: '/(customer)/discover',
  customerHome: '/(customer)/discover',
  modalPreview: '/modal',
  providerAccount: '/(provider)/account',
  providerHome: '/(provider)/workspace',
  providerWorkspace: '/(provider)/workspace',
  publicWelcome: '/(public)/welcome',
} as const satisfies Record<string, Href>;
