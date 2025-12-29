import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
// import { fileService } from '../../../../api/fileService';
import { File, FileStatus } from '../../../types/File';
import { fileService } from '../../../api/fileService';
// import { File, FileStatus } from '../../../../types/File';

export function useFileDetails(fileId: number) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: FileStatus.Active
    });

    const loadFileDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const fileData = await fileService.getFileById(fileId);
            setFile(fileData);
            setFormData({
                title: fileData.title,
                description: fileData.description || '',
                status: fileData.status ?? FileStatus.Active
            });
        } catch {
            Alert.alert('Error', 'Failed to load file');
        } finally {
            setIsLoading(false);
        }
    }, [fileId]);

    useEffect(() => {
        loadFileDetails();
    }, [loadFileDetails]);

    const toggleEditing = () => setIsEditing((prev) => !prev);

    const handleSave = async () => {
        if (!file) return;

        try {
            const updated = await fileService.updateFile(file?.id ?? 0, formData);
            setFile(updated);
            setIsEditing(false);
            Alert.alert('Success', 'File updated');
        } catch {
            Alert.alert('Error', 'Failed to update file');
        }
    };

    const handleDelete = async () => {
        if (!file) return;

        try {
            await fileService.deleteFile(file?.id ?? 0);
            Alert.alert('Deleted', 'File deleted');
        } catch {
            Alert.alert('Error', 'Failed to delete file');
        }
    };

    return {
        file,
        isLoading,
        isEditing,
        formData,
        setFormData,
        toggleEditing,

        deleteDialogVisible,
        handleDeleteDialogOpen: () => setDeleteDialogVisible(true),
        closeDeleteDialog: () => setDeleteDialogVisible(false),
        handleDelete
    };
}
