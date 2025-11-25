import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { FAB, ActivityIndicator, Text, Card } from "react-native-paper";
import { useExpenses } from "../../hooks/useExpenses";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

type Props = NativeStackScreenProps<RootStackParamList, "ExpenseList">;

export default function ExpenseListScreen({ route, navigation }: Props) {
  const { groupId } = route.params;
  const { data: expenses, isLoading } = useExpenses(groupId);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!expenses?.length) {
    return (
      <View style={styles.center}>
        <Text>No expenses added yet.</Text>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("AddExpense", { groupId })}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() =>
              navigation.navigate("ExpenseDetail", { expenseId: item.id })
            }
          >
            <Card.Title
              title={item.expense_title || "Untitled Expense"}
              subtitle={`${item.amount} ${item.currency} • ${item.category}`}
            />
          </Card>
        )}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("AddExpense", { groupId })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  card: {
    marginVertical: 5,
    borderRadius: 8,
  },
});
