import { create } from 'zustand';

export interface LastKnownLocation {
  lat: number;
  lng: number;
}

interface AppStore {
  lastKnownLocation?: LastKnownLocation | null;
  notificationUnreadCount: number;
  pendingDeepLink?: string | null;
  pushPermissionStatus: 'unknown' | 'granted' | 'denied';
  setLastKnownLocation: (location?: LastKnownLocation | null) => void;
  setNotificationUnreadCount: (count: number) => void;
  setPendingDeepLink: (deepLink?: string | null) => void;
  setPushPermissionStatus: (status: AppStore['pushPermissionStatus']) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  lastKnownLocation: null,
  notificationUnreadCount: 0,
  pendingDeepLink: null,
  pushPermissionStatus: 'unknown',
  setLastKnownLocation: (lastKnownLocation) =>
    set({
      lastKnownLocation,
    }),
  setNotificationUnreadCount: (notificationUnreadCount) =>
    set({
      notificationUnreadCount,
    }),
  setPendingDeepLink: (pendingDeepLink) =>
    set({
      pendingDeepLink,
    }),
  setPushPermissionStatus: (pushPermissionStatus) =>
    set({
      pushPermissionStatus,
    }),
}));
