import React from "react";
import { Dropdown as RNPDropdown } from "react-native-paper-dropdown";

interface DropdownProps {
    label: string;
    options: { label: string; value: string }[];
    value?: string;
    onSelect: (value?: string) => void;
}

export default function Dropdown({ label, options, value, onSelect }: DropdownProps) {
    return <RNPDropdown
        label={label}
        options={options}
        value={value}
        onSelect={onSelect}
    />;
}
