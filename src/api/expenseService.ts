// expenseService.ts
import { Expense, ExpenseFilters } from "../types/Expense";
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
            file_id: expense?.file_id,
            folder_id: expense?.folder_id,
            amount: expense?.amount,
            category: expense?.category,
            // created_at: expense.created_at,
            created_by: expense?.created_by,
            currency: expense?.currency,
            expense_title: expense?.expense_title,
            location: expense?.location,
            merchant_name: expense?.merchant_name,
            notes: expense?.notes,
            paid_by: expense?.paid_by,
            payment_method: expense?.payment_method,
            receipt_url: expense?.receipt_url,
            spent_at: expense?.spent_at,
            tags: expense?.tags,
            // status: expense.status,
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
    console.log("expense___updateExpense", expenseId, updates);
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

// export async function getExpenseSummary(fileId: number) {
//     const { data, error } = await supabase
//         .rpc('get_expense_summary', { file_id: fileId });

//     if (error) throw error;
//     return data;
// }

export async function fetchExpenseSummary(fileId: number) {
    const { data, error } = await supabase
        .rpc("expense_summary", { file_id_input: fileId });

    if (error) throw error;
    return data;
}

// export async function fetchCategoryBreakdown(fileId: number) {
//     const { data, error } = await supabase
//         .from("expenses")
//         .select("category, total:sum(amount)")
//         .eq("file_id", fileId)
//         .group("category");

//     if (error) throw error;
//     return data;
// }

export async function fetchMonthlyTotals(fileId: number) {
    const { data, error } = await supabase
        .from("expenses")
        .select("spent_at, amount")
        .eq("file_id", fileId)
        .order("spent_at", { ascending: true });

    if (error) throw error;
    return data;
}





export async function fetchFilteredExpenses(filters: ExpenseFilters) {
    console.log("filters___fetchFilteredExpenses", filters);

    let query = supabase.from("expenses").select("*");

    if (filters.fileId && filters.fileId > 0)
        query = query.eq("file_id", filters.fileId);

    if (filters.folderId)
        query = query.eq("folder_id", filters.folderId);

    if (filters.fromDate)
        query = query.gte("spent_at", filters.fromDate);

    if (filters.toDate)
        query = query.lte("spent_at", filters.toDate);

    if (filters.category)
        query = query.eq("category", filters.category);

    if (filters.status)
        query = query.eq("status", filters.status);

    if (filters.minAmount)
        query = query.gte("amount", filters.minAmount);

    if (filters.maxAmount)
        query = query.lte("amount", filters.maxAmount);

    // Multi-field search
    if (filters.search) {
        query = query.or(
            `notes.ilike.%${filters.search}%,expense_title.ilike.%${filters.search}%`
        );
    }

    if (filters.sortBy)
        query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });

    const { data, error } = await query;
    if (error) throw error;
    return data;
}