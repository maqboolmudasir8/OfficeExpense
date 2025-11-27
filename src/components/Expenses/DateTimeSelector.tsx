// DateTimeSelector.tsx
import React, { useState } from "react";
import { View, Platform } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DateTimeSelectorProps {
    value: Date;
    onChange: (date: Date) => void;
}

export default function DateTimeSelector({ value, onChange }: DateTimeSelectorProps) {
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
            {/* <Button title="Select Date & Time" onPress={() => setShowDatePicker(true)} /> */}
            <Button mode="outlined" onPress={() => setShowDatePicker(true)}>
                Select Date & Time
            </Button>
            <Text>Selected: {value.toLocaleString()}</Text>

            {showDatePicker && (
                <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={value}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </View>
    );
}
