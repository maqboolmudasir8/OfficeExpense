import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Icon, Button, Text, useTheme, Portal, Divider } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { ExpenseFilters } from '../../../types/Expense';
import { EXPENSE_CATEGORIES } from '../../../constants/expenseOptions';
import { format } from 'date-fns';
import { TextInput } from '../../../components/TextInput';
import { theme } from '../../../theme';

interface ExpensesFilterBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onApplyFilters: (filters: ExpenseFilters) => void;
}

export const ExpensesFilterBottomSheet: React.FC<ExpensesFilterBottomSheetProps> = ({
    visible,
    onClose,
    onApplyFilters
}) => {
    const theme = useTheme();
    const [filters, setFilters] = useState<ExpenseFilters>({
        sortBy: 'spent_at',
        sortOrder: 'desc',
    });
    const [showFromDate, setShowFromDate] = useState(false);
    const [showToDate, setShowToDate] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);

    const handleDateChange = (field: "fromDate" | "toDate", event: DateTimePickerEvent, date?: Date) => {
        if (event.type === 'dismissed') {
            field === "fromDate" ? setShowFromDate(false) : setShowToDate(false);
            return;
        }

        if (date) {
            setFilters(prev => ({
                ...prev,
                [field]: date.toISOString().split("T")[0],
            }));
        }
        field === "fromDate" ? setShowFromDate(false) : setShowToDate(false);
    };

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        setFilters({
            sortBy: 'spent_at',
            sortOrder: 'desc',
            fromDate: undefined,
            toDate: undefined,
            category: undefined,
            minAmount: undefined,
            maxAmount: undefined
        });
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}
                onRequestClose={onClose}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>

                <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
                    <View style={styles.header}>
                        <Text variant="titleMedium" style={styles.title}>
                            Filter Expenses
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon source="close" size={24} color={theme.colors.onSurface} />
                        </TouchableOpacity>
                    </View>
                    <Divider />

                    <View style={styles.content}>
                        {/* Date Range */}
                        <View style={styles.section}>
                            <Text variant="labelLarge" style={styles.sectionTitle}>Date Range</Text>
                            <View style={styles.row}>
                                <TouchableOpacity
                                    style={[
                                        styles.dateButton,
                                        filters.fromDate && styles.dateButtonActive
                                    ]}
                                    onPress={() => setShowFromDate(true)}
                                >
                                    <Icon
                                        source="calendar"
                                        size={16}
                                        color={filters.fromDate ? theme.colors.primary : theme.colors.onSurfaceVariant}
                                    />
                                    <Text style={[
                                        styles.dateButtonText,
                                        { color: filters.fromDate ? theme.colors.primary : theme.colors.onSurfaceVariant }
                                    ]}>
                                        {filters.fromDate ? format(new Date(filters.fromDate), 'MMM d, yyyy') : 'Start Date'}
                                    </Text>
                                </TouchableOpacity>

                                <View style={styles.dateSeparator}>
                                    <Text style={styles.dateSeparatorText}>to</Text>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.dateButton,
                                        filters.toDate && styles.dateButtonActive
                                    ]}
                                    onPress={() => setShowToDate(true)}
                                >
                                    <Icon
                                        source="calendar"
                                        size={16}
                                        color={filters.toDate ? theme.colors.primary : theme.colors.onSurfaceVariant}
                                    />
                                    <Text style={[
                                        styles.dateButtonText,
                                        { color: filters.toDate ? theme.colors.primary : theme.colors.onSurfaceVariant }
                                    ]}>
                                        {filters.toDate ? format(new Date(filters.toDate), 'MMM d, yyyy') : 'End Date'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Category */}
                        <View style={styles.section}>
                            <Text variant="labelLarge" style={styles.sectionTitle}>Category</Text>
                            <TouchableOpacity
                                style={[
                                    styles.categoryButton,
                                    filters.category && styles.categoryButtonActive
                                ]}
                                onPress={() => setShowCategoryPicker(true)}
                            >
                                <Text style={[
                                    styles.categoryButtonText,
                                    { color: filters.category ? theme.colors.primary : theme.colors.onSurfaceVariant }
                                ]}>
                                    {filters.category || 'Select Category'}
                                </Text>
                                <Icon
                                    source="chevron-down"
                                    size={20}
                                    color={filters.category ? theme.colors.primary : theme.colors.onSurfaceVariant}
                                />
                            </TouchableOpacity>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Amount Range */}
                        <View style={styles.section}>
                            <Text variant="labelLarge" style={styles.sectionTitle}>Amount Range</Text>
                            <View style={styles.amountRow}>
                                <View style={styles.amountInputContainer}>
                                    <TextInput
                                        mode="outlined"
                                        label="Min"
                                        prefix="$"
                                        keyboardType="numeric"
                                        value={filters.minAmount?.toString() ?? ''}
                                        onChangeText={(t) =>
                                            setFilters(prev => ({
                                                ...prev,
                                                minAmount: t ? parseFloat(t) : undefined,
                                            }))
                                        }
                                        style={styles.amountInput}
                                    />
                                </View>

                                <View style={styles.amountSeparator} />

                                <View style={styles.amountInputContainer}>
                                    <TextInput
                                        mode="outlined"
                                        label="Max"
                                        prefix="$"
                                        keyboardType="numeric"
                                        value={filters.maxAmount?.toString() ?? ''}
                                        onChangeText={(t) =>
                                            setFilters(prev => ({
                                                ...prev,
                                                maxAmount: t ? parseFloat(t) : undefined,
                                            }))
                                        }
                                        style={styles.amountInput}
                                    />
                                </View>
                            </View>
                        </View>

                        <Divider style={styles.divider} />

                        {/* Sort By */}
                        <View style={styles.section}>
                            <Text variant="labelLarge" style={styles.sectionTitle}>Sort By</Text>
                            <View style={styles.sortOptions}>
                                {[
                                    { key: 'spent_at', icon: 'calendar' },
                                    { key: 'amount', icon: 'currency-usd' },
                                    { key: 'category', icon: 'tag-outline' }
                                ].map(({ key, icon }) => {
                                    const isActive = filters.sortBy === key;
                                    const isAsc = filters.sortOrder === 'asc';

                                    return (
                                        <TouchableOpacity
                                            key={key}
                                            style={[
                                                styles.sortOption,
                                                isActive && styles.sortOptionActive
                                            ]}
                                            onPress={() => {
                                                // Toggle sort order if clicking the same field, otherwise default to 'desc'
                                                const newOrder = isActive
                                                    ? (isAsc ? 'desc' : 'asc')
                                                    : 'desc';

                                                setFilters(prev => ({
                                                    ...prev,
                                                    sortBy: key as 'spent_at' | 'amount' | 'category',
                                                    sortOrder: newOrder
                                                }));
                                            }}
                                        >
                                            <Icon
                                                source={icon}
                                                size={24}
                                                color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant}
                                            />
                                            <View style={styles.sortOrderIndicator}>
                                                {isActive && (
                                                    <Icon
                                                        source={isAsc ? 'arrow-up' : 'arrow-down'}
                                                        size={16}
                                                        color={theme.colors.primary}
                                                    />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.footer}>
                        <Button
                            mode="outlined"
                            onPress={handleReset}
                            style={styles.resetButton}
                            labelStyle={{ color: theme.colors.primary }}
                        >
                            Reset
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleApply}
                            style={styles.applyButton}
                            labelStyle={{ color: theme.colors.onPrimary }}
                        >
                            Apply Filters
                        </Button>
                    </View>

                    {/* Date Pickers */}
                    {showFromDate && (
                        <DateTimePicker
                            value={filters.fromDate ? new Date(filters.fromDate) : new Date()}
                            mode="date"
                            onChange={(e, d) => handleDateChange("fromDate", e, d)}
                        />
                    )}

                    {showToDate && (
                        <DateTimePicker
                            value={filters.toDate ? new Date(filters.toDate) : new Date()}
                            mode="date"
                            onChange={(e, d) => handleDateChange("toDate", e, d)}
                        />
                    )}

                    {/* Category Picker Modal */}
                    <Portal>
                        <Modal
                            visible={showCategoryPicker}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setShowCategoryPicker(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={[
                                    styles.modalContent,
                                    { backgroundColor: theme.colors.surface }
                                ]}>
                                    <View style={styles.modalHeader}>
                                        <Text variant="titleMedium">Select Category</Text>
                                        <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                                            <Icon
                                                source="close"
                                                size={24}
                                                color={theme.colors.onSurface}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <Divider />
                                    <View style={styles.categoryList}>
                                        {EXPENSE_CATEGORIES.map((category) => (
                                            <TouchableOpacity
                                                key={category.value}
                                                style={[
                                                    styles.categoryItem,
                                                    filters.category === category.value && styles.categoryItemActive
                                                ]}
                                                onPress={() => {
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        category: category.value
                                                    }));
                                                    setShowCategoryPicker(false);
                                                }}
                                            >
                                                <Text
                                                    style={[
                                                        styles.categoryItemText,
                                                        {
                                                            color: filters.category === category.value
                                                                ? theme.colors.primary
                                                                : theme.colors.onSurface
                                                        }
                                                    ]}
                                                >
                                                    {category.label}
                                                </Text>
                                                {filters.category === category.value && (
                                                    <Icon
                                                        source="check"
                                                        size={20}
                                                        color={theme.colors.primary}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </Portal>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '85%',
        paddingBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontWeight: '600',
    },
    closeButton: {
        padding: 8,
        marginRight: -8,
    },
    content: {
        paddingHorizontal: 12,
        paddingBottom: 12,
        maxHeight: '80%',
        paddingTop: 8,
    },
    section: {
        marginVertical: 8,
    },
    sectionTitle: {
        marginBottom: 8,
        color: '#666',
        fontSize: 13,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    dateButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dateButtonActive: {
        borderColor: '#6200ee',
        backgroundColor: '#f3e5ff',
    },
    dateButtonText: {
        marginLeft: 6,
        fontSize: 13,
    },
    dateSeparator: {
        paddingHorizontal: 8,
    },
    dateSeparatorText: {
        color: '#666',
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    categoryButtonActive: {
        borderColor: '#6200ee',
        backgroundColor: '#f3e5ff',
    },
    categoryButtonText: {
        fontSize: 13,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    amountInputContainer: {
        flex: 1,
    },
    amountLabel: {
        marginBottom: 4,
        color: '#666',
    },
    amountInput: {
        backgroundColor: 'transparent',
    },
    currencySymbol: {
        fontSize: 16,
        color: '#666',
        marginRight: 4,
    },
    amountTextInput: {
        flex: 1,
        fontSize: 16,
        padding: 0,
        margin: 0,
    },
    amountSeparator: {
        width: 16,
    },
    sortOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    sortOption: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    sortOptionActive: {
        backgroundColor: theme.colors.primaryContainer,
    },
    sortOrderIndicator: {
        marginTop: 4,
    },
    sortOptionText: {
        marginTop: 2,
        fontSize: 11,
    },
    sortOrder: {
        flexDirection: 'row',
        borderRadius: 8,
        overflow: 'hidden',
    },
    sortOrderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
    },
    sortOrderButtonActive: {
        backgroundColor: '#f3e5ff',
    },
    sortOrderText: {
        marginLeft: 2,
        fontSize: 11,
    },
    divider: {
        marginVertical: 8,
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.surfaceVariant,
    },
    resetButton: {
        flex: 1,
        marginRight: 8,
        borderColor: '#6200ee',
    },
    applyButton: {
        flex: 2,
        backgroundColor: '#6200ee',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        borderRadius: 12,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    categoryList: {
        maxHeight: 300,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    categoryItemActive: {
        backgroundColor: '#f5f5f5',
    },
    categoryItemText: {
        fontSize: 13,
    },
    icon: {
        marginRight: 8,
    },
});