import { supabase } from "./supabaseClient";
import { GroupMember } from "../types/ExpenseGroup";

export const expenseGroupMemberService = {
    async getMembers(groupId: number): Promise<GroupMember[]> {
        const { data, error } = await supabase
            .from("expense_group_members")
            .select(`
        id,
        user_id,
        permission_level
      `)
            .eq("expense_group_id", groupId);

        if (error) throw error;

        // Fetch user info manually (since we removed FK)
        const enriched = await Promise.all(
            data.map(async (m) => {
                const { data: user } = await supabase
                    .from("users")
                    .select("full_name")
                    .eq("id", m.user_id)
                    .single();

                return {
                    ...m,
                    full_name: user?.full_name ?? "Unknown"
                } as GroupMember;
            })
        );

        return enriched;
    },

    async addMember(payload: {
        groupId: number;
        userId: string;
        permission_level: "Viewer" | "Contributor" | "Editor";
        created_by: string;
    }) {
        const { data, error } = await supabase
            .from("expense_group_members")
            .insert({
                expense_group_id: payload.groupId,
                user_id: payload.userId,
                permission_level: payload.permission_level,
                created_by: payload.created_by
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
