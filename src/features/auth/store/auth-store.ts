import { create } from 'zustand';

import {
  clearPersistedAuthSession,
  persistAuthSession,
  type PersistedAuthSession,
} from '@/features/auth/lib/auth-session-storage';
import { UserRole } from '@/shared/enums/domain';
import type { AuthTokensDto, UserProfileDto } from '@/shared/types/entities';

interface SessionPayload {
  accessToken: string;
  refreshToken: string;
  user: UserProfileDto;
}

interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}

interface AuthStore {
  accessToken: string | null;
  activeRole: UserRole | null;
  bootstrapError: string | null;
  bootstrapped: boolean;
  clearSession: () => void;
  hydrateSession: (payload: PersistedAuthSession) => void;
  isAuthenticated: boolean;
  markBootstrapped: () => void;
  refreshToken: string | null;
  setBootstrapError: (message: string | null) => void;
  setBootstrapped: (bootstrapped: boolean) => void;
  setSession: (payload: SessionPayload) => void;
  setUser: (user: UserProfileDto | null) => void;
  switchRoleLocal: (role: UserRole) => void;
  updateTokens: (
    tokens: Pick<AuthTokensDto, 'accessToken' | 'refreshToken'>,
  ) => void;
  user: UserProfileDto | null;
}

const initialState = {
  accessToken: null,
  activeRole: null,
  bootstrapError: null,
  bootstrapped: false,
  isAuthenticated: false,
  refreshToken: null,
  user: null,
} satisfies Pick<
  AuthStore,
  | 'accessToken'
  | 'activeRole'
  | 'bootstrapError'
  | 'bootstrapped'
  | 'isAuthenticated'
  | 'refreshToken'
  | 'user'
>;

function resolveTokenPayload(payload: TokenPayload) {
  return {
    accessToken: payload.accessToken,
    isAuthenticated: Boolean(payload.accessToken && payload.refreshToken),
    refreshToken: payload.refreshToken,
  };
}

function persistCurrentSession(
  tokenPayload: TokenPayload,
  activeRole?: UserRole | null,
) {
  void persistAuthSession({
    accessToken: tokenPayload.accessToken,
    activeRole: activeRole ?? null,
    refreshToken: tokenPayload.refreshToken,
  });
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,
  clearSession: () => {
    void clearPersistedAuthSession();
    set({
      ...initialState,
      bootstrapped: true,
    });
  },
  hydrateSession: ({ accessToken, activeRole, refreshToken }) =>
    set({
      accessToken,
      activeRole: activeRole ?? null,
      bootstrapError: null,
      bootstrapped: false,
      isAuthenticated: false,
      refreshToken,
      user: null,
    }),
  markBootstrapped: () =>
    set({
      bootstrapError: null,
      bootstrapped: true,
    }),
  setBootstrapError: (bootstrapError) =>
    set({
      bootstrapError,
      bootstrapped: true,
    }),
  setBootstrapped: (bootstrapped) =>
    set({
      bootstrapped,
    }),
  setSession: ({ accessToken, refreshToken, user }) => {
    persistCurrentSession({ accessToken, refreshToken }, user.activeRole);

    set({
      ...resolveTokenPayload({ accessToken, refreshToken }),
      activeRole: user.activeRole,
      bootstrapError: null,
      bootstrapped: true,
      user,
    });
  },
  setUser: (user) => {
    const current = get();

    if (current.accessToken && current.refreshToken && user) {
      persistCurrentSession(
        {
          accessToken: current.accessToken,
          refreshToken: current.refreshToken,
        },
        user.activeRole,
      );
    }

    set((state) => ({
      activeRole: user?.activeRole ?? state.activeRole,
      bootstrapError: null,
      isAuthenticated: Boolean(state.accessToken && state.refreshToken && user),
      user,
    }));
  },
  switchRoleLocal: (role) => {
    const current = get();

    if (current.accessToken && current.refreshToken) {
      persistCurrentSession(
        {
          accessToken: current.accessToken,
          refreshToken: current.refreshToken,
        },
        role,
      );
    }

    set((state) => ({
      activeRole: role,
      user: state.user
        ? {
            ...state.user,
            activeRole: role,
          }
        : state.user,
    }));
  },
  updateTokens: ({ accessToken, refreshToken }) => {
    const current = get();

    persistCurrentSession(
      { accessToken, refreshToken },
      current.user?.activeRole ?? current.activeRole,
    );

    set((state) => ({
      ...resolveTokenPayload({ accessToken, refreshToken }),
      activeRole: state.user?.activeRole ?? state.activeRole,
      user: state.user,
    }));
  },
  user: null,
}));
