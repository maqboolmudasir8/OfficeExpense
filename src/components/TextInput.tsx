// src/components/TextInput.tsx
import React from 'react';
import { globalStyles } from '../styles/globalStyles';
import { TextInput as RNPTextInput, useTheme } from 'react-native-paper';
import { Text } from './Text';
import { theme as appTheme } from '../theme';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface TextInputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    mode?: 'flat' | 'outlined';
    style?: any;
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
    multiline?: boolean;
    numberOfLines?: number;
    secureTextEntry?: boolean;
    error?: boolean;
    errorText?: string;
    autoFocus?: boolean;
    prefix?: string;
    suffix?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    disabled?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    contentStyle?: ViewStyle;
    labelStyle?: TextStyle;
    textColor?: string;
    onLeftIconPress?: () => void;
    onRightIconPress?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChangeText,
    mode = 'outlined',
    error = false,
    autoFocus,
    errorText,
    leftIcon,
    rightIcon,
    onLeftIconPress,
    onRightIconPress,
    prefix,
    suffix,
    style,
    autoCapitalize,
    autoCorrect,
    contentStyle,
    labelStyle,
    textColor,
    disabled,
    ...props
}) => {
    const paperTheme = useTheme();

    const getDisabledStyles = () =>
        disabled
            ? {
                backgroundColor: paperTheme.colors.surfaceDisabled,
                borderColor: paperTheme.colors.outlineVariant,
            }
            : {};

    const resolvedTextColor = disabled
        ? paperTheme.colors.onSurfaceDisabled
        : textColor || paperTheme.colors.onSurface;

    const renderIcon = (icon: string, onPress?: () => void, isLeft = true) => (
        <RNPTextInput.Icon
            icon={icon}
            onPress={onPress}
            forceTextInputFocus={false}
            style={isLeft ? styles.leftIcon : styles.rightIcon}
            color={error ? appTheme.colors.error : undefined}
        />
    );

    return (
        <>
            <RNPTextInput
                label={label}
                value={value}
                onChangeText={onChangeText}
                mode={mode}
                error={error}
                disabled={disabled}
                dense
                style={[
                    globalStyles.forms.compactInput,
                    getDisabledStyles(),
                    style,
                ]}
                contentStyle={[styles.content, contentStyle]}
                autoFocus={autoFocus}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                theme={{
                    roundness: 6,
                    colors: {
                        primary: paperTheme.colors.primary,
                        error: appTheme.colors.error,
                        onSurface: resolvedTextColor,
                        outline: paperTheme.colors.outline,
                        placeholder: disabled
                            ? paperTheme.colors.onSurfaceDisabled
                            : paperTheme.colors.onSurfaceVariant,
                        surfaceDisabled: paperTheme.colors.surfaceDisabled,
                    },
                }}
                left={
                    leftIcon
                        ? renderIcon(leftIcon, onLeftIconPress, true)
                        : prefix && (
                            <RNPTextInput.Icon
                                icon={() => (
                                    <Text
                                        style={[
                                            styles.affix,
                                            error && {
                                                color: appTheme.colors.error,
                                            },
                                        ]}
                                    >
                                        {prefix}
                                    </Text>
                                )}
                                disabled
                            />
                        )
                }
                right={
                    rightIcon
                        ? renderIcon(rightIcon, onRightIconPress, false)
                        : suffix && (
                            <RNPTextInput.Icon
                                icon={() => (
                                    <Text
                                        style={[
                                            styles.affix,
                                            error && {
                                                color: appTheme.colors.error,
                                            },
                                        ]}
                                    >
                                        {suffix}
                                    </Text>
                                )}
                                disabled
                            />
                        )
                }
                {...props}
            />

            {error && errorText && (
                <Text
                    variant="bodySmall"
                    style={[styles.errorText, { color: appTheme.colors.error }]}
                >
                    {errorText}
                </Text>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    content: {
        minHeight: 48,
        backgroundColor: 'transparent',
    },
    affix: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.6)',
    },
    leftIcon: {
        marginRight: 8,
    },
    rightIcon: {
        marginLeft: 8,
    },
    errorText: {
        marginTop: 4,
        marginLeft: 12,
        fontSize: 12,
    },
});