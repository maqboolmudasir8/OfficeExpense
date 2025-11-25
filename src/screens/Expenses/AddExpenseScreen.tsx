import React, { useContext, useState } from "react";
import { ScrollView, Alert, View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addExpense } from "../../api/expenseService";
import {
    EXPENSE_CATEGORIES,
    PAYMENT_METHODS,
    EXPENSE_STATUSES,
    CURRENCIES,
} from "../../constants/expenseOptions";
import { RootStackParamList } from "../../types/RootStackParamList";
import { AuthContext } from "../../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "AddExpense">;

// Update the AddExpenseScreen.tsx to handle file-based expenses
export default function AddExpenseScreen({ route, navigation }: Props) {
    const { fileId } = route.params;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useContext(AuthContext);

    const [expense, setExpense] = useState({
        title: "",
        amount: "",
        category: "",
        payment_method: "",
        status: "Pending",
        currency: "PKR",
    });

    const updateField = (key: string, value: any) => {
        setExpense((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!expense.title || !expense.amount || !expense.category) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            await addExpense({
                amount: parseFloat(expense?.amount),
                category: expense?.category,
                // notes: notes || null,
                notes: null,
                spent_at: new Date().toISOString(),
                file_id: fileId ?? 0,
                created_by: user?.id || '',
                currency: 'USD', // Default currency
            });
            Alert.alert('Success', 'Expense added successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error adding expense:', error);
            Alert.alert('Error', 'Failed to add expense');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView style={{ padding: 16 }}>
            <Text variant="headlineSmall" style={{ marginBottom: 12 }}>
                Add Expense
            </Text>

            <TextInput
                label="Title"
                value={expense.title}
                onChangeText={(v) => updateField("title", v)}
                style={{ marginBottom: 12 }}
            />

            <TextInput
                label="Amount"
                keyboardType="numeric"
                value={expense.amount}
                onChangeText={(v) => updateField("amount", v)}
                style={{ marginBottom: 12 }}
            />

            <Dropdown
                label="Category"
                options={EXPENSE_CATEGORIES}
                value={expense.category}
                onSelect={(v) => updateField("category", v)}
            />

            <Dropdown
                label="Payment Method"
                options={PAYMENT_METHODS}
                value={expense.payment_method}
                onSelect={(v) => updateField("payment_method", v)}
            />

            <Dropdown
                label="Status"
                options={EXPENSE_STATUSES}
                value={expense.status}
                onSelect={(v) => updateField("status", v)}
            />

            <Dropdown
                label="Currency"
                options={CURRENCIES}
                value={expense.currency}
                onSelect={(v) => updateField("currency", v)}
            />

            <Button
                mode="contained"
                style={{ marginTop: 20 }}
                // loading={mutation.isPending}
                onPress={handleSave}
            >
                Save Expense
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    saveButton: {
        marginTop: 24,
    },
});