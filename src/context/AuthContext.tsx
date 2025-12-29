// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../api/supabaseClient';
import { signUpWithProfile } from '../api/authService';
import { AppUser } from '../types/User';



interface AuthContextProps {
    user: AppUser | null;
    loading: boolean;
    users: AppUser[];
    getUserById: (id: string) => AppUser | undefined;
    signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (
        updates: {
            firstName?: string;
            lastName?: string;
            email?: string
        }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
    signUp: async () => { },
    signIn: async () => { },
    signOut: async () => { },
    logout: async () => { },
    updateUser: async () => { },
    users: [],
    getUserById: () => undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<AppUser[]>([]);

    // Fetch users from Supabase table 'users'
    const loadUsers = async () => {
        try {
            const { data, error } = await supabase.from('users').select('*');
            if (error) throw error;
            setUsers(data || []);
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    // Update user profile in the database
    const updateUser = async (updates: { firstName?: string; lastName?: string; email?: string }) => {
        if (!user) return;

        try {
            // Convert camelCase to snake_case for database columns
            const dbUpdates: Record<string, any> = {};
            if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
            if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
            if (updates.email !== undefined) dbUpdates.email = updates.email;

            const { data: updatedUser, error } = await supabase
                .from('users')
                .update(dbUpdates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;

            // Update local user state with the response from the server
            if (updatedUser) {
                setUser(updatedUser as unknown as AppUser);
            }

            return updatedUser;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getSession();
            const sessionUser = data.session?.user;

            if (sessionUser) {
                // Fetch the user profile from your users table
                const { data: userData, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', sessionUser.id)
                    .single();

                if (!error && userData) {
                    // setUser({
                    //     id: userData.id,
                    //     email: userData.email,
                    //     first_name: userData.first_name || '',
                    //     last_name: userData.last_name || '',
                    //     full_name: userData.full_name || '',
                    //     created_at: userData.created_at,
                    //     updated_at: userData.updated_at
                    // });
                    setUser(userData as unknown as AppUser);
                }
                // else {
                //     // If no user in the users table, create one
                //     const { error: insertError } = await supabase
                //         .from('users')
                //         .insert([
                //             {
                //                 id: sessionUser.id,
                //                 email: sessionUser.email,
                //                 name: sessionUser.email?.split('@')[0] || 'User'
                //             }
                //         ]);

                //     if (!insertError) {
                //         // setUser({
                //         //     id: sessionUser.id,
                //         //     email: sessionUser.email || '',
                //         //     full_name: sessionUser.full_name || 'User'
                //         // });
                //         setUser(sessionUser as unknown as AppUser);
                //     }
                // }

                await loadUsers();
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        fetchUser();

        // Listen to auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session?.user as unknown as AppUser);
                await loadUsers();
            } else {
                setUser(null);
                setUsers([]);
            }
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const getUserById = (id: string) => users.find(u => u.id === id);

    const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
        setLoading(true);
        try {
            const user = await signUpWithProfile(email, password, firstName, lastName);
            if (user) {
                setUser(user as unknown as AppUser);
            }
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                if (error.message.includes('email not confirmed')) {
                    throw new Error('Please confirm your email before logging in.');
                }
                throw error;
            }

            if (data?.user) {
                // Fetch the user's information from the users table
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                if (userError) {
                    console.error('Error fetching user data:', userError);
                    throw new Error('Failed to load user profile');
                }

                if (userData) {
                    setUser({
                        id: userData.id,
                        email: userData.email,
                        first_name: userData.first_name || '',
                        last_name: userData.last_name || '',
                        ...userData
                    });
                } else
                    // If no user found in the users table, use the auth user data
                    setUser(data?.user as unknown as AppUser);
            }
        } catch (err) {
            console.error("Sign in error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            setUser(null);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                users,
                getUserById,
                signUp,
                signIn,
                signOut,
                logout,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};