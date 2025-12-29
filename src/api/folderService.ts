import { supabase } from "./supabaseClient";
import { EditableFolderInputModel, Folder, FolderMember, FolderStatus, PermissionLevel } from "../types/Folder";
import { handleSupabaseError } from "../utils/handleSupabaseError";
import { folderMemberService } from "./folderMemberService";

export const folderService = {

    async fetchFolders(): Promise<Folder[]> {
        const { data, error } = await supabase
            .from("folders")
            .select("*")
            .neq("status", FolderStatus.Archived)  // <-- filter out archived folders
            .order("updated_at", { ascending: false });

        if (error) handleSupabaseError(error);
        return data || [];
    },

    async fetchFoldersByUserId(userId: string): Promise<Folder[]> {
        const { data: createdFolders, error: err1 } = await supabase
            .from("folders")
            .select("*")
            .eq("created_by", userId)
            .neq("status", FolderStatus.Archived)  // <-- filter out archived
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
                .neq("status", FolderStatus.Archived)  // <-- filter out archived
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


    async fetchFolderDetails(folderId: number): Promise<Folder> {
        const { data, error } = await supabase
            .from("folders")
            .select("*")
            .eq("id", folderId)
            .single();

        if (error) handleSupabaseError(error);
        return data;
    },

    async createFolder(payload: Partial<EditableFolderInputModel>): Promise<Folder> {
        console.log("payload____createFolder", payload);

        // --- CREATE FOLDER ---
        const { data: folderData, error: folderError } = await supabase
            .from("folders")
            .insert(payload)
            .select('*')
            .single();

        if (folderError) {
            handleSupabaseError(folderError); // optional logging
            console.error("Error creating folder:", folderError);
            throw folderError;
        }

        console.log("folderData____createFolder", folderData);

        // --- ADD CREATOR AS FOLDER MEMBER ---
        try {
            if (folderData && payload.created_by) {
                // Get creator user info
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id, email, full_name')
                    .eq('id', payload.created_by)
                    .single();

                if (userError || !userData) {
                    console.error('Error fetching creator info:', userError);
                    // Don't fail folder creation if user lookup fails
                    return folderData;
                }

                await folderMemberService.addMember(
                    folderData.id,
                    userData?.email,
                    PermissionLevel.Contributor,
                    payload.created_by,
                );
            }
        } catch (error) {
            console.error('Error adding creator as folder member:', error);
            // Do not throw, folder creation succeeded
        }

        return folderData;
    },

    async updateFolder(folderId: number, updates: Partial<Folder>): Promise<Folder> {
        const { data, error } = await supabase
            .from("folders")
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq("id", folderId)
            .select()
            .single();

        if (error) handleSupabaseError(error);
        return data;
    },

    async archiveFolder(folderId: number): Promise<boolean> {
        const { error } = await supabase
            .from("folders")
            .update({
                status: FolderStatus.Archived.toString(),
                updated_at: new Date().toISOString()
            })
            .eq("id", folderId);

        if (error) handleSupabaseError(error);
        return true;
    },

    async deleteFolder(folderId: number): Promise<boolean> {
        // First, delete related records in folder_members table
        const { error: membersError } = await supabase
            .from("folder_members")
            .delete()
            .eq("folder_id", folderId);

        if (membersError) handleSupabaseError(membersError);

        // Then delete the folder
        const { error } = await supabase
            .from("folders")
            .delete()
            .eq("id", folderId);

        if (error) handleSupabaseError(error);
        return true;
    }
};
