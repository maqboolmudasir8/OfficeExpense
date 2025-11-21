// src/api/groupService.ts
import { supabase } from './supabaseClient';

export const fetchGroups = async () => {
    const { data, error } = await supabase.from('expense_groups').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

export const fetchGroupById = async (id: number) => {
    const { data, error } = await supabase.from('expense_groups').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};

export const createGroup = async (name: string, description: string | null) => {
    const { data, error } = await supabase.from('expense_groups').insert({ name, description }).select().single();
    if (error) throw error;
    return data;
};

export const updateGroup = async (id: number, name: string, description: string | null) => {
    const { data, error } = await supabase.from('expense_groups').update({ name, description }).eq('id', id).select().single();
    if (error) throw error;
    return data;
};

export const deleteGroup = async (id: number) => {
    const { error } = await supabase.from('expense_groups').delete().eq('id', id);
    if (error) throw error;
};
