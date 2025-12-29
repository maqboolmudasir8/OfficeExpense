// src/styles/typography.ts
import { DefaultTheme } from 'react-native-paper';

export const typography = {
    // Font sizes
    displayLarge: {
        fontSize: 57,
        lineHeight: 64,
        letterSpacing: 0,
        fontWeight: '400' as const,
    },
    displayMedium: {
        fontSize: 45,
        lineHeight: 52,
        letterSpacing: 0,
        fontWeight: '400' as const,
    },
    displaySmall: {
        fontSize: 36,
        lineHeight: 44,
        letterSpacing: 0,
        fontWeight: '400' as const,
    },
    headlineLarge: {
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: 0,
        fontWeight: '400' as const,
    },
    headlineMedium: {
        fontSize: 28,
        lineHeight: 36,
        letterSpacing: 0,
        fontWeight: '400' as const,
    },
    headlineSmall: {
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: 0,
        fontWeight: '400' as const,
    },
    titleLarge: {
        fontSize: 22,
        lineHeight: 28,
        letterSpacing: 0,
        fontWeight: '500' as const,
    },
    titleMedium: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.15,
        fontWeight: '500' as const,
    },
    titleSmall: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
        fontWeight: '500' as const,
    },
    labelLarge: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
        fontWeight: '500' as const,
    },
    labelMedium: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.5,
        fontWeight: '500' as const,
    },
    labelSmall: {
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.5,
        fontWeight: '500' as const,
    },
    bodyLarge: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.5,
        fontWeight: '400' as const,
    },
    bodyMedium: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.25,
        fontWeight: '400' as const,
    },
    bodySmall: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.4,
        fontWeight: '400' as const,
    },
};

// This function can be used to configure the Paper theme with these typography settings
export const configureTypography = (theme: typeof DefaultTheme) => ({
    ...theme,
    fonts: {
        ...theme.fonts,
        ...Object.entries(typography).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {} as Record<string, any>),
    },
});