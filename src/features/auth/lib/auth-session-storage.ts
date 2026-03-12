import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { UserRole } from '@/shared/enums/domain';

const AUTH_SESSION_KEY = 'reziphay.auth.session';

export interface PersistedAuthSession {
  accessToken: string;
  activeRole?: UserRole | null;
  refreshToken: string;
}

type StorageAdapter = {
  clear: (key: string) => Promise<void>;
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
};

function createWebStorageAdapter(): StorageAdapter {
  return {
    clear: async (key) => {
      globalThis.localStorage?.removeItem(key);
    },
    get: async (key) => globalThis.localStorage?.getItem(key) ?? null,
    set: async (key, value) => {
      globalThis.localStorage?.setItem(key, value);
    },
  };
}

function createSecureStorageAdapter(): StorageAdapter {
  return {
    clear: async (key) => {
      await SecureStore.deleteItemAsync(key);
    },
    get: async (key) => SecureStore.getItemAsync(key),
    set: async (key, value) => {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });
    },
  };
}

async function getStorageAdapter(): Promise<StorageAdapter> {
  const secureStoreAvailable =
    Platform.OS !== 'web' &&
    (await SecureStore.isAvailableAsync().catch(() => false));

  if (secureStoreAvailable) {
    return createSecureStorageAdapter();
  }

  return createWebStorageAdapter();
}

export async function loadPersistedAuthSession() {
  const storage = await getStorageAdapter();
  const rawValue = await storage.get(AUTH_SESSION_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<PersistedAuthSession>;

    if (
      typeof parsedValue.accessToken !== 'string' ||
      typeof parsedValue.refreshToken !== 'string'
    ) {
      await storage.clear(AUTH_SESSION_KEY);
      return null;
    }

    return {
      accessToken: parsedValue.accessToken,
      activeRole: parsedValue.activeRole ?? null,
      refreshToken: parsedValue.refreshToken,
    } satisfies PersistedAuthSession;
  } catch {
    await storage.clear(AUTH_SESSION_KEY);
    return null;
  }
}

export async function persistAuthSession(session: PersistedAuthSession) {
  const storage = await getStorageAdapter();

  await storage.set(AUTH_SESSION_KEY, JSON.stringify(session));
}

export async function clearPersistedAuthSession() {
  const storage = await getStorageAdapter();

  await storage.clear(AUTH_SESSION_KEY);
}
