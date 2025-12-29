// theme.ts
import { MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme as PaperMD3Theme } from 'react-native-paper';

type FontWeight =
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';

// Extend MD3 Theme with full custom color types
declare global {
    namespace ReactNativePaper {
        interface MD3Theme extends PaperMD3Theme {
            colors: PaperMD3Theme['colors'] & typeof colors;
        }
    }
}

interface FontConfig {
    [key: string]: {
        fontFamily: string;
        fontWeight: FontWeight;
        fontSize: number;
        lineHeight: number;
        letterSpacing: number;
    };
}

// 🎨 Custom Color Palette
export const colors = {
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',

    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8DEF8',
    onSecondaryContainer: '#1D192B',

    tertiary: '#7D5260',
    onTertiary: '#FFFFFF',

    error: '#B3261E',
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',

    background: '#FFFBFE',
    onBackground: '#1C1B1F',

    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',

    outline: '#79747E',
    // outlineVariant: '#CAC4D0',

    shadow: '#000000',
    scrim: '#000000',

    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: '#D0BCFF',

    elevation: {
        level0: 'transparent',
        level1: '#F7F2FA',
        level2: '#F3EDF7',
        level3: '#EEE8F4',
        level4: '#EDE6F2',
        level5: '#E9E3F0',
    },

    surfaceDisabled: '#f1f1f1', // Example color
    onSurfaceDisabled: '#888888', // Example color
    outlineVariant: '#e0e0e0', // Example color

    backdrop: 'rgba(50, 47, 55, 0.4)',
};

// 📝 Font Configuration
const fontConfig: FontConfig = {
    displayLarge: {
        fontFamily: 'sans-serif',
        fontSize: 57,
        fontWeight: '400',
        letterSpacing: 0,
        lineHeight: 64,
    },
    displayMedium: {
        fontFamily: 'sans-serif',
        fontSize: 45,
        fontWeight: '400',
        letterSpacing: 0,
        lineHeight: 52,
    },
    displaySmall: {
        fontFamily: 'sans-serif',
        fontSize: 36,
        fontWeight: '400',
        letterSpacing: 0,
        lineHeight: 44,
    },
    headlineLarge: {
        fontFamily: 'sans-serif',
        fontSize: 32,
        fontWeight: '400',
        letterSpacing: 0,
        lineHeight: 40,
    },
    headlineMedium: {
        fontFamily: 'sans-serif',
        fontSize: 28,
        fontWeight: '400',
        letterSpacing: 0,
        lineHeight: 36,
    },
    headlineSmall: {
        fontFamily: 'sans-serif',
        fontSize: 24,
        fontWeight: '400',
        letterSpacing: 0,
        lineHeight: 32,
    },
    titleLarge: {
        fontFamily: 'sans-serif-medium',
        fontSize: 22,
        fontWeight: '400',
        letterSpacing: 0,
        lineHeight: 28,
    },
    titleMedium: {
        fontFamily: 'sans-serif-medium',
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.15,
        lineHeight: 24,
    },
    titleSmall: {
        fontFamily: 'sans-serif-medium',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    labelLarge: {
        fontFamily: 'sans-serif-medium',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    labelMedium: {
        fontFamily: 'sans-serif-medium',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.5,
        lineHeight: 16,
    },
    labelSmall: {
        fontFamily: 'sans-serif-medium',
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 0.5,
        lineHeight: 16,
    },
    bodyLarge: {
        fontFamily: 'sans-serif',
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 0.5,
        lineHeight: 24,
    },
    bodyMedium: {
        fontFamily: 'sans-serif',
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.25,
        lineHeight: 20,
    },
    bodySmall: {
        fontFamily: 'sans-serif',
        fontSize: 12,
        fontWeight: '400',
        letterSpacing: 0.4,
        lineHeight: 16,
    },
};

// 🎉 Final App Theme
export const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...colors,
    },
    fonts: configureFonts({ config: fontConfig }),
    roundness: 12,
    animation: { scale: 1.0 },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
};

export type AppTheme = typeof theme;