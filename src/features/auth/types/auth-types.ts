import { UserRole } from '@/shared/enums/domain';
import type { AuthTokensDto, UserProfileDto } from '@/shared/types/entities';

export interface DeviceInfoDto {
  appVersion: string;
  deviceName: string;
  platform: 'ios' | 'android' | 'web';
}

export interface OtpRequestPayload {
  phoneNumber: string;
  roleHint?: UserRole;
}

export interface OtpRequestResult {
  expiresAt: string;
  otpRequestId: string;
  resendAvailableAt: string;
}

export interface OtpVerifyPayload {
  code: string;
  device: DeviceInfoDto;
  otpRequestId: string;
  phoneNumber: string;
}

export interface OtpVerifyResult {
  isNewUser: boolean;
  tokens: AuthTokensDto;
  user: UserProfileDto;
}

export interface EmailVerifyRequestPayload {
  email: string;
  redirectUri: string;
}

export interface EmailVerifyRequestResult {
  cooldownSeconds: number;
  email: string;
  sent: boolean;
}

export interface EmailVerifyResult {
  email: string;
  verified: boolean;
}

export interface RefreshSessionPayload {
  refreshToken: string;
}

export interface RefreshSessionResult {
  tokens: AuthTokensDto;
}

export interface LogoutPayload {
  refreshToken: string;
}

export interface LogoutResult {
  loggedOut: boolean;
}

export interface SwitchRolePayload {
  role: UserRole;
}

export interface SwitchRoleResult {
  activeRole: UserRole;
  roles: UserRole[];
}
