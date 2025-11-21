// src/api/authService.ts
import { supabase } from './supabaseClient';

export const signUpWithProfile = async (email: string, password: string, firstName: string, lastName: string
) => {
    // 1️⃣ Sign up user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("User ID not returned from Supabase");

    // 2️⃣ Insert row into public.users
    const { error: insertError } = await supabase.from('users').insert([
        {
            id: userId,
            email,
            first_name: firstName,
            last_name: lastName,
            role: 'User',      // default role
            status: 'Active'
        },
    ]);

    if (insertError) {
        console.log("insertError", insertError);
        throw insertError
    };

    return data?.user;
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password, });

    if (error) throw error;
    return data?.user;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getCurrentUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
};


// export const resetPassword = async (email: string) => {
//     const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: 'yourapp://reset-password',
//     });
//     if (error) throw error;
//     return data;
// }