import React, { forwardRef, useImperativeHandle } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Dropdown as RNPDropdown } from "react-native-paper-dropdown";
import { TextInputProps } from "react-native-paper";

export interface LabelValueModel {
    label: string;
    value: string;
}

interface DropdownProps {
    label?: string;
    placeholder?: string;
    options: LabelValueModel[];
    value?: string;
    onSelect: (value?: string) => void;
    style?: StyleProp<ViewStyle>;
    mode?: 'flat' | 'outlined';
    inputProps?: Partial<TextInputProps>;
    disabled?: boolean;
    error?: boolean;
}

export const Dropdown = (({
    label,
    options,
    value,
    placeholder,
    onSelect,
    style,
    mode = 'outlined',
    inputProps = {},
    disabled = false,
    error = false,
}: DropdownProps) => {

    return (
        <RNPDropdown
            label={label}
            options={options}
            value={value}
            onSelect={onSelect}
            mode={mode}
            // visible={visible}
            // showDropDown={() => setVisible(true)}
            // onDismiss={() => setVisible(false)}
            // setValue={(val) => {
            //     onSelect(val);
            //     setVisible(false);
            // }}
            // list={options}
            placeholder={placeholder}
            disabled={disabled}
        // inputProps={{
        //     ...inputProps,
        //     error,
        //     style: [
        //         { backgroundColor: 'transparent' },
        //         style,
        //         inputProps.style,
        //     ],
        // }}
        />
    );
});