// src/components/Expenses/ExpenseCard.tsx
import React, { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar, IconButton, Menu, useTheme } from 'react-native-paper';
import { format } from 'date-fns';
import { Expense } from '../../../types/Expense';
import { AuthContext } from '../../../context/AuthContext';

interface ExpenseCardProps {
    expense: Expense;
    onEdit: (expenseId: number) => void;
    onDelete: (expense: Expense) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
    const theme = useTheme();
    const { getUserById } = useContext(AuthContext);
    const [menuVisible, setMenuVisible] = useState(false);

    const user = getUserById(expense.created_by) || { id: expense.created_by, first_name: 'Unknown', last_name: '' };
    const userName = `${user.first_name} ${user.last_name}`.trim();
    const userInitials = userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <Card style={styles.expenseCard}>
            <Card.Content>
                {/* Header: Title and Amount */}
                <View style={styles.expenseHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.titleText}>{expense.expense_title}</Text>
                        <Text style={styles.categoryText}>{expense.category}</Text>
                    </View>
                    <View style={styles.expenseAmount}>
                        <Text style={styles.amountText}>
                            {expense.currency ?? ''} {expense.amount?.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Optional fields */}
                {expense.notes ? <Text style={styles.notesText}>{expense.notes}</Text> : null}
                {/* {expense.merchant_name ? <Text style={styles.optionalText}>Merchant: {expense.merchant_name}</Text> : null} */}
                {/* {expense.payment_method ? <Text style={styles.optionalText}>Payment: {expense.payment_method}</Text> : null} */}
                {/* {expense.location ? <Text style={styles.optionalText}>Location: {expense.location}</Text> : null} */}
                {/* {expense.paid_by ? <Text style={styles.optionalText}>Paid by: {expense.paid_by}</Text> : null} */}
                {/* {expense.tags ? <Text style={styles.optionalText}>Tags: {expense.tags}</Text> : null} */}

                {/* Footer: User + Date + Menu */}
                <View style={styles.expenseFooter}>
                    {/* Left side: flexible container for user info and date */}
                    <View style={styles.userAndDate}>
                        <View style={styles.expenseUser}>
                            <Avatar.Text size={32} label={userInitials} style={styles.avatar} />
                            <Text style={styles.userName}>Added by: {userName}</Text>
                        </View>
                        <Text style={styles.dateText}>
                            Spent at: {expense.spent_at ? format(new Date(expense.spent_at), 'MMM d, yyyy') : ''}
                        </Text>
                    </View>

                    {/* Right side: menu always on top-right */}
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <IconButton
                                icon="dots-vertical"
                                onPress={() => setMenuVisible(true)}
                                style={styles.menuButton}
                            />
                        }
                    >
                        <Menu.Item
                            onPress={() => {
                                setMenuVisible(false);
                                onEdit(expense.id ?? 0);
                            }}
                            title="Edit"
                        />
                        <Menu.Item
                            onPress={() => {
                                setMenuVisible(false);
                                onDelete(expense);
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

const styles = StyleSheet.create({
    expenseCard: { marginBottom: 8, elevation: 1 },
    expenseHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    titleText: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
    categoryText: { fontSize: 14, color: '#666' },
    expenseAmount: { justifyContent: 'center' },
    amountText: { fontSize: 16, fontWeight: 'bold' },
    notesText: { fontSize: 14, color: '#333', marginBottom: 4 },
    optionalText: { fontSize: 12, color: '#666', marginBottom: 2 },
    expenseFooter: {
        flexDirection: 'row',            // left + right
        justifyContent: 'space-between', // push menu to the right
        alignItems: 'flex-start',        // align top
        marginTop: 8,
    },
    userAndDate: {
        flex: 1,                         // take available width
        marginRight: 8,                  // spacing from menu
    },
    expenseUser: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    userName: {
        fontSize: 12,
        color: '#333',
        flexShrink: 1,                   // text will shrink if too long
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
    avatar: { marginRight: 8, backgroundColor: '#6200ee' }
});