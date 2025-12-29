import { PermissionLevel } from './Folder';
import { SupabaseUser } from './User';

export enum FileStatus {
    Active = "Active",
    Archived = "Archived"
}

export enum FileVisibility {
    Private = "Private",
    Public = "Public"
};

// export type PermissionLevel = 'view' | 'edit' | 'admin';

export interface File {
    id?: number;
    folder_id: number;
    title: string;
    description?: string;
    status?: FileStatus;
    visibility?: FileVisibility;

    created_at?: string;
    created_by?: string;
    updated_at?: string;
    updated_by?: string;
}

export interface FileMember {
    id: number;
    file_id: number;
    user_id: string;
    permission_level: PermissionLevel;
    created_at: string;
    updated_at: string;
    user: SupabaseUser;
}

export interface FilePermission {
    can_view: boolean;
    can_edit: boolean;
    can_delete: boolean;
    can_manage_members: boolean;
}

// export interface CreateFileData {
//     title: string;
//     description?: string;
//     folder_id: number;

//     // file_size?: number;
//     // file_url?: string;
//     status?: FileStatus;

//     created_at: string;
//     created_by: string;
// }

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


export const statusOptions = [
    { label: "Active", value: FileStatus.Active.toString() },
    { label: "Archived", value: FileStatus.Archived.toString() },
];

export const visibilityOptions = [
    { label: "Public", value: FileVisibility.Public.toString() },
    { label: "Private", value: FileVisibility.Private.toString() },
];