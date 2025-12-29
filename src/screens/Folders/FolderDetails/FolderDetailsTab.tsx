// src/components/FolderDetails/DetailsTab.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Folder, FolderVisibility, FolderStatus, EditableFolderInputModel } from '../../../types/Folder';
import { Text } from '../../../components/Text';
import { TextInput } from '../../../components/TextInput';
import { Button } from '../../../components/Button';
import { globalStyles } from '../../../styles/globalStyles';
import ConfirmationDialog from '../../../components/Files/ConfirmationDialog';

interface FolderDetailsTabProps {
    folder: Folder;
    onSave?: (formData: Partial<EditableFolderInputModel>) => Promise<void>;
    onDelete?: () => Promise<void>;
    isLoading?: boolean;
}

export const FolderDetailsTab: React.FC<FolderDetailsTabProps> = ({
    folder,
    onSave,
    onDelete,
    isLoading = false,
}) => {
    const theme = useTheme();

    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const [formData, setFormData] = useState<Partial<EditableFolderInputModel>>({
        id: folder?.id,
        title: '',
        description: '',
        status: FolderStatus.Active,
        visibility: FolderVisibility.Private,
        color_code: '#2196F3',
        icon: 'folder',
    });

    // Sync when folder changes
    useEffect(() => {
        if (folder) {
            setFormData({
                id: folder?.id,
                title: folder?.title,
                description: folder?.description || '',
                status: folder?.status || FolderStatus.Active,
                visibility: folder?.visibility || FolderVisibility.Private,
                color_code: folder?.color_code || '#2196F3',
                icon: folder?.icon || 'folder',
            });
        }
    }, [folder]);

    const handleFieldChange = (field: keyof EditableFolderInputModel, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            if (onSave) {
                await onSave(formData);
            }
            setIsEditing(false);
        } catch (err) {
            Alert.alert('Failed to save changes.');
        }
    };

    const handleCancelEdit = () => {
        if (folder) {
            setFormData({
                id: folder?.id,
                title: folder?.title,
                description: folder?.description || '',
                status: folder?.status,
                visibility: folder?.visibility,
                color_code: folder?.color_code,
                icon: folder?.icon,
            });
        }
        setIsEditing(false);
    };

    const handleDelete = async () => {
        try {
            await onDelete?.();
            setConfirmDelete(false);
        } catch (err) { }
    };

    if (!folder) {
        return (
            <View style={globalStyles.layout.centeredContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.layout.container}>
            <ScrollView
                style={{ flex: 1, padding: 16 }}
                keyboardShouldPersistTaps="handled"
            >

                {/* Title */}
                <TextInput
                    label="Title"
                    value={formData.title || ''}
                    onChangeText={(text) => handleFieldChange('title', text)}
                    style={{ marginBottom: 16 }}
                    disabled={!isEditing}
                />

                {/* Description */}
                <TextInput
                    label="Description"
                    value={formData.description || ''}
                    onChangeText={(text) => handleFieldChange('description', text)}
                    multiline
                    numberOfLines={3}
                    style={{ marginBottom: 16 }}
                    disabled={!isEditing}
                />

                {!isEditing && (
                    <View style={{ marginTop: 20, flexDirection: 'row', gap: 12 }}>
                        <Button
                            label="Edit"
                            mode="contained"
                            onPress={() => setIsEditing(true)}
                        />

                        <Button
                            icon='trash-can'
                            label="Delete"
                            mode="contained"
                            style={globalStyles.buttons.error}
                            labelStyle={globalStyles.buttons.errorText}
                            onPress={() => setConfirmDelete(true)}
                        />
                    </View>
                )}

                {isEditing && (
                    <View style={{ marginTop: 20, flexDirection: 'row', gap: 12 }}>
                        <Button
                            label="Cancel"
                            mode="outlined"
                            onPress={handleCancelEdit}
                            style={globalStyles.buttons.secondary}
                            disabled={isLoading}
                        />

                        <Button
                            label="Save Changes"
                            mode="contained"
                            onPress={handleSave}
                            loading={isLoading}
                            disabled={isLoading}
                        />
                    </View>
                )}
            </ScrollView>

            <ConfirmationDialog
                visible={confirmDelete}
                onCancel={() => setConfirmDelete(false)}
                title="Delete Folder"
                message="Are you sure you want to delete this folder? This action cannot be undone."
                onConfirm={handleDelete}
                danger={true}
            />
        </View>
    );
};