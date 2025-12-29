import { supabase } from './supabaseClient';

export interface User {
    id: string;
    email: string;
    full_name: string;
    first_name: string;
    last_name: string;
    role: string;
    status: string;
}

export const userService = {
    // Get all users except the current user
    getAllUsers: async (excludeUserIds: string[] = []): Promise<User[]> => {
        let query = supabase
            .from('users')
            .select('*')
            .order('first_name', { ascending: true });

        if (excludeUserIds.length > 0) {
            query = query.not('id', 'in', `(${excludeUserIds.join(',')})`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching users:', error);
            throw error;
        }

        return data || [];
    },

    // Get user by ID
    getUserById: async (userId: string): Promise<User | null> => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            return null;
        }

        return data;
    },

    // Search users by name or email
    searchUsers: async (searchTerm: string, excludeUserIds: string[] = []): Promise<User[]> => {
        let query = supabase
            .from('users')
            .select('*')
            .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
            .order('full_name', { ascending: true });

        if (excludeUserIds.length > 0) {
            query = query.not('id', 'in', `(${excludeUserIds.join(',')})`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error searching users:', error);
            return [];
        }

        return data || [];
    },
};
