import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../api/supabaseClient';
import { signUpWithProfile } from '../api/authService';

type User = any; // Replace with Supabase types if needed

interface AuthContextProps {
    user: User | null;
    loading: boolean;
    users: User[]; // all users in the app
    getUserById: (id: string) => User | undefined;
    signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
    signUp: async () => { },
    signIn: async () => { },
    signOut: async () => { },
    users: [],
    getUserById: () => undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

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

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user ?? null);

            // Fetch all users when session exists
            if (data?.session?.user) {
                await loadUsers();
            }

            setLoading(false);
        };

        fetchUser();

        // Listen to auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await loadUsers();
            } else {
                setUsers([]);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const getUserById = (id: string) => users.find(u => u.id === id);

    const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
        setLoading(true);
        try {
            const user = await signUpWithProfile(email, password, firstName, lastName);
            setUser(user);
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
            console.log("signIn2___DATA", user);

            if (error) {
                if (error.code === 'email_not_confirmed') {
                    throw new Error('Please confirm your email before logging in.');
                }
                throw error;
            }
            setUser(data.user);

        } catch (err) {
            console.log("signIn2___catch_ERROR", err);

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
                signUp: signUp,
                signIn: signIn,
                signOut: signOut,
                users: users,
                getUserById: getUserById,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
