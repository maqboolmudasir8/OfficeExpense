import { supabase } from "./supabaseClient";
import { ExpenseGroup } from "../types/ExpenseGroup";

export const expenseGroupService = {
    async getAll(): Promise<ExpenseGroup[]> {
        const { data, error } = await supabase
            .from("expense_groups")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as ExpenseGroup[];
    },

    async getById(groupId: number): Promise<ExpenseGroup | null> {
        const { data, error } = await supabase
            .from("expense_groups")
            .select("*")
            .eq("id", groupId)
            .single();

        if (error) throw error;
        return data as ExpenseGroup;
    },

    async createGroup(payload: {
        name: string;
        description?: string;
        visibility: "Private" | "Public";
        created_by: string;
    }) {
        const { data, error } = await supabase
            .from("expense_groups")
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return data as ExpenseGroup;
    },

    async deleteGroup(groupId: number): Promise<void> {
        const { error } = await supabase
            .from("expense_groups")
            .delete()
            .eq("id", groupId);

        if (error) throw error;
    }
};
