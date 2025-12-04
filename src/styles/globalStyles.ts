// globalStyles.ts
import { Dimensions, StyleSheet } from 'react-native';
import { theme } from '../theme';

const { colors, spacing } = theme;

// Layout
export const layout = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
});

// Spacing
export const spacingStyles = StyleSheet.create({
    mb8: { marginBottom: spacing.sm },
    mb16: { marginBottom: spacing.md },
    mb24: { marginBottom: spacing.lg },

    mv8: { marginVertical: spacing.sm },
    mv16: { marginVertical: spacing.md },

    mh8: { marginHorizontal: spacing.sm },
    mh16: { marginHorizontal: spacing.md },

    p8: { padding: spacing.sm },
    p16: { padding: spacing.md },
});

// Typography
export const typography = StyleSheet.create({
    title: {
        ...theme.fonts.titleLarge,
        color: colors.onSurface,
        marginBottom: spacing.md,
    },
    subtitle: {
        ...theme.fonts.titleMedium,
        color: colors.onSurfaceVariant,
        marginBottom: spacing.sm,
    },
    body: {
        ...theme.fonts.bodyMedium,
        color: colors.onSurface,
    },
    caption: {
        ...theme.fonts.bodySmall,
        color: colors.onSurfaceVariant,
    },
});

// Form styles
export const forms = StyleSheet.create({
    input: {
        backgroundColor: colors.surfaceVariant,
        borderRadius: 4,
        paddingVertical: 8,  // Reduced from default
        paddingHorizontal: 12,
        fontSize: 14,
        minHeight: 42,  // Fixed height for consistency
        color: colors.onSurface,
    },
    label: {
        ...theme.fonts.labelMedium,
        color: colors.onSurfaceVariant,
        marginBottom: 4,
    },
    inputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    inputContainer: {
        marginBottom: 12
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    error: {
        ...theme.fonts.bodySmall,
        color: colors.error,
        marginTop: 2,
    },
    compactInput: {
        backgroundColor: colors.surfaceVariant,
        borderRadius: 6,
        paddingHorizontal: 10,
        minHeight: 42,   // consistent compact height
    }
});

// Cards
export const cards = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.sm,
        elevation: 1,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
});

// Buttons
export const buttons = StyleSheet.create({
    primary: {
        backgroundColor: colors.primary,
        borderRadius: 4,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        minHeight: 40,
    },
    primaryText: {
        ...theme.fonts.labelLarge,
        color: colors.onPrimary,
    },
    secondary: {
        backgroundColor: colors.secondaryContainer,
        borderRadius: 4,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        minHeight: 40,
    },
    secondaryText: {
        ...theme.fonts.labelLarge,
        color: colors.onSecondaryContainer,
    },
    compact: {
        backgroundColor: colors.primary,
        borderRadius: 6,
        height: 42,
        justifyContent: 'center',
    },
});

// List styles
export const lists = StyleSheet.create({
    item: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: spacing.sm,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 1,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    itemContent: {
        flex: 1,
        marginLeft: spacing.sm,
    },
    itemTitle: {
        ...theme.fonts.titleMedium,
        color: colors.onSurface,
        marginBottom: 2,
    },
    itemSubtitle: {
        ...theme.fonts.bodySmall,
        color: colors.onSurfaceVariant,
    },
});


// In globalStyles.ts, add:
export const elevation = {
    small: {
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    medium: {
        elevation: 4,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    // Add more as needed
};

// Responsive
const { width, height } = Dimensions.get('window');

export const responsive = {
    // Responsive width (percentage of screen width)
    wp: (percentage: number) => (width * percentage) / 100,
    // Responsive height (percentage of screen height)
    hp: (percentage: number) => (height * percentage) / 100,
    // Screen dimensions
    width,
    height,
};

// Export everything in a single object for easier imports
export const globalStyles = {
    layout,
    spacing: spacingStyles,
    typography,
    forms,
    cards,
    buttons,
    lists,
    responsive,
};