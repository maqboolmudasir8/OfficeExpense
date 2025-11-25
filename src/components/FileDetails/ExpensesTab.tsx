import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Text, Button, Card, Menu, Dialog, Portal, Avatar, Searchbar, useTheme, IconButton } from 'react-native-paper';
import { format } from 'date-fns';
import { fetchExpensesByFileId, deleteExpense, getExpenseSummary } from '../../api/expenseService';
import { useNavigation } from '@react-navigation/native';
import { Expense } from '../../types/Expense';
import { AuthContext } from '../../context/AuthContext';

interface ExpensesTabProps {
    fileId: number;
    onExpenseAdded?: () => void;
    onExpenseUpdated?: () => void;
    onExpenseDeleted?: () => void;
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({ fileId }) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { user } = React.useContext(AuthContext);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

    // Load expenses
    const loadExpenses = useCallback(async () => {
        try {
            const expensesData = await fetchExpensesByFileId(fileId);
            setExpenses(expensesData || []);
        } catch (error) {
            console.error('Error loading expenses:', error);
            Alert.alert('Error', 'Failed to load expenses');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [fileId]);

    // Initial load
    useEffect(() => {
        loadExpenses();
    }, [loadExpenses]);

    // Handle refresh
    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        loadExpenses();
    }, [loadExpenses]);

    // Handle delete expense
    const handleDeleteExpense = async () => {
        if (!selectedExpense?.id) return;

        try {
            await deleteExpense(selectedExpense.id);
            setExpenses(prev => prev.filter(exp => exp.id !== selectedExpense.id));
            setIsDeleteDialogVisible(false);
        } catch (error) {
            console.error('Error deleting expense:', error);
            Alert.alert('Error', 'Failed to delete expense');
        }
    };

    // Filter expenses based on search query
    const filteredExpenses = expenses.filter(expense => {
        const searchLower = searchQuery.toLowerCase();
        return (
            (expense.notes?.toLowerCase().includes(searchLower) || '') ||
            (expense.category?.toLowerCase().includes(searchLower) || '')
        );
    });

    // Render expense item
    const renderExpenseItem = ({ item }: { item: Expense }) => {
        const userName = 'You'; // Replace with actual user name if available
        const userInitials = userName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        return (
            <Card style={styles.expenseCard}>
                <Card.Content>
                    <View style={styles.expenseHeader}>
                        <View style={styles.expenseAmount}>
                            <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
                            <Text style={styles.categoryText}>{item.category}</Text>
                        </View>
                        <View style={styles.expenseUser}>
                            <Avatar.Text size={32} label={userInitials} style={styles.avatar} />
                            <Text style={styles.userName}>{userName}</Text>
                        </View>
                    </View>
                    {item.notes && <Text style={styles.descriptionText}>{item.notes}</Text>}
                    <View style={styles.expenseFooter}>
                        <Text style={styles.dateText}>
                            {format(new Date(item.spent_at), 'MMM d, yyyy')}
                        </Text>
                        <Menu
                            visible={isMenuVisible && selectedExpense?.id === item.id}
                            onDismiss={() => setIsMenuVisible(false)}
                            anchor={
                                <IconButton
                                    icon="dots-vertical"
                                    size={20}
                                    onPress={() => {
                                        setSelectedExpense(item);
                                        setIsMenuVisible(true);
                                    }}
                                    style={styles.menuButton}
                                />
                            }
                        >
                            <Menu.Item
                                onPress={() => {
                                    setIsMenuVisible(false);
                                    navigation.navigate('EditExpense', {
                                        expenseId: item?.id ?? 0,
                                        fileId: fileId ?? 0
                                    });
                                }}
                                title="Edit"
                            />
                            <Menu.Item
                                onPress={() => {
                                    setIsMenuVisible(false);
                                    setSelectedExpense(item);
                                    setIsDeleteDialogVisible(true);
                                }}
                                title="Delete"
                                titleStyle={{ color: theme.colors.error }}
                            />
                        </Menu>
                    </View>
                </Card.Content>
            </Card>
        );
    };

    // Render empty state
    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No expenses found</Text>
            <Text style={styles.emptyStateSubtext}>Add your first expense to get started</Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <Searchbar
                placeholder="Search expenses..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                iconColor={theme.colors.primary}
                placeholderTextColor={theme.colors.onSurfaceVariant}
            />

            {/* Expenses List */}
            <FlatList
                data={filteredExpenses}
                renderItem={renderExpenseItem}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            {/* Add Expense Button */}
            <Button
                mode="contained"
                onPress={() => {
                    navigation.navigate('AddExpense', { fileId });
                }}
                style={styles.addButton}
                labelStyle={styles.addButtonLabel}
                icon="plus"
            >
                Add Expense
            </Button>

            {/* Delete Confirmation Dialog */}
            <Portal>
                <Dialog
                    visible={isDeleteDialogVisible}
                    onDismiss={() => setIsDeleteDialogVisible(false)}
                >
                    <Dialog.Title>Delete Expense</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete this expense?</Text>
                        <Text style={{ fontWeight: 'bold', marginTop: 8 }}>
                            {selectedExpense?.notes}
                        </Text>
                        <Text>${selectedExpense?.amount?.toFixed(2)}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setIsDeleteDialogVisible(false)}>Cancel</Button>
                        <Button onPress={handleDeleteExpense} textColor={theme.colors.error}>
                            Delete
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
    searchBar: {
        marginBottom: 16,
        elevation: 0,
        backgroundColor: 'transparent',
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    expenseCard: {
        marginBottom: 8,
        elevation: 1,
    },
    expenseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    expenseAmount: {
        flex: 1,
    },
    amountText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    expenseUser: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 8,
        backgroundColor: '#6200ee',
    },
    userName: {
        fontSize: 14,
        color: '#333',
    },
    descriptionText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    expenseFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#666',
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    addButton: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 28,
        paddingHorizontal: 8,
    },
    addButtonLabel: {
        fontSize: 16,
        paddingVertical: 6,
    },
    separator: {
        height: 8,
    },
});