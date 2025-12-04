import React from "react";
import { globalStyles } from "../styles/globalStyles";
import { Animated, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Button as RNPButton, ButtonProps as RNPButtonProps } from "react-native-paper";

interface ButtonProps {
    label: string;
    mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
    style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    buttonColor?: string;
    textColor?: string;
}

export const Button: React.FC<ButtonProps> = ({ label, style, ...props }) => {
    return (
        <RNPButton
            mode="contained"
            style={[globalStyles.buttons.compact, style]}
            contentStyle={styles.content}
            labelStyle={styles.label}
            {...props}
        >
            {label}
        </RNPButton>
    );
};

const styles = StyleSheet.create({
    content: {
        height: 42,
    },
    label: {
        fontSize: 14,
    }
});
