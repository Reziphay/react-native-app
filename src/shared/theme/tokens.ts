export const themeTokens = {
  colors: {
    accent: '#C65D1A',
    accentSoft: '#F1C8AB',
    border: '#D6C7B5',
    canvas: '#F3EFE6',
    danger: '#B0302C',
    ink: '#1F1A17',
    inkSoft: '#5C5147',
    success: '#1E6A4A',
    surface: '#FFFDF8',
    surfaceMuted: '#E9DED0',
    warning: '#9A6A12',
  },
  radius: {
    lg: 20,
    xl: 28,
    pill: 999,
  },
  spacing: {
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    body: {
      fontFamily: 'System',
      fontSize: 16,
      lineHeight: 24,
    },
    display: {
      fontFamily: 'System',
      fontSize: 34,
      lineHeight: 40,
    },
    title: {
      fontFamily: 'System',
      fontSize: 24,
      lineHeight: 30,
    },
  },
} as const;
