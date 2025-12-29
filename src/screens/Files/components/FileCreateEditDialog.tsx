import React from "react";
import { View, StyleSheet } from "react-native";
import { File, statusOptions, visibilityOptions } from "../../../types/File";
import { TextInput } from "../../../components/TextInput";
import Dialog from "../../../components/Dialog";
import { useTheme } from "react-native-paper";
import { Dropdown } from "../../../components/Dropdown";

interface FileCreateEditDialogProps {
    visible: boolean;
    form: Partial<File>;
    onChange: (field: string, value: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
    isEdit: boolean;
}

export const FileCreateEditDialog: React.FC<FileCreateEditDialogProps> = ({ visible, form, onChange, onCancel, onSubmit, isEdit, }) => {
    const theme = useTheme();

    return (
        <Dialog
            visible={visible}
            title={isEdit ? "Edit File" : "New File"}
            confirmLabel={isEdit ? "Update" : "Add"}
            cancelLabel="Cancel"
            icon="file-document-edit"
            onCancel={onCancel}
            onConfirm={onSubmit}
        >
            <View style={{ marginBottom: 12 }}>
                <TextInput
                    label="Title"
                    mode="outlined"
                    value={form?.title ?? ''}
                    onChangeText={(v) => onChange("title", v)}
                />
            </View>

            <View style={{ marginBottom: 12 }}>
                <TextInput
                    label="Description (optional)"
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    value={form.description ?? ""}
                    onChangeText={(v) => onChange("description", v)}
                />
            </View>

            {/* Status */}
            {/* <View style={{ marginBottom: 12 }}>
                <Dropdown
                    label="Status"
                    value={form.status?.toString() ?? ""}
                    options={statusOptions}
                    onSelect={(value) => onChange("status", value ?? "")}
                />
            </View> */}

            {/* Visibility */}
            {/* <View style={{ marginBottom: 12 }}>
                <Dropdown
                    label="Visibility"
                    value={form.visibility?.toString() ?? ""}
                    options={visibilityOptions}
                    onSelect={(value) => onChange("visibility", value ?? "")}
                />
            </View> */}
        </Dialog>
    );
};