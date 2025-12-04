import React from "react";
import { StyleSheet } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { TextInput as RNPTextInput, TextInputProps as RNPTextInputProps } from "react-native-paper";

interface TextInputProps
// extends RNPTextInputProps 
{
    label?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    mode?: 'flat' | 'outlined';
    style?: any;
    keyboardType?: RNPTextInputProps['keyboardType'];
    multiline?: boolean;
    numberOfLines?: number;
    secureTextEntry?: boolean;
    error?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ label, style, ...props }) => {
    return (
        <RNPTextInput
            label={label}
            mode="outlined"
            dense
            style={[globalStyles.forms.compactInput, style]}
            contentStyle={styles.content}
            theme={{ roundness: 6 }}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    content: {
        paddingVertical: 4,
        fontSize: 14,
    }
});
