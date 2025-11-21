import { create } from "zustand";
import { ExpenseGroup, GroupMember, PermissionLevel } from "../types/ExpenseGroup";
import { expenseGroupService } from "../api/expenseGroupService";
import { expenseGroupMemberService } from "../api/expenseGroupMemberService";
import { supabase } from "../api/supabaseClient";

type GroupStore = {
    groups: ExpenseGroup[];
    selectedGroup: ExpenseGroup | null;
    members: GroupMember[];
    loading: boolean;

    fetchGroups: () => Promise<void>;
    fetchGroupDetails: (groupId: number) => Promise<void>;
    createGroup: (data: { name: string; description?: string; visibility: string }) => Promise<void>;
    addMember: (groupId: number, email: string, permissionLevel: PermissionLevel) => Promise<void>;
    deleteGroup: (groupId: number) => Promise<void>;
};

export const useGroupStore = create<GroupStore>((set) => ({
    groups: [],
    selectedGroup: null,
    members: [],
    loading: false,

    fetchGroups: async () => {
        set({ loading: true });
        const groups = await expenseGroupService.getAll();
        set({ groups, loading: false });
    },

    fetchGroupDetails: async (groupId) => {
        set({ loading: true });
        const group = await expenseGroupService.getById(groupId);
        const members = await expenseGroupMemberService.getMembers(groupId);
        set({ selectedGroup: group, members, loading: false });
    },

    createGroup: async ({ name, description, visibility }) => {
        const user = supabase.auth.getUser();

        const createdBy = (await user)?.data.user?.id ?? "";

        await expenseGroupService.createGroup({
            name,
            description,
            visibility: visibility as "Private" | "Public",
            created_by: createdBy
        });

        await useGroupStore.getState().fetchGroups();
    },

    addMember: async (groupId, email, permissionLevel) => {
        const { data: user } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (!user) throw new Error("User not found");

        const currentUser = (await supabase.auth.getUser()).data.user?.id;

        await expenseGroupMemberService.addMember({
            groupId,
            userId: user.id,
            permission_level: permissionLevel,
            created_by: currentUser!
        });

        await useGroupStore.getState().fetchGroupDetails(groupId);
    },

    deleteGroup: async (groupId) => {
        await expenseGroupService.deleteGroup(groupId);
        // Refresh the groups list after deletion
        await useGroupStore.getState().fetchGroups();
    }
}));
