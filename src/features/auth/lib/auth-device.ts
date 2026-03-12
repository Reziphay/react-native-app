import Constants from 'expo-constants';
import { Platform } from 'react-native';

import type { DeviceInfoDto } from '@/features/auth/types/auth-types';

function resolvePlatform(): DeviceInfoDto['platform'] {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return Platform.OS;
  }

  return 'web';
}

export function getAuthDeviceInfo(): DeviceInfoDto {
  return {
    appVersion: Constants.expoConfig?.version ?? 'development',
    deviceName:
      Platform.select({
        android: 'android-handset',
        ios: 'ios-handset',
        web: 'web-browser',
        default: 'unknown-device',
      }) ?? 'unknown-device',
    platform: resolvePlatform(),
  };
}
