import { create } from 'zustand';

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
  bootstrapped: boolean;
  clearSession: () => void;
  isAuthenticated: boolean;
  markBootstrapped: () => void;
  refreshToken: string | null;
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
  bootstrapped: false,
  isAuthenticated: false,
  refreshToken: null,
  user: null,
} satisfies Pick<
  AuthStore,
  | 'accessToken'
  | 'activeRole'
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

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  clearSession: () =>
    set({
      ...initialState,
      bootstrapped: true,
    }),
  markBootstrapped: () =>
    set({
      bootstrapped: true,
    }),
  setBootstrapped: (bootstrapped) =>
    set({
      bootstrapped,
    }),
  setSession: ({ accessToken, refreshToken, user }) =>
    set({
      ...resolveTokenPayload({ accessToken, refreshToken }),
      activeRole: user.activeRole,
      bootstrapped: true,
      user,
    }),
  setUser: (user) =>
    set((state) => ({
      activeRole: user?.activeRole ?? state.activeRole,
      isAuthenticated: Boolean(state.accessToken && state.refreshToken && user),
      user,
    })),
  switchRoleLocal: (role) =>
    set((state) => ({
      activeRole: role,
      user: state.user
        ? {
            ...state.user,
            activeRole: role,
          }
        : state.user,
    })),
  updateTokens: ({ accessToken, refreshToken }) =>
    set((state) => ({
      ...resolveTokenPayload({ accessToken, refreshToken }),
      activeRole: state.user?.activeRole ?? state.activeRole,
      user: state.user,
    })),
  user: null,
}));
