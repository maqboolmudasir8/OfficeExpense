// types/Folder.ts

import { User } from "@supabase/supabase-js";

export enum FolderVisibility {
    Private = "Private",
    Public = "Public"
};

export enum FolderStatus {
    Active = "Active",
    Archived = "Archived"
}

export enum PermissionLevel {
    Viewer = "Viewer",
    Contributor = "Contributor",
    Editor = "Editor",
}

export interface Folder {
    id?: string;
    title: string;
    description?: string | null;
    visibility: FolderVisibility;
    color_code?: string | null;
    icon?: string | null;
    status: FolderStatus;
    created_by: string;
    updated_by?: string | null;
    created_at: string;
    updated_at: string;
}

export interface FolderMember {
    id: number;
    folder_id: number;
    user_id: string;
    user_email?: string;
    user_name?: string;
    permission_level: PermissionLevel;
    assigned_at: string;
    assigned_by: string;
    created_at: string;
    created_by: string;
    updated_at?: string;
    updated_by?: string;
    user?: User;
}

export interface EditableFolderInputModel {
    id?: string;
    title: string;
    description?: string | null;
    visibility?: string;
    color_code?: string | null;
    icon?: string | null;
    status: string;
    created_at?: string;
    created_by?: string;
}