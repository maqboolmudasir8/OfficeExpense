import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useExpense, useUpdateExpense } from "../../hooks/useExpenses";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { fetchExpenseById, updateExpense } from "../../api/expenseService";

type Props = NativeStackScreenProps<RootStackParamList, "EditExpense">;

export default function EditExpenseScreen({ route, navigation }: Props) {
    const { expenseId } = route.params;
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expense, setExpense] = useState(null);

    // Load expense data
    useEffect(() => {
        const loadExpense = async () => {
            try {
                const data = await fetchExpenseById(expenseId);
                setExpense(data);
                setAmount(data.amount.toString());
                setCategory(data.category);
                setNotes(data.notes || '');
            } catch (error) {
                console.error('Error loading expense:', error);
                Alert.alert('Error', 'Failed to load expense');
                navigation.goBack();
            }
        };
        loadExpense();
    }, [expenseId, navigation]);

    const handleUpdate = async () => {
        if (!amount || !category) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            await updateExpense(expenseId, {
                amount: parseFloat(amount),
                category,
                notes: notes || null,
            });
            Alert.alert('Success', 'Expense updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating expense:', error);
            Alert.alert('Error', 'Failed to update expense');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!expense) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                label="Category"
                value={category}
                onChangeText={setCategory}
                style={styles.input}
            />
            <TextInput
                label="Notes (Optional)"
                value={notes}
                onChangeText={setNotes}
                multiline
                style={[styles.input, { minHeight: 100 }]}
            />
            <Button
                mode="contained"
                onPress={handleUpdate}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.saveButton}
            >
                Update Expense
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginBottom: 16,
    },
    saveButton: {
        marginTop: 24,
    },
});