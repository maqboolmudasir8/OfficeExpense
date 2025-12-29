import React from "react";
import { globalStyles } from "../styles/globalStyles";
import { Animated, StyleProp, TextStyle, ViewStyle } from "react-native";
import { Button as RNPButton, ButtonProps as RNPButtonProps } from "react-native-paper";

interface ButtonProps extends Omit<RNPButtonProps, 'children'> {
    label?: string;
    mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
    style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    textStyle?: StyleProp<TextStyle>;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    buttonColor?: string;
    textColor?: string;
    icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
    label,
    mode = "contained",
    style,
    icon,
    textStyle,
    ...props
}) => {
    return (
        <RNPButton
            mode={mode}
            icon={icon}
            style={[globalStyles.buttons.compact, style]}
            contentStyle={globalStyles.buttons.content}
            labelStyle={[globalStyles.buttons.label, textStyle]}
            {...props}
        >
            {label}
        </RNPButton>
    );
};