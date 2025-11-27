// expenseService.ts
import { Expense } from "../types/Expense";
import { supabase } from "./supabaseClient";


export async function fetchExpenses() {
    const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("spent_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function fetchExpensesByFileId(fileId: number) {
    const { data, error } = await supabase
        .from("expenses")
        // .select(`*, profiles:created_by (id, full_name, avatar_url)`)
        .select(`*`)
        .eq("file_id", fileId)
        .order("spent_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function fetchExpenseById(expenseId: number) {
    const { data, error } = await supabase
        .from("expenses")
        // .select(` *, profiles:created_by (id, full_name, avatar_url)`)
        .select(` *`)
        .eq("id", expenseId)
        .single();

    if (error) throw error;
    return data;
}

export async function addExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) {
    console.log("expense___addExpense", expense);

    const { data, error } = await supabase
        .from('expenses')
        .insert({
            file_id: expense.file_id,
            folder_id: expense.folder_id,
            expense_title: expense.expense_title,
            amount: expense.amount,
            currency: expense.currency,
            notes: expense.notes,
            spent_at: expense.spent_at,
            category: expense.category,
            payment_method: expense.payment_method,
            merchant_name: expense.merchant_name,
            location: expense.location,
            paid_by: expense.paid_by,
            tags: expense.tags,
            receipt_url: expense.receipt_url,
            // status: expense.status,
            created_by: expense.created_by,
            // created_at: expense.created_at,
            // attachment_urls: expense.attachment_urls,
            // is_reimbursable: expense.is_reimbursable,
            // approved_at: expense.approved_at,
            // approved_by: expense.approved_by,
        })
        .select('*')
        .single();

    if (error) throw error;
    return data;
}

export async function updateExpense(expenseId: number, updates: Partial<Expense>) {
    const { data, error } = await supabase
        .from("expenses")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", expenseId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteExpense(expenseId: number) {
    const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", expenseId);

    if (error) throw error;
    return true;
}

export async function getExpenseSummary(fileId: number) {
    const { data, error } = await supabase
        .rpc('get_expense_summary', { file_id: fileId });

    if (error) throw error;
    return data;
}


