import React from "react";
import { Text as RNPText, StyleSheet, TextProps as RNPTextProps } from "react-native";

interface TextProps
//  extends RNPTextProps 
{
    children: React.ReactNode;
    variant?: "headlineSmall" | "headlineMedium" | "body" | "caption"; // optional variants
    style?: any;
    color?: string;
}

export default function Text({ children, variant = "body", style, color, ...props }: TextProps) {
    return (
        <RNPText
            style={[styles[variant], { color: color || "#000" }, style]}
            {...props}
        >
            {children}
        </RNPText>
    );
}

const styles = StyleSheet.create({
    headlineSmall: {
        fontSize: 24,
        fontWeight: "600",
    },
    headlineMedium: {
        fontSize: 20,
        fontWeight: "500",
    },
    body: {
        fontSize: 16,
        fontWeight: "400",
    },
    caption: {
        fontSize: 12,
        fontWeight: "400",
    },
});
