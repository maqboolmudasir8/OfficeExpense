export interface Expense {
    id: number;
    amount: number;
    currency: string;
    notes: string | null;
    spent_at: string;
    category_id: number | null;
}