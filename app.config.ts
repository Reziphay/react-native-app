import type { ConfigContext, ExpoConfig } from 'expo/config';

const appName = 'Reziphay';
const appSlug = 'reziphay-mobile';
const backgroundColor = '#F3EFE6';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  slug: appSlug,
  scheme: 'reziphay',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor,
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.reziphay.mobile',
  },
  android: {
    adaptiveIcon: {
      backgroundColor,
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    package: 'com.reziphay.mobile',
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-router', 'expo-font', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.reziphay.com/api/v1',
    enableMocks: process.env.EXPO_PUBLIC_ENABLE_MOCKS ?? 'false',
  },
});
