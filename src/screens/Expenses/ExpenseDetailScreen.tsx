import React, { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, Divider } from "react-native-paper";
import { useExpense, useUpdateExpense, useDeleteExpense } from "../../hooks/useExpenses";
import { AuthContext } from "../../context/AuthContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

type Props = NativeStackScreenProps<RootStackParamList, "ExpenseDetail">;

export default function ExpenseDetailScreen({ route, navigation }: Props) {
    const { expenseId } = route.params;
    const { user } = useContext(AuthContext);

    const { data: expense, isLoading } = useExpense(expenseId);
    const updateMutation = useUpdateExpense();
    const deleteMutation = useDeleteExpense();

    if (isLoading || !expense) return <Text>Loading...</Text>;

    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineMedium">{expense.expense_title}</Text>
            <Text variant="titleLarge">
                {expense.amount} {expense.currency}
            </Text>

            <Divider style={{ marginVertical: 15 }} />

            <Text>Category: {expense.category}</Text>
            <Text>Status: {expense.status}</Text>
            <Text style={{ marginTop: 10 }}>Notes: {expense.notes}</Text>

            <Divider style={{ marginVertical: 15 }} />

            {user?.role === "Admin" && (
                <View>
                    <Button
                        mode="contained"
                        onPress={() =>
                            updateMutation.mutate({
                                id: expense.id,
                                updates: { status: "Approved", approved_by: user.id },
                            })
                        }
                        style={styles.actionBtn}
                    >
                        Approve
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() =>
                            updateMutation.mutate({
                                id: expense.id,
                                updates: { status: "Rejected", approved_by: user.id },
                            })
                        }
                        style={styles.actionBtn}
                    >
                        Reject
                    </Button>
                </View>
            )}

            <Button
                mode="text"
                onPress={() =>
                    navigation.navigate("EditExpense", { expenseId: expense.id })
                }
                style={styles.actionBtn}
            >
                Edit Expense
            </Button>

            <Button
                textColor="red"
                onPress={() => {
                    deleteMutation.mutate(expense.id, {
                        onSuccess: () => navigation.goBack(),
                    });
                }}
            >
                Delete Expense
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 15 },
    actionBtn: { marginVertical: 5 },
});
