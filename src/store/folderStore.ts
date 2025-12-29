import { create } from "zustand";
import { folderService } from "../api/folderService";
import { memberService } from "../api/expenseGroupMemberService";

interface FolderStoreProps {
    folders: any[];
    selectedFolder: any | null;
    isLoading: boolean;
    error: string | null;

    resetError: () => void;

    fetchFolders: () => Promise<void>;
    fetchFoldersByUserId: (userId: string) => Promise<void>;
    fetchFolderDetails: (folderId: number) => Promise<void>;
    createFolder: (payload: any) => Promise<any>;
    updateFolder: (id: number, updates: any) => Promise<any>;
    deleteFolder: (id: number) => Promise<boolean>;
    addMember: (folderId: number, email: string, permission: any) => Promise<void>;
}

export const useFolderStore = create<FolderStoreProps>((set, get) => ({
    folders: [],
    selectedFolder: null,
    isLoading: false,
    error: null,

    resetError: () => set({ error: null }),

    async fetchFolders() {
        set({ isLoading: true });
        try {
            const folders = await folderService.fetchFolders();
            set({ folders: folders });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    async fetchFoldersByUserId(userId: string) {
        set({ isLoading: true });
        try {
            const folders = await folderService.fetchFoldersByUserId(userId);
            set({ folders });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    async fetchFolderDetails(folderId: number) {
        set({ isLoading: true });
        try {
            const selectedFolder = await folderService.fetchFolderDetails(folderId);
            set({ selectedFolder: selectedFolder });
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    async createFolder(payload: any) {
        set({ isLoading: true });
        try {
            const created = await folderService.createFolder(payload);

            set((s) => ({
                folders: [created, ...s.folders],
                selectedFolder: created
            }));

            return created;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    async updateFolder(id: number, updates: any) {
        set({ isLoading: true });
        try {
            const updated = await folderService.updateFolder(id, updates);

            set((s) => ({
                folders: s.folders.map((g) => (g.id === id ? updated : g)),
                selectedFolder: s.selectedFolder?.id === id ? updated : s.selectedFolder
            }));

            return updated;
        } catch (err: any) {
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    async deleteFolder(id: number) {
        set({ isLoading: true });
        try {
            await folderService.archiveFolder(id);
            // await folderService.deleteFolder(id);

            set((s) => ({
                folders: s.folders.filter((g) => g.id !== id),
                selectedFolder: s.selectedFolder?.id === id ? null : s.selectedFolder
            }));

            return true;
        } catch (err: any) {
            set({ error: err.message });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    async addMember(folderId: number, email: string, permission: any) {
        try {
            await memberService.addMember(folderId, email, permission);
            await get().fetchFolderDetails(folderId);
        } catch (err: any) {
            set({ error: err.message });
        }
    }
}));
