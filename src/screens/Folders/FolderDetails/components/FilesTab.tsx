import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Searchbar, Button, useTheme, FAB } from "react-native-paper";
import { AuthContext } from "../../../../context/AuthContext";
import { useAppNavigation } from "../../../../hooks/useAppNavigation";
import { fileService } from "../../../../api/fileService";
import { File } from "../../../../types/File";
import ConfirmationDialog from "../../../../components/Files/ConfirmationDialog";
import { FileList } from "../../../Files/components/FileList";
import FileOptionsMenu from "../../../Files/components/FileOptionsMenu";
import { FileCreateEditDialog } from "../../../Files/components/FileCreateEditDialog";

export const FilesTab = ({ folderId }: { folderId: number }) => {
    const theme = useTheme();
    const navigation = useAppNavigation<"FilesTab">();
    const { user } = React.useContext(AuthContext);

    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [showCreateEdit, setShowCreateEdit] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [form, setForm] = useState<Partial<File>>({ title: "", description: "" });

    /** Load Files */
    const loadFiles = useCallback(async () => {
        try {
            const res = await fileService.listFiles({ folder_id: folderId, search });
            setFiles(res);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [folderId, search]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    /** Debounced search */
    const handleSearch = (q: string) => {
        setSearch(q);
    };

    /** Create / Update file */
    const handleSubmit = async () => {
        if (!form.title?.trim()) return;

        try {
            if (selectedFile) {
                // update
                const updated = await fileService.updateFile(selectedFile?.id ?? 0, form);
                setFiles(files.map((f) => (f.id === updated.id ? updated : f)));
            } else {
                // create
                const created = await fileService.createFile({
                    ...form,
                    title: form.title!.trim(),
                    folder_id: folderId,
                    created_by: user?.id,
                });

                setFiles([created, ...files]);
            }
        } finally {
            setShowCreateEdit(false);
            setSelectedFile(null);
            setForm({ title: "", description: "" });
        }
    };

    /** Delete file */
    const handleDelete = async () => {
        if (!selectedFile) return;

        await fileService.deleteFile(selectedFile?.id ?? 0);
        setFiles(files.filter((f) => f.id !== selectedFile.id));

        setShowDelete(false);
        setSelectedFile(null);
    };

    if (loading)
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" />
            </View>
        );

    return (
        <View style={styles.container}>
            {/* Search + Create */}
            <View style={styles.searchRow}>
                <Searchbar
                    placeholder="Search files..."
                    value={search}
                    onChangeText={handleSearch}
                    style={{ flex: 1 }}
                />

            </View>

            {/* File List */}
            <FileList
                files={files}
                onOpen={(f) => navigation.navigate("FileDetail", { fileId: f?.id ?? 0, folderId: folderId })}
                onMenu={(f) => {
                    setSelectedFile(f);
                    setShowMenu(true);
                }}
                isRefreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    loadFiles();
                }}
            />

            {/* Menu */}
            <FileOptionsMenu
                visible={showMenu}
                onDismiss={() => setShowMenu(false)}
                onEdit={() => {
                    if (!selectedFile) return;
                    setForm({ title: selectedFile.title, description: selectedFile.description });
                    setShowMenu(false);
                    setShowCreateEdit(true);
                }}
                onDelete={() => {
                    setShowMenu(false);
                    setShowDelete(true);
                }}
            />

            {/* Create / Edit Dialog */}
            <FileCreateEditDialog
                visible={showCreateEdit}
                form={form}
                onChange={(field, value) => setForm({ ...form, [field]: value })}
                onCancel={() => {
                    setShowCreateEdit(false);
                    setSelectedFile(null);
                    setForm({ title: "", description: "" });
                }}
                onSubmit={handleSubmit}
                isEdit={!!selectedFile}
            />

            {/* Confirmation Delete */}
            <ConfirmationDialog
                visible={showDelete}
                onCancel={() => setShowDelete(false)}
                onConfirm={handleDelete}
                title="Delete File"
                message={`Are you sure you want to delete "${selectedFile?.title}"? This action cannot be undone.`}
                icon="trash-can"
                danger
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
            <FAB
                icon="plus"
                style={{ position: "absolute", right: 16, bottom: 16 }}
                onPress={() => setShowCreateEdit(true)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    searchRow: { flexDirection: "row", marginBottom: 16 },
    loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});