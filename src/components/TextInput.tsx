import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { TextInput as RNPTextInput, TextInputProps as RNPTextInputProps } from "react-native-paper";

interface TextInputProps
// extends RNPTextInputProps 
{
    label: string;
    value?: string;
    onChangeText?: (text: string) => void;
    mode?: 'flat' | 'outlined';
    style?: StyleProp<TextStyle>;
    keyboardType?: RNPTextInputProps['keyboardType'];
}

export default function TextInput2({ label, style, ...props }: TextInputProps) {
    return <RNPTextInput label={label} style={[styles.input, style]} {...props} />;
}

export const TextInput: React.FC<TextInputProps> = ({ label, style, ...props }: TextInputProps) => {
    return <RNPTextInput label={label} style={[styles.input, style]} {...props} />;
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 12,
    },
});
