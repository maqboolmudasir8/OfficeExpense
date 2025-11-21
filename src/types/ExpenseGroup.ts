
export type ExpenseGroup = {
    id: number;
    name: string;
    description: string | null;
    visibility: "Private" | "Public";
    status: "Active" | "Archived";
    created_at: string;
    created_by: string;
};

export type GroupMember = {
    id: number;
    user_id: string;
    full_name: string;
    permission_level: PermissionLevel;
};

export type PermissionLevel = "Viewer" | "Contributor" | "Editor";
