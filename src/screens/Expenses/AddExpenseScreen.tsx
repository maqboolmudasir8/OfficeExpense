// AddExpenseScreen.tsx
import React, { useContext, useState } from "react";
import { ScrollView, Alert, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addExpense } from "../../api/expenseService";
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, EXPENSE_STATUSES, CURRENCIES, } from "../../constants/expenseOptions";
import { RootStackParamList } from "../../types/RootStackParamList";
import { AuthContext } from "../../context/AuthContext";
import { Expense } from "../../types/Expense";
import DateTimeSelector from "../../components/Expenses/DateTimeSelector";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import Text from "../../components/Text";

type Props = NativeStackScreenProps<RootStackParamList, "AddExpense">;

export default function AddExpenseScreen({ route, navigation }: Props) {
    const { fileId } = route.params;
    const { user } = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [spentAt, setSpentAt] = useState(new Date());

    // Form state matching Expense model
    const [expense, setExpense] = useState<Partial<Expense>>({
        expense_title: "",
        amount: 0,
        category: "",
        payment_method: "Cash",
        // status: "pending",
        currency: "PKR",
        notes: "",
        merchant_name: "",
        location: "",
        paid_by: "",
        tags: "",
        receipt_url: "",
    });

    const updateField = (key: keyof Expense, value: any) => {
        setExpense((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!expense.expense_title || !expense.amount || !expense.category) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        try {
            setIsSubmitting(true);
            await addExpense({
                file_id: fileId ?? 0,
                created_by: user?.id || "",
                expense_title: expense.expense_title,
                amount: Number(expense.amount),
                category: expense.category,
                currency: expense.currency || "PKR",
                // status: expense.status || "pending",
                notes: expense.notes || null,
                payment_method: expense.payment_method || "Cash",
                spent_at: spentAt.toISOString(),
                merchant_name: expense.merchant_name,
                location: expense.location,
                // paid_by: expense.paid_by,
                // tags: expense.tags,
                receipt_url: expense.receipt_url,
            });
            Alert.alert("Success", "Expense added successfully");
            navigation.goBack();
        } catch (error) {
            console.error("Error adding expense:", error);
            Alert.alert("Error", "Failed to add expense");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineSmall" style={{ marginBottom: 12 }}>
                Add Expense
            </Text>

            <TextInput
                label="Title"
                value={expense.expense_title}
                onChangeText={(v) => updateField("expense_title", v)}
                style={styles.input}
            />

            <TextInput
                label="Amount"
                keyboardType="numeric"
                value={expense.amount?.toString() || ""}
                onChangeText={(v) => updateField("amount", Number(v))}
                style={styles.input}
            />

            <TextInput
                label="Notes (optional)"
                value={expense.notes || ""}
                onChangeText={(v) => updateField("notes", v)}
                style={styles.input}
            />

            <TextInput
                label="Merchant Name (optional)"
                value={expense.merchant_name || ""}
                onChangeText={(v) => updateField("merchant_name", v)}
                style={styles.input}
            />

            <TextInput
                label="Location (optional)"
                value={expense.location || ""}
                onChangeText={(v) => updateField("location", v)}
                style={styles.input}
            />

            {/* <TextInput
                label="Paid By (optional)"
                value={expense.paid_by || ""}
                onChangeText={(v) => updateField("paid_by", v)}
                style={styles.input}
            />

            <TextInput
                label="Tags (comma separated)"
                value={expense.tags || ""}
                onChangeText={(v) => updateField("tags", v)}
                style={styles.input}
            /> */}

            <TextInput
                label="Receipt URL (optional)"
                value={expense.receipt_url || ""}
                onChangeText={(v) => updateField("receipt_url", v)}
                style={styles.input}
            />

            <Dropdown
                label="Category"
                options={EXPENSE_CATEGORIES}
                value={expense.category}
                onSelect={(v) => updateField("category", v)}
            />

            {/* <Dropdown
                label="Payment Method (optional)"
                options={PAYMENT_METHODS}
                value={expense.payment_method}
                onSelect={(v) => updateField("payment_method", v)}
            /> */}

            {/* <Dropdown
                label="Status"
                options={EXPENSE_STATUSES}
                value={expense.status}
                onSelect={(v) => updateField("status", v)}
            /> */}

            {/* <Dropdown
                label="Currency"
                options={CURRENCIES}
                value={expense.currency}
                onSelect={(v) => updateField("currency", v)}
            /> */}

            <DateTimeSelector value={spentAt} onChange={setSpentAt} />

            <Button
                label="Save Expense"
                mode="contained"
                style={styles.saveButton}
                loading={isSubmitting}
                onPress={handleSave}
            />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 12,
    },
    saveButton: {
        marginTop: 20,
    },
});