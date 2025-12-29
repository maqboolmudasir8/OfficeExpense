import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Button, Menu, Portal, Searchbar, useTheme, FAB, Icon } from 'react-native-paper';
import { format } from 'date-fns';
import { fetchExpensesByFileId, deleteExpense, fetchFilteredExpenses } from '../../../api/expenseService';
import { useNavigation } from '@react-navigation/native';
import { Expense, ExpenseFilters } from '../../../types/Expense';
import { AuthContext } from '../../../context/AuthContext';
import { ExpensesFilterBottomSheet } from './ExpensesFilterBottomSheet';
import { useDebounce } from '../../../hooks/useDebounce';
import ConfirmationDialog from '../../../components/Files/ConfirmationDialog';
import { ExpenseCard } from '../../Expenses/components/ExpenseCard';

interface ExpensesTabProps {
    fileId: number;
    folderId: number;
    onExpenseAdded?: () => void;
    onExpenseUpdated?: () => void;
    onExpenseDeleted?: () => void;
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({ fileId, folderId }) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const { user } = React.useContext(AuthContext);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [menuForId, setMenuForId] = useState<number | null>(null);
    const debouncedSearch = useDebounce(searchQuery, 400);

    const [filters, setFilters] = useState<ExpenseFilters>({
        fromDate: undefined,
        toDate: undefined,
        category: undefined,
        status: undefined,
        minAmount: undefined,
        maxAmount: undefined,
        sortBy: 'spent_at',
        sortOrder: 'desc',
    });


    // Load expenses
    const loadExpenses = useCallback(async () => {
        setIsLoading(true);
        try {
            const expensesData = await fetchFilteredExpenses({
                fileId,
                folderId,
                ...filters,
                search: debouncedSearch,
            });
            setExpenses(expensesData || []);
        } catch (error) {
            Alert.alert("Error", "Failed to load filtered expenses");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }

    }, [fileId, filters, debouncedSearch]);

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

    // Get category icon based on category name
    const getCategoryIcon = (category: string) => {
        const icons: { [key: string]: string } = {
            'food': 'food',
            'transport': 'car',
            'accommodation': 'home',
            'utilities': 'lightbulb',
            'shopping': 'shopping',
            'entertainment': 'ticket',
            'health': 'medical-bag',
            'education': 'school',
            'other': 'dots-horizontal'
        };

        const icon = Object.keys(icons).find(key =>
            category.toLowerCase().includes(key)
        );

        return icon ? icons[icon] : 'receipt';
    };

    // Render expense item as a transaction row
    const renderExpenseItem = ({ item }: { item: Expense }) => {
        const categoryIcon = getCategoryIcon(item.category || 'other');
        const isNegative = item.amount < 0;
        const amountColor = isNegative ? '#e74c3c' : '#2ecc71';
        const formattedDate = format(new Date(item.spent_at), 'MMM d');

        return (
            <TouchableOpacity
                style={styles.transactionRow}
                onPress={() => {
                    navigation.navigate('EditExpense', {
                        expenseId: item?.id ?? 0,
                        fileId: fileId ?? 0
                    });
                }}
            >
                <View style={styles.transactionIcon}>
                    <Icon source={categoryIcon} size={20} color="#666" />
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle} numberOfLines={1}>
                        {item.expense_title || item.category || 'Expense'}
                    </Text>
                    <Text style={styles.transactionCategory}>
                        {item.category || 'Uncategorized'}
                    </Text>
                </View>
                <View>
                    <Text style={[styles.transactionAmount, { color: amountColor }]}>
                        {isNegative ? '-' : ''}{item.currency} {Math.abs(item.amount).toFixed(2)}
                    </Text>
                    <Text style={styles.transactionDate}>
                        {formattedDate}
                    </Text>
                </View>
            </TouchableOpacity>
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
            <View style={styles.contentContainer}>
                <Searchbar
                    placeholder="Search expenses..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    iconColor="#666"
                    placeholderTextColor="#999"
                    inputStyle={{ fontSize: 14 }}
                />

                <Button
                    mode="outlined"
                    icon="filter"
                    onPress={() => setFilterVisible(true)}
                    style={styles.filterButton}
                    labelStyle={styles.filterButtonText}
                    contentStyle={{ height: 36 }}
                >
                    Filter Expenses
                </Button>

                {/* Expenses List */}
                <FlatList
                    data={expenses}
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
                {fileId && fileId > 0 ? (
                    <FAB
                        icon="plus"
                        style={{
                            position: 'absolute',
                            margin: 16,
                            right: 0,
                            bottom: 0,
                            backgroundColor: theme.colors.primary,
                        }}
                        color="white"
                        onPress={() => {
                            navigation.navigate('AddExpense', { fileId, folderId });
                        }}
                    />
                ) : null}

                <ExpensesFilterBottomSheet
                    visible={filterVisible}
                    onClose={() => setFilterVisible(false)}
                    onApplyFilters={(f) => setFilters(f)}
                />

                {/* Delete Confirmation Dialog */}
                <ConfirmationDialog
                    visible={isDeleteDialogVisible}
                    onCancel={() => setIsDeleteDialogVisible(false)}
                    onConfirm={handleDeleteExpense}

                    loading={isLoading}
                    danger={true}
                    icon="trash-can"
                    title="Delete Expense"
                    message="Are you sure you want to delete this expense?"
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    confirmColor={theme.colors.error}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    searchBar: {
        margin: 12,
        marginBottom: 8,
        elevation: 0,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    listContent: {
        paddingBottom: 80,
    },
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    transactionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    transactionCategory: {
        fontSize: 12,
        color: '#888',
    },
    transactionAmount: {
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'right',
    },
    transactionDate: {
        fontSize: 11,
        color: '#999',
        textAlign: 'right',
        marginTop: 2,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#fff',
    },
    emptyStateText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    filterButton: {
        marginHorizontal: 12,
        marginBottom: 8,
        borderRadius: 8,
        borderColor: '#e0e0e0',
    },
    filterButtonText: {
        fontSize: 13,
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
});