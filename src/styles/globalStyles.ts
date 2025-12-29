// globalStyles.ts
import { Dimensions, StyleSheet } from 'react-native';
import { theme } from '../theme';

const { colors, spacing } = theme;

/* -------------------------------- Layout -------------------------------- */
export const layout = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    scrollViewContent: {
        paddingBottom: spacing.lg,
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
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

/* -------------------------------- Spacing -------------------------------- */
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

/* -------------------------------- Typography -------------------------------- */
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

/* -------------------------------- Forms -------------------------------- */
export const forms = StyleSheet.create({
    input: {
        backgroundColor: colors.surfaceVariant,
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        minHeight: 42,
        color: colors.onSurface,
        marginBottom: 16,
    },
    textArea: {
        minHeight: 100,
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
        marginBottom: 12,
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
        minHeight: 42,
    },
});

/* -------------------------------- Cards -------------------------------- */
export const cards = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.sm,
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    cardTitle: {
        fontWeight: '600',
    },
    cardContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    cardActions: {
        padding: 16,
        justifyContent: 'flex-end',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

/* -------------------------------- Buttons -------------------------------- */
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
    content: {
        height: 42,
    },
    label: {
        fontSize: 14,
    },
    error: {
        backgroundColor: colors.error,
        borderColor: colors.error,
    },
    errorText: {
        color: colors.onError,
    }
});

/* -------------------------------- Lists -------------------------------- */
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

/* -------------------------------- Color Picker -------------------------------- */
export const colorPicker = StyleSheet.create({
    label: {
        fontSize: 12,
        marginBottom: 4,
        color: 'rgba(0,0,0,0.54)',
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.23)',
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    colorPreview: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.23)',
        marginRight: 12,
    },
    colorText: {
        fontSize: 16,
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        height: 420,
    },
});

/* -------------------------------- Elevation -------------------------------- */
export const elevation = {
    small: {
        elevation: 2,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.4,
    },
    medium: {
        elevation: 4,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.8,
    },
};

/* -------------------------------- Responsive -------------------------------- */
const { width, height } = Dimensions.get('window');

export const responsive = {
    wp: (percentage: number) => (width * percentage) / 100,
    hp: (percentage: number) => (height * percentage) / 100,
    width,
    height,
};

/* -------------------------------- Global Export -------------------------------- */
export const globalStyles = {
    layout,
    spacing: spacingStyles,
    typography,
    forms,
    cards,
    buttons,
    lists,
    colorPicker,
    elevation,
    responsive,
    flex1: { flex: 1 },
};
