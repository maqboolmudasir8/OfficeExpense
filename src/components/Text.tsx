import React from 'react';
import { Text as PaperText, TextProps as PaperTextProps } from 'react-native-paper';
import { StyleSheet, StyleProp, TextStyle } from 'react-native';

// Use Paper's variant types
type PaperVariant = React.ComponentProps<typeof PaperText>['variant'];

// Define our custom variants that extend Paper's variants
type CustomVariant = 'body' | 'caption';

// Combined variant type
type TextVariant = PaperVariant | CustomVariant;

interface TextProps extends Omit<PaperTextProps<React.ReactNode>, 'variant' | 'children'> {
    variant?: TextVariant;
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
}

// Map our custom variants to Paper's variants
const variantMap: Record<CustomVariant, PaperVariant> = {
    body: 'bodyMedium',
    caption: 'bodySmall',
};

const variantStyles = StyleSheet.create({
    headlineSmall: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '600',
    },
    headlineMedium: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '500',
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
    },
    caption: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400',
        opacity: 0.7,
    },
});

export const Text: React.FC<TextProps> = ({
    variant = 'body',
    style,
    children,
    ...props
}) => {
    // Map our custom variants to Paper's variants
    const paperVariant = variant in variantMap
        ? variantMap[variant as CustomVariant]
        : variant as PaperVariant;

    return (
        <PaperText
            variant={paperVariant}
            style={[variantStyles[variant as keyof typeof variantStyles], style]}
            {...props}
        >
            {children}
        </PaperText>
    );
};