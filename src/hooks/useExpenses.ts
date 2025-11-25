import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    addExpense,
    deleteExpense,
    fetchExpenseById,
    fetchExpensesByGroupId,
    updateExpense
} from "../api/expenseService";

export function useExpenses(groupId: number) {
    return useQuery({
        queryKey: ["expenses", groupId],
        queryFn: () => fetchExpensesByGroupId(groupId),
    });
}

export function useExpense(expenseId: number) {
    return useQuery({
        queryKey: ["expense", expenseId],
        queryFn: () => fetchExpenseById(expenseId),
    });
}

export function useAddExpense() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: addExpense,
        onSuccess: (data) => {
            client.invalidateQueries({
                queryKey: ["expenses", data.expense_group_id],
            });
        },
    });
}

export function useUpdateExpense() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (input: { id: number; updates: any }) =>
            updateExpense(input.id, input.updates),

        onSuccess: (data) => {
            client.invalidateQueries({
                queryKey: ["expense", data.id],
            });
        },
    });
}

export function useDeleteExpense() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            client.invalidateQueries({
                queryKey: ["expenses"],
            });
        },
    });
}
