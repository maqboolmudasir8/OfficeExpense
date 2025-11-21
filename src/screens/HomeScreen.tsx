// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, Button, Card, useTheme, Divider } from 'react-native-paper';
import { supabase } from '../api/supabaseClient';
import { AuthContext } from '../context/AuthContext';
import { Expense } from '../types/Expense';
import { ExpenseGroup } from '../types/ExpenseGroup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const theme = useTheme();
    const { user, signOut } = useContext(AuthContext);
    const [expenseGroups, setExpenseGroups] = useState<ExpenseGroup[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [loadingExpenses, setLoadingExpenses] = useState(true);

    // Fetch Expense Groups
    const fetchExpenseGroups = async () => {
        setLoadingGroups(true);
        const { data, error } = await supabase
            .from('expense_groups')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) console.log('Error fetching groups:', error.message);
        else setExpenseGroups(data || []);
        setLoadingGroups(false);
    };

    // Fetch recent Expenses
    const fetchExpenses = async () => {
        setLoadingExpenses(true);
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .order('spent_at', { ascending: false })
            .limit(10);
        if (error) console.log('Error fetching expenses:', error.message);
        else setExpenses(data || []);
        setLoadingExpenses(false);
    };

    useEffect(() => {
        fetchExpenseGroups();
        fetchExpenses();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
                    Welcome, {user?.email}
                </Text>
                <Button mode="contained" onPress={signOut} style={{ borderRadius: 8 }}>
                    Logout
                </Button>
            </View>

            {/* Expense Groups */}
            <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.onBackground }}>
                Expense Groups
            </Text>
            {loadingGroups ? (
                <ActivityIndicator color={theme.colors.primary} size="small" />
            ) : (
                <FlatList
                    data={expenseGroups}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 12 }}
                    renderItem={({ item }) => (
                        <Card
                            style={[styles.groupCard, { backgroundColor: theme.colors.surface }]}
                            onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
                        >
                            <Card.Content>
                                <Text variant="titleSmall" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                                    {item.name}
                                </Text>
                                {item.description && (
                                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                                        {item.description}
                                    </Text>
                                )}
                            </Card.Content>
                        </Card>
                    )}
                />
            )}

            <Divider style={{ marginVertical: 16, backgroundColor: theme.colors.outlineVariant }} />

            {/* Recent Expenses */}
            <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.onBackground }}>
                Recent Expenses
            </Text>
            {loadingExpenses ? (
                <ActivityIndicator color={theme.colors.primary} size="small" />
            ) : (
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Card style={[styles.expenseCard, { backgroundColor: theme.colors.surface }]}>
                            <Card.Content>
                                <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                                    {item.amount} {item.currency}
                                </Text>
                                {item.notes && (
                                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                                        {item.notes}
                                    </Text>
                                )}
                                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                                    Spent on: {item.spent_at}
                                </Text>
                            </Card.Content>
                        </Card>
                    )}
                    ItemSeparatorComponent={() => <Divider style={{ marginVertical: 8, backgroundColor: theme.colors.outlineVariant }} />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    groupCard: {
        marginRight: 12,
        borderRadius: 12,
        minWidth: 140,
        elevation: 2,
    },
    expenseCard: {
        borderRadius: 12,
        elevation: 1,
        paddingVertical: 4,
    },
});
