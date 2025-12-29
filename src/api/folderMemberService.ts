// src/api/folderMemberService.ts
import { supabase } from "./supabaseClient";
import { FolderMember, PermissionLevel } from "../types/Folder";

export const folderMemberService = {
    fetchMembers: async (folderId: number): Promise<FolderMember[]> => {
        const { data, error } = await supabase
            .from('folder_members')
            // .select('*, user:user_id (id, email, full_name)')
            .select('*')
            .eq('folder_id', folderId);

        console.log("error___folderMemberService", error);
        if (error) throw error;

        return data.map(member => ({
            ...member,
            user_id: member.user_id,
            user_email: member.user?.email,
            user_name: member.user?.full_name || member.user?.email?.split('@')[0],
            permission_level: member.permission_level,
        }));
    },

    addMember: async (folderId: number, email: string, permission: PermissionLevel, creatorId: string): Promise<FolderMember> => {
        // First get user by email
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, full_name')
            .eq('email', email)
            .single();

        if (userError || !userData) {
            throw new Error('User not found');
        }

        // Check if already a member
        const { data: existingMember } = await supabase
            .from('folder_members')
            .select('*')
            .eq('folder_id', folderId)
            .eq('user_id', userData.id)
            .single();

        if (existingMember) {
            throw new Error('User is already a member of this folder');
        }

        // Add member
        const { data, error } = await supabase
            .from('folder_members')
            .insert({
                folder_id: folderId,
                user_id: userData.id,
                permission_level: permission.toString(),
                assigned_by: creatorId, // NOT NULL
                created_by: creatorId,  // NOT NULL
            })
            .select('*')
            .single();

        if (error) throw error;

        return {
            ...data,
            user_email: userData.email,
            user_name: userData.full_name || userData.email.split('@')[0],
        };
    },

    updateMemberPermission: async (
        folderId: number,
        userId: string,
        permission: PermissionLevel
    ): Promise<FolderMember> => {
        const { data, error } = await supabase
            .from('folder_members')
            .update({ permission_level: permission })
            .eq('folder_id', folderId)
            .eq('user_id', userId)
            .select('*, user:user_id (id, email, full_name)')
            .single();

        if (error) throw error;

        return {
            ...data,
            user_email: data.user?.email,
            user_name: data.user?.full_name || data.user?.email?.split('@')[0],
        };
    },

    removeMember: async (folderId: number, userId: string): Promise<void> => {
        const { error } = await supabase
            .from('folder_members')
            .delete()
            .eq('folder_id', folderId)
            .eq('user_id', userId);

        if (error) throw error;
    }
};