import React from "react";
import { Animated, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Button as RNPButton, ButtonProps as RNPButtonProps } from "react-native-paper";

interface ButtonProps {
    label: string;
    mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
    style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export default function Button({ label, style, ...props }: ButtonProps) {
    return (
        <RNPButton mode="contained" style={[styles.button, style]} {...props}>
            {label}
        </RNPButton>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 16,
    },
});
