// src/api/expenseGroupService.ts
import { supabase } from "./supabaseClient";
import { Folder } from "../types/Folder";

export const expenseGroupService = {
    async getAll(): Promise<Folder[]> {
        const { data, error } = await supabase
            .from("folders")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Folder[];
    },

    async getById(folderId: number): Promise<Folder | null> {
        const { data, error } = await supabase
            .from("folders")
            .select(`
                *,
                folder_members:folder_members(
                    user_id,
                    permission_level
                )
            `)
            .eq("id", folderId)
            .single();

        if (error) throw error;
        return data as Folder;
    },

    async createGroup(payload: {
        title: string;
        description?: string;
        visibility: "Private" | "Public";
        color_code?: string;
        icon?: string;
        created_by: string;
    }) {
        const { data, error } = await supabase
            .from("folders")
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return data as Folder;
    },

    async updateGroup(
        folderId: number,
        updates: {
            title?: string;
            description?: string;
            status?: 'Active' | 'Archived';
            visibility?: 'Private' | 'Public';
            color_code?: string;
            icon?: string;
            updated_by: string;
        }
    ) {
        const { data, error } = await supabase
            .from("folders")
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq("id", folderId)
            .select()
            .single();

        if (error) throw error;
        return data as Folder;
    },

    async deleteGroup(folderId: number): Promise<void> {
        const { error } = await supabase
            .from("folders")
            .update({
                status: 'Archived',
                updated_at: new Date().toISOString()
            })
            .eq("id", folderId);

        if (error) throw error;
    }
};