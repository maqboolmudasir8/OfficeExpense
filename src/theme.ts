import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import type { MD3Theme as PaperMD3Theme } from 'react-native-paper';

type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

// Extend the MD3Theme type to include our custom colors
declare global {
    namespace ReactNativePaper {
        interface MD3Theme extends PaperMD3Theme {
            colors: PaperMD3Theme['colors'] & {
                primary: string;
                onPrimary: string;
                primaryContainer: string;
                onPrimaryContainer: string;
                secondary: string;
                onSecondary: string;
                secondaryContainer: string;
                onSecondaryContainer: string;
                tertiary: string;
                onTertiary: string;
                error: string;
                onError: string;
                errorContainer: string;
                onErrorContainer: string;
                background: string;
                onBackground: string;
                surface: string;
                onSurface: string;
                surfaceVariant: string;
                onSurfaceVariant: string;
                outline: string;
                outlineVariant: string;
                shadow: string;
                scrim: string;
                inverseSurface: string;
                inverseOnSurface: string;
                inversePrimary: string;
                elevation: {
                    level0: string;
                    level1: string;
                    level2: string;
                    level3: string;
                    level4: string;
                    level5: string;
                };
                surfaceDisabled: string;
                onSurfaceDisabled: string;
                backdrop: string;
            };
        }
    }
}

interface FontConfig {
    [key: string]: {
        fontFamily: string;
        fontWeight: FontWeight;
        letterSpacing: number;
        lineHeight: number;
        fontSize: number;
    };
}

// Define our color palette
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
    outlineVariant: '#CAC4D0',
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
    surfaceDisabled: '#1C1B1F',
    onSurfaceDisabled: '#1C1B1F',
    backdrop: 'rgba(50, 47, 55, 0.4)',
};

const fontConfig: FontConfig = {
    displayLarge: {
        fontFamily: 'sans-serif',
        fontSize: 57,
        fontWeight: '400' as FontWeight,
        letterSpacing: 0,
        lineHeight: 64,
    },
    displayMedium: {
        fontFamily: 'sans-serif',
        fontSize: 45,
        fontWeight: '400' as FontWeight,
        letterSpacing: 0,
        lineHeight: 52,
    },
    displaySmall: {
        fontFamily: 'sans-serif',
        fontSize: 36,
        fontWeight: '400' as FontWeight,
        letterSpacing: 0,
        lineHeight: 44,
    },
    headlineLarge: {
        fontFamily: 'sans-serif',
        fontSize: 32,
        fontWeight: '400' as FontWeight,
        letterSpacing: 0,
        lineHeight: 40,
    },
    headlineMedium: {
        fontFamily: 'sans-serif',
        fontSize: 28,
        fontWeight: '400' as FontWeight,
        letterSpacing: 0,
        lineHeight: 36,
    },
    headlineSmall: {
        fontFamily: 'sans-serif',
        fontSize: 24,
        fontWeight: '400' as FontWeight,
        letterSpacing: 0,
        lineHeight: 32,
    },
    titleLarge: {
        fontFamily: 'sans-serif-medium',
        fontSize: 22,
        fontWeight: '400' as FontWeight,
        letterSpacing: 0,
        lineHeight: 28,
    },
    titleMedium: {
        fontFamily: 'sans-serif-medium',
        fontSize: 16,
        fontWeight: '500' as FontWeight,
        letterSpacing: 0.15,
        lineHeight: 24,
    },
    titleSmall: {
        fontFamily: 'sans-serif-medium',
        fontSize: 14,
        fontWeight: '500' as FontWeight,
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    labelLarge: {
        fontFamily: 'sans-serif-medium',
        fontSize: 14,
        fontWeight: '500' as FontWeight,
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    labelMedium: {
        fontFamily: 'sans-serif-medium',
        fontSize: 12,
        fontWeight: '500' as FontWeight,
        letterSpacing: 0.5,
        lineHeight: 16,
    },
    labelSmall: {
        fontFamily: 'sans-serif-medium',
        fontSize: 11,
        fontWeight: '500' as FontWeight,
        letterSpacing: 0.5,
        lineHeight: 16,
    },
    bodyLarge: {
        fontFamily: 'sans-serif',
        fontSize: 16,
        fontWeight: '400' as FontWeight,
        letterSpacing: 0.5,
        lineHeight: 24,
    },
    bodyMedium: {
        fontFamily: 'sans-serif',
        fontSize: 14,
        fontWeight: '400' as FontWeight,
        letterSpacing: 0.25,
        lineHeight: 20,
    },
    bodySmall: {
        fontFamily: 'sans-serif',
        fontSize: 12,
        fontWeight: '400' as FontWeight,
        letterSpacing: 0.4,
        lineHeight: 16,
    },
};



export const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        ...colors,
    },
    fonts: configureFonts({ config: fontConfig }),
    roundness: 12,
    animation: {
        scale: 1.0,
    },
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    screenContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background,
    },
    card: {
        marginVertical: 8,
        borderRadius: 12,
        elevation: 2,
        backgroundColor: colors.surface,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: colors.primary,
    },
    input: {
        backgroundColor: 'transparent',
        marginBottom: 8,
    },
    button: {
        marginVertical: 8,
        borderRadius: 8,
    },
    buttonLabel: {
        paddingVertical: 1,
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.onSurface,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        color: colors.onSurface,
    },
    divider: {
        height: 1,
        backgroundColor: colors.outlineVariant,
        marginVertical: 8,
    },
});