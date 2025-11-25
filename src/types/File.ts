import { PermissionLevel } from './Folder';
import { User } from './User';

export type FileStatus = 'Active' | 'Archived';
// export type PermissionLevel = 'view' | 'edit' | 'admin';

export interface File {
    id: number;
    folder_id: number;
    title: string;
    description?: string;
    file_type: string;
    file_size?: number;
    file_url?: string;
    status: FileStatus;
    created_at: string;
    created_by: string;
    updated_at: string;
    created_by_user?: User;
}

export interface FileMember {
    id: number;
    file_id: number;
    user_id: string;
    permission_level: PermissionLevel;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface FilePermission {
    can_view: boolean;
    can_edit: boolean;
    can_delete: boolean;
    can_manage_members: boolean;
}

export interface CreateFileData {
    title: string;
    description?: string;
    folder_id: number;
    
    file_size?: number;
    file_url?: string;
    status?: FileStatus;

    created_at: string;
    created_by: string;
}

export interface UpdateFileData {
    title?: string;
    description?: string;
    status?: FileStatus;
}

export interface FileFilterParams {
    folder_id?: number;
    status?: FileStatus;
    search?: string;
    created_by?: string;
    page?: number;
    limit?: number;
}

// Export types properly for isolated modules
// export type { File as default };