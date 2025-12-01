import { create } from "zustand";
import { folderService } from "../api/folderService";
import { memberService } from "../api/expenseGroupMemberService";

interface GroupStore {
    groups: any[];
    selectedGroup: any | null;
    isLoading: boolean;
    error: string | null;

    resetError: () => void;

    fetchGroups: () => Promise<void>;
    fetchGroupsByUserId: (userId: string) => Promise<void>;
    fetchGroupDetails: (groupId: number) => Promise<void>;
    createGroup: (payload: any) => Promise<any>;
    updateGroup: (id: number, updates: any) => Promise<any>;
    deleteGroup: (id: number) => Promise<boolean>;
    addMember: (groupId: number, email: string, permission: any) => Promise<void>;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
    groups: [],
    selectedGroup: null,
    isLoading: false,
    error: null,

    resetError: () => set({ error: null }),

    async fetchGroups() {
        set({ isLoading: true });
        try {
            const groups = await folderService.fetchGroups();
            set({ groups });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    async fetchGroupsByUserId(userId: string) {
        set({ isLoading: true });
        try {
            const groups = await folderService.fetchGroupsByUserId(userId);
            set({ groups });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    async fetchGroupDetails(groupId: number) {
        set({ isLoading: true });
        try {
            const group = await folderService.fetchGroupDetails(groupId);
            set({ selectedGroup: group });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    async createGroup(payload: any) {
        set({ isLoading: true });
        try {
            const created = await folderService.createGroup(payload);

            set((s) => ({
                groups: [created, ...s.groups],
                selectedGroup: created
            }));

            return created;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    async updateGroup(id: number, updates: any) {
        set({ isLoading: true });
        try {
            const updated = await folderService.updateGroup(id, updates);

            set((s) => ({
                groups: s.groups.map((g) => (g.id === id ? updated : g)),
                selectedGroup: s.selectedGroup?.id === id ? updated : s.selectedGroup
            }));

            return updated;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    async deleteGroup(id: number) {
        set({ isLoading: true });
        try {
            // await groupService.archiveGroup(id);
            await folderService.deleteGroup(id);

            set((s) => ({
                groups: s.groups.filter((g) => g.id !== id),
                selectedGroup: s.selectedGroup?.id === id ? null : s.selectedGroup
            }));

            return true;
        } catch (err: any) {
            set({ error: err.message });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    async addMember(groupId: number, email: string, permission: any) {
        try {
            await memberService.addMember(groupId, email, permission);
            await get().fetchGroupDetails(groupId);
        } catch (err: any) {
            set({ error: err.message });
        }
    }
}));
