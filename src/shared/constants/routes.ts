import type { Href } from 'expo-router';

export const routes = {
  authHome: '/(auth)',
  customerHome: '/(customer)',
  modalPreview: '/modal',
  providerHome: '/(provider)',
  publicWelcome: '/(public)/welcome',
} as const satisfies Record<string, Href>;
