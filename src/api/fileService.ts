import { supabase } from './supabaseClient';
import { File, FileMember, CreateFileData, UpdateFileData, FileFilterParams } from '../types/File';
import { PermissionLevel } from '../types/Folder';

export const fileService = {
    // Create a new file
    async createFile(fileData: Omit<CreateFileData, 'id' | 'created_at' | 'updated_at'> & { folder_id: number }): Promise<File> {
        const { data, error } = await supabase
            .from('files')
            .insert([
                {
                    ...fileData,
                    folder_id: fileData.folder_id,
                    status: fileData.status || 'Active',
                },
            ])
            .select('*')
            .single();

        if (error) {
            console.error('Error creating file:', error);
            throw new Error(error.message);
        }

        // Add the creator as an admin member
        if (data) {
            await this.addFileMember(data.id, data.created_by, 'Contributor');
        }

        return data as File;
    },

    // Get a file by ID
    async getFileById(fileId: number): Promise<File> {
        const { data, error } = await supabase
            .from('files')
            // .select('*, created_by_user:user_id(*)')
            .select('*')
            .eq('id', fileId)
            .single();

        if (error) {
            console.error('Error fetching file:', error);
            throw new Error('File not found');
        }

        return data as File;
    },

    // Update a file
    async updateFile(fileId: number, updates: UpdateFileData): Promise<File> {
        const { data, error } = await supabase
            .from('files')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', fileId)
            // .select('*, created_by_user:user_id(*)')
            .select('*')
            .single();

        if (error) {
            console.error('Error updating file:', error);
            throw new Error(error.message);
        }

        return data as File;
    },

    // Delete a file
    async deleteFile(fileId: number): Promise<void> {
        const { error } = await supabase
            .from('files')
            .delete()
            .eq('id', fileId);

        if (error) {
            console.error('Error deleting file:', error);
            throw new Error(error.message);
        }
    },

    // List files with optional filters
    async listFiles(params: FileFilterParams = {}): Promise<File[]> {
        let query = supabase
            .from('files')
            // .select('*, created_by_user:user_id(*)', { count: 'exact' });
            .select('*', { count: 'exact' });

        if (params.folder_id !== undefined) {
            query = query.eq('folder_id', params.folder_id);
        }

        if (params.status) {
            query = query.eq('status', params.status);
        }

        if (params.search) {
            query = query.ilike('title', `%${params.search}%`);
        }

        if (params.created_by) {
            query = query.eq('created_by', params.created_by);
        }

        // Pagination
        const page = params.page || 1;
        const limit = params.limit || 10;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        query = query.range(from, to).order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
            console.error('Error listing files:', error);
            throw new Error(error.message);
        }

        return data as File[];
    },

    // Add a member to a file
    async addFileMember(
        fileId: number,
        userId: string,
        permissionLevel: PermissionLevel = 'Viewer'
    ): Promise<FileMember> {
        const { data, error } = await supabase
            .from('file_members')
            .insert([
                {
                    file_id: fileId,
                    user_id: userId,
                    permission_level: permissionLevel,
                },
            ])
            // .select('*, user:user_id(*)')
            .select('*')
            .single();

        if (error) {
            console.error('Error adding file member:', error);
            throw new Error(error.message);
        }

        return data as FileMember;
    },

    // Update file member permissions
    async updateFileMember(
        fileId: number,
        userId: string,
        permissionLevel: PermissionLevel
    ): Promise<FileMember> {
        const { data, error } = await supabase
            .from('file_members')
            .update({ permission_level: permissionLevel })
            .eq('file_id', fileId)
            .eq('user_id', userId)
            .select('*, user:user_id(*)')
            .single();

        if (error) {
            console.error('Error updating file member:', error);
            throw new Error(error.message);
        }

        return data as FileMember;
    },

    // Remove a member from a file
    async removeFileMember(fileId: number, userId: string): Promise<void> {
        const { error } = await supabase
            .from('file_members')
            .delete()
            .eq('file_id', fileId)
            .eq('user_id', userId);

        if (error) {
            console.error('Error removing file member:', error);
            throw new Error(error.message);
        }
    },

    // List all members of a file
    async listFileMembers(fileId: number): Promise<FileMember[]> {
        const { data, error } = await supabase
            .from('file_members')
            // .select('*, user:user_id(*)')
            .select('*')
            .eq('file_id', fileId);

        if (error) {
            console.error('Error listing file members:', error);
            throw new Error(error.message);
        }

        return data as FileMember[];
    },

    // Check user permissions for a file
    async checkUserPermission(
        fileId: number,
        userId: string
    ): Promise<{ permission: PermissionLevel | null }> {
        const { data, error } = await supabase
            .from('file_members')
            .select('permission_level')
            .eq('file_id', fileId)
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            return { permission: null };
        }

        return { permission: data.permission_level as PermissionLevel };
    },
};
