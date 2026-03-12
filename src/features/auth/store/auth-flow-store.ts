import { create } from 'zustand';

import { UserRole } from '@/shared/enums/domain';

export interface OtpFlowState {
  expiresAt: string;
  otpRequestId: string;
  phoneNumber: string;
  resendAvailableAt: string;
  roleHint?: UserRole;
}

interface AuthFlowStore {
  clearOtpFlow: () => void;
  otpFlow: OtpFlowState | null;
  pendingEmail: string | null;
  setOtpFlow: (payload: OtpFlowState) => void;
  setPendingEmail: (email: string | null) => void;
}

export const useAuthFlowStore = create<AuthFlowStore>((set) => ({
  clearOtpFlow: () =>
    set({
      otpFlow: null,
    }),
  otpFlow: null,
  pendingEmail: null,
  setOtpFlow: (otpFlow) =>
    set({
      otpFlow,
    }),
  setPendingEmail: (pendingEmail) =>
    set({
      pendingEmail,
    }),
}));
