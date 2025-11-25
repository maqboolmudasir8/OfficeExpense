export interface Expense {
    id?: number;
    amount: number;
    currency: string;
    notes: string | null;
    spent_at: string;
    category: string;

    // category_id: number | null;
    file_id: number;
    created_by: string;
    created_at?: string;
    updated_at?: string;

}