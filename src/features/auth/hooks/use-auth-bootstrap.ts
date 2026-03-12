import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { bootstrapAuthSession } from '@/features/auth/lib/auth-session-manager';
import { useAuthStore } from '@/features/auth/store/auth-store';

let bootstrapTask: Promise<void> | null = null;

async function runBootstrapSession() {
  if (!bootstrapTask) {
    bootstrapTask = bootstrapAuthSession().finally(() => {
      bootstrapTask = null;
    });
  }

  await bootstrapTask;
}

export function useAuthBootstrap() {
  const bootstrapped = useAuthStore((state) => state.bootstrapped);
  const bootstrapError = useAuthStore((state) => state.bootstrapError);

  useEffect(() => {
    if (!bootstrapped) {
      void runBootstrapSession();
    }
  }, [bootstrapped]);

  useEffect(() => {
    if (bootstrapped) {
      void SplashScreen.hideAsync();
    }
  }, [bootstrapped]);

  return {
    bootstrapped,
    bootstrapError,
    retryBootstrap: () => runBootstrapSession(),
  };
}
