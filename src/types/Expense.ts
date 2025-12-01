export interface Expense {
    id?: number;
    file_id?: number;
    folder_id?: number;

    expense_title: string; // input
    amount: number; // input
    currency: string; // input
    notes: string | null; // input
    spent_at: string; // input
    category: string; // input
    payment_method?: string; // input // Cash
    merchant_name?: string; // input
    location?: string; // input
    paid_by?: string; // input
    tags?: string; // input
    receipt_url?: string; // input
    // status?: string; // input

    created_at?: string;
    created_by: string;
    updated_at?: string;
    updated_by?: string;


    // attachment_urls?: string[];
    // is_reimbursable?: boolean;
    // approved_at?: string;
    // approved_by?: string;
}

export interface ExpenseFilters {
    fileId?: number;
    folderId?: number;
    fromDate?: string;      // YYYY-MM-DD
    toDate?: string;        // YYYY-MM-DD
    category?: string;
    status?: string;
    minAmount?: number;
    maxAmount?: number;
    search?: string;
    sortBy?: 'spent_at' | 'amount' | 'category';
    sortOrder?: 'asc' | 'desc';
}