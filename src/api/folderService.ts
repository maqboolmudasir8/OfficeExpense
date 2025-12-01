import { supabase } from "./supabaseClient";
import { Folder, FolderMember, PermissionLevel } from "../types/Folder";
import { handleSupabaseError } from "../utils/handleSupabaseError";
import { folderMemberService } from "./folderMemberService";

export const folderService = {

    async fetchGroups(): Promise<Folder[]> {
        const { data, error } = await supabase
            .from("folders")
            .select("*")
            .order("updated_at", { ascending: false });

        if (error) handleSupabaseError(error);
        return data || [];
    },

    async fetchGroupsByUserId(userId: string): Promise<Folder[]> {
        const { data: createdFolders, error: err1 } = await supabase
            .from("folders")
            .select("*")
            .eq("created_by", userId)
            .order("updated_at", { ascending: false });

        if (err1) handleSupabaseError(err1);

        const { data: memberFolders, error: err2 } = await supabase
            .from("folder_members")
            .select("folder_id")
            .eq("user_id", userId);

        if (err2) handleSupabaseError(err2);

        const folderIds = memberFolders?.map(f => f.folder_id) || [];

        let memberFoldersData: Folder[] = [];
        if (folderIds.length > 0) {
            const { data: fData, error: err3 } = await supabase
                .from("folders")
                .select("*")
                .in("id", folderIds)
                .order("updated_at", { ascending: false });

            if (err3) handleSupabaseError(err3);
            memberFoldersData = fData || [];
        }

        const foldersMap = new Map<number, Folder>();

        [...(createdFolders || []), ...memberFoldersData].forEach(f => {
            foldersMap.set(f.id, f);
        });

        return Array.from(foldersMap.values());
    },


    async fetchGroupDetails(groupId: number): Promise<Folder> {
        const { data, error } = await supabase
            .from("folders")
            .select("*")
            .eq("id", groupId)
            .single();

        if (error) handleSupabaseError(error);
        return data;
    },

    async createGroup(payload: Partial<Folder>): Promise<Folder> {
        // Create the folder
        const { data, error } = await supabase
            .from("folders")
            .insert(payload)
            .select()
            .single();

        if (error) handleSupabaseError(error);

        // Add the creator as an admin member of the folder
        try {
            if (data && payload.created_by) {
                await folderMemberService.addMember(
                    data.id,
                    payload.created_by,
                    'Contributor' as PermissionLevel
                );
            }
        } catch (error) {
            console.error('Error adding creator as folder member:', error);
            // Don't fail the whole operation if adding member fails
        }

        return data;
    },

    async updateGroup(groupId: number, updates: Partial<Folder>): Promise<Folder> {
        const { data, error } = await supabase
            .from("folders")
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq("id", groupId)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data;
    },

    async archiveGroup(groupId: number): Promise<boolean> {
        const { error } = await supabase
            .from("folders")
            .update({
                status: "Archived",
                updated_at: new Date().toISOString()
            })
            .eq("id", groupId);

        if (error) handleSupabaseError(error);
        return true;
    },

    async deleteGroup(groupId: number): Promise<boolean> {
        // First, delete related records in folder_members table
        const { error: membersError } = await supabase
            .from("folder_members")
            .delete()
            .eq("folder_id", groupId);

        if (membersError) handleSupabaseError(membersError);

        // Then delete the folder
        const { error } = await supabase
            .from("folders")
            .delete()
            .eq("id", groupId);

        if (error) handleSupabaseError(error);
        return true;
    }
};
