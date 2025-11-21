import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme, MD3Theme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ThemedButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: keyof typeof MaterialIcons.glyphMap;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    iconPosition?: 'left' | 'right';
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    icon,
    loading = false,
    disabled = false,
    fullWidth = false,
    style,
    textStyle,
    iconPosition = 'left',
}) => {
    const theme = useTheme();
    const { colors } = theme;

    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            borderRadius: theme.roundness,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            opacity: disabled ? 0.6 : 1,
            alignSelf: fullWidth ? 'stretch' : 'flex-start',
        };

        const sizeStyles: Record<ButtonSize, ViewStyle> = {
            small: { paddingVertical: 6, height: 36 },
            medium: { paddingVertical: 10, height: 48 },
            large: { paddingVertical: 14, height: 56 },
        };

        const variantStyles: Record<ButtonVariant, ViewStyle> = {
            primary: {
                backgroundColor: colors.primary,
            },
            secondary: {
                backgroundColor: colors.secondaryContainer,
            },
            outlined: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: colors.outline,
            },
            text: {
                backgroundColor: 'transparent',
                paddingHorizontal: 8,
            },
            danger: {
                backgroundColor: theme.colors.error,
            },
        };

        return {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant],
        };
    };

    const getTextStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
            textAlign: 'center',
            marginHorizontal: 8,
        };

        const sizeStyles: Record<ButtonSize, TextStyle> = {
            small: { ...theme.fonts.labelLarge },
            medium: { ...theme.fonts.titleMedium },
            large: { ...theme.fonts.titleLarge },
        };

        const variantStyles: Record<ButtonVariant, TextStyle> = {
            primary: {
                color: colors.onPrimary,
            },
            secondary: {
                color: colors.onSecondaryContainer,
            },
            outlined: {
                color: colors.onSurface,
            },
            text: {
                color: colors.primary,
            },
            danger: {
                color: colors.onError,
            },
        };

        return {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant],
        };
    };

    const iconColor = (() => {
        switch (variant) {
            case 'primary':
                return colors.onPrimary;
            case 'secondary':
                return colors.onSecondaryContainer;
            case 'outlined':
                return colors.onSurface;
            case 'text':
                return colors.primary;
            case 'danger':
                return colors.onError;
            default:
                return colors.onPrimary;
        }
    })();

    const iconSize = (() => {
        switch (size) {
            case 'small':
                return 16;
            case 'medium':
                return 20;
            case 'large':
                return 24;
            default:
                return 20;
        }
    })();

    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator color={iconColor} size="small" />;
        }

        return (
            <>
                {icon && iconPosition === 'left' && (
                    <MaterialIcons
                        name={icon}
                        size={iconSize}
                        color={iconColor}
                        style={{ marginRight: 8 }}
                    />
                )}
                <Text style={[getTextStyle(), textStyle]}>{title}</Text>
                {icon && iconPosition === 'right' && (
                    <MaterialIcons
                        name={icon}
                        size={iconSize}
                        color={iconColor}
                        style={{ marginLeft: 8 }}
                    />
                )}
            </>
        );
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[getButtonStyle(), style]}
            activeOpacity={0.7}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

export default ThemedButton;
