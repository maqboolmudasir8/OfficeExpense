import React, { createContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../api/supabaseClient";

type User = any; // Replace with Supabase types if needed

interface AuthContextProps {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    loading: true,
    signUp: async () => { },
    signIn: async () => { },
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ✔ Check user session on startup
    useEffect(() => {
        const fetchUser = async () => {
            // const { data } = await supabase.auth.getUser();
            const { data } = await supabase.auth.getSession();

            setUser(data.session?.user ?? null);
            setLoading(false);
        };

        fetchUser();

        // Listen to auth changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const signUp = async (email: string, password: string) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            setLoading(false);
            throw error;
        }

        // Supabase may require email verification — don't force user into session
        setUser(data.user ?? null);
        setLoading(false);
    };

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password, });

        if (error) {
            setLoading(false);
            throw error;
        }

        setUser(data.user);
        setLoading(false);
    };

    const signOut = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();

        if (error) {
            setLoading(false);
            throw error;
        }

        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signUp: signUp,
                signIn: signIn,
                signOut: signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
