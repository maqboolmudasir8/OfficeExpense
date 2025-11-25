// types/Folder.ts

import { User } from "@supabase/supabase-js";

export type FolderVisibility = "Private" | "Public";
export type FolderStatus = "Active" | "Archived";
export type PermissionLevel = "Viewer" | "Contributor" | "Editor";

export interface Folder {
    id: number;
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