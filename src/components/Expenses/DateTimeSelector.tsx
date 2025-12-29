// DateTimeSelector.tsx
import React, { useState } from "react";
import { View, Platform, StyleProp, ViewStyle } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "../Button";
import { globalStyles } from "../../styles/globalStyles";
import { Text } from "../Text";

interface DateTimeSelectorProps {
    value: Date;
    onChange: (date: Date) => void;
    style?: StyleProp<ViewStyle> | undefined;
}

export default function DateTimeSelector({ value, style, onChange }: DateTimeSelectorProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === "android") setShowDatePicker(false);
        if (event.type === "set" && selectedDate) {
            const newDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                value.getHours(),
                value.getMinutes()
            );
            onChange(newDate);

            if (Platform.OS === "android") setShowTimePicker(true);
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        if (Platform.OS === "android") setShowTimePicker(false);
        if (event.type === "set" && selectedTime) {
            const newDate = new Date(
                value.getFullYear(),
                value.getMonth(),
                value.getDate(),
                selectedTime.getHours(),
                selectedTime.getMinutes()
            );
            onChange(newDate);
        }
    };

    return (
        <View>
            <Button
                label="Select Date & Time"
                mode="outlined" onPress={() => setShowDatePicker(true)}
                style={globalStyles.buttons.secondary}
            />
            <Text>Selected: {value.toLocaleString()}</Text>

            {showDatePicker && (
                <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    style={style}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={value}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                    style={style}
                />
            )}
        </View>
    );
}
