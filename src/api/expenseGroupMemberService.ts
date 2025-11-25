import { supabase } from "./supabaseClient";
import { handleSupabaseError } from "../utils/handleSupabaseError";
import { PermissionLevel } from "../types/Folder";

export const memberService = {
    async addMember(groupId: number, email: string, permission: PermissionLevel) {
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (userError) handleSupabaseError(userError);
        if (!user) throw new Error("User not found");

        const currentUser = (await supabase.auth.getUser()).data.user?.id;

        const { error: insertError } = await supabase
            .from("folder_members")
            .insert({
                folder_id: groupId,
                user_id: user.id,
                permission_level: permission,
                created_by: currentUser!
            });

        if (insertError) handleSupabaseError(insertError);
    }
};
