// components/expenses/FilterBottomSheet.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
    Button,
    Text,
    TextInput,
    IconButton,
    useTheme,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ExpenseFilters } from "../../../types/Expense";


interface ExpensesFilterBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onApplyFilters: (filters: ExpenseFilters) => void;
}

export const ExpensesFilterBottomSheet: React.FC<ExpensesFilterBottomSheetProps> = ({ visible, onClose, onApplyFilters }) => {
    const theme = useTheme();

    const [filters, setFilters] = useState<ExpenseFilters>({
        sortBy: "spent_at",
        sortOrder: "desc",
    });

    const [showFromDate, setShowFromDate] = useState(false);
    const [showToDate, setShowToDate] = useState(false);

    const handleDateChange = (field: "fromDate" | "toDate", event: any, date?: Date) => {
        if (date) {
            setFilters((prev) => ({
                ...prev,
                [field]: date.toISOString().split("T")[0],
            }));
        }
        field === "fromDate" ? setShowFromDate(false) : setShowToDate(false);
    };

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <View style={styles.sheet}>

                {/* Header */}
                <View style={styles.header}>
                    <Text variant="titleMedium">Filters</Text>
                    <IconButton icon="close" onPress={onClose} />
                </View>

                {/* Date Range */}
                <Text variant="labelMedium">Date Range</Text>
                <View style={styles.row}>
                    <Button mode="outlined" onPress={() => setShowFromDate(true)}>
                        {filters.fromDate || "From Date"}
                    </Button>
                    <Button mode="outlined" onPress={() => setShowToDate(true)}>
                        {filters.toDate || "To Date"}
                    </Button>
                </View>

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

                {/* Category */}
                <Text variant="labelMedium" style={{ marginTop: 12 }}>
                    Category
                </Text>
                <TextInput
                    mode="outlined"
                    placeholder="e.g., Food, Travel"
                    value={filters.category}
                    onChangeText={(val) =>
                        setFilters((prev) => ({ ...prev, category: val }))
                    }
                />

                {/* Status */}
                <Text variant="labelMedium" style={{ marginTop: 12 }}>
                    Status
                </Text>
                <TextInput
                    mode="outlined"
                    placeholder="e.g., Paid, Pending"
                    value={filters.status}
                    onChangeText={(val) =>
                        setFilters((prev) => ({ ...prev, status: val }))
                    }
                />

                {/* Amount Range */}
                <View style={styles.row}>
                    <TextInput
                        label="Min Amount"
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.amountInput}
                        value={filters.minAmount?.toString()}
                        onChangeText={(t) =>
                            setFilters((prev) => ({
                                ...prev,
                                minAmount: t ? parseFloat(t) : undefined,
                            }))
                        }
                    />
                    <TextInput
                        label="Max Amount"
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.amountInput}
                        value={filters.maxAmount?.toString()}
                        onChangeText={(t) =>
                            setFilters((prev) => ({
                                ...prev,
                                maxAmount: t ? parseFloat(t) : undefined,
                            }))
                        }
                    />
                </View>

                {/* Sorting */}
                <Text variant="labelMedium" style={{ marginTop: 12 }}>
                    Sort By
                </Text>
                <View style={styles.row}>
                    <Button
                        mode={filters.sortBy === "spent_at" ? "contained" : "outlined"}
                        onPress={() => setFilters({ ...filters, sortBy: "spent_at" })}
                    >
                        Date
                    </Button>
                    <Button
                        mode={filters.sortBy === "amount" ? "contained" : "outlined"}
                        onPress={() => setFilters({ ...filters, sortBy: "amount" })}
                    >
                        Amount
                    </Button>
                    <Button
                        mode={filters.sortBy === "category" ? "contained" : "outlined"}
                        onPress={() => setFilters({ ...filters, sortBy: "category" })}
                    >
                        Category
                    </Button>
                </View>

                <View style={styles.row}>
                    <Button
                        mode={filters.sortOrder === "asc" ? "contained" : "outlined"}
                        onPress={() => setFilters({ ...filters, sortOrder: "asc" })}
                    >
                        Asc
                    </Button>
                    <Button
                        mode={filters.sortOrder === "desc" ? "contained" : "outlined"}
                        onPress={() => setFilters({ ...filters, sortOrder: "desc" })}
                    >
                        Desc
                    </Button>
                </View>

                {/* Apply & Clear */}
                <View style={styles.footer}>
                    <Button mode="text" onPress={() => setFilters({})}>
                        Clear
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => {
                            onApplyFilters(filters);
                            onClose();
                        }}
                    >
                        Apply
                    </Button>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: "white",
        padding: 16,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        elevation: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    amountInput: {
        flex: 1,
        marginRight: 6,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 20,
        gap: 12,
    },
});