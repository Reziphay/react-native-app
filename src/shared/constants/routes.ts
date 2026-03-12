import type { Href } from 'expo-router';

export const routes = {
  authEmailVerify: '/auth/email-verify',
  authHome: '/(auth)/phone',
  authOtp: '/(auth)/otp',
  authPhone: '/(auth)/phone',
  customerHome: '/(customer)',
  modalPreview: '/modal',
  providerHome: '/(provider)',
  publicWelcome: '/(public)/welcome',
} as const satisfies Record<string, Href>;
