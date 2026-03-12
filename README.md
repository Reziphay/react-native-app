# Reziphay Mobile

Expo Router based React Native mobile application. This project is structured to support both `UCR` and `USO` experiences inside a single app.

## Stack

- Expo SDK 55
- React Native + TypeScript
- Expo Router
- NativeWind
- TanStack Query
- Zustand
- Axios
- React Hook Form + Zod

## Setup

1. `cp .env.example .env`
2. Update `EXPO_PUBLIC_API_BASE_URL` in `.env` if needed
3. `npm install`
4. `npm run start`

## Commands

- `npm run ios`
- `npm run android`
- `npm run web`
- `npm run lint`
- `npm run typecheck`
- `npm run format`

## Folder Structure

```txt
app/
  (public)/
  (auth)/
  (customer)/
  (provider)/
  modal/
src/
  features/
  providers/
  shared/
```

## Foundation Included In This Step

- Expo Router bootstrap
- Query / Safe Area / Gesture Handler provider chain
- Zustand based toast and modal host foundation
- NativeWind theme tokens
- Environment config helper
# react-native-app
