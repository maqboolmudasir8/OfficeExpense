// src/screens/Folders/FolderDetailsScreen.tsx
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, Alert } from 'react-native';
import {
    useTheme,
    Portal,
} from 'react-native-paper';
import { TabView, TabBar } from 'react-native-tab-view';
import { useRoute } from '@react-navigation/native';
import { useFolderStore } from '../../store/folderStore';
import { EditableFolderInputModel, FolderMember, FolderStatus, FolderVisibility, PermissionLevel } from '../../types/Folder';
import { supabase } from '../../api/supabaseClient';
import { folderMemberService } from '../../api/folderMemberService';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { FolderDetailsTab } from './FolderDetails/FolderDetailsTab';
import { MembersTab } from '../../components/FolderDetails/MembersTab';
import { FilesTab } from './FolderDetails/components/FilesTab';
import { AuthContext } from '../../context/AuthContext';
import { ExpensesTab } from '../Files/components/ExpensesTab';
import Dialog from '../../components/Dialog';

type FolderDetailsScreenProps = {
    folderId: number;
};

// 1. Move the TabBar component outside the main component to prevent unnecessary re-renders
const FolderDetailsCustomTabBar = (props: any) => {
    const theme = useTheme();
    return (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: theme.colors.primary,
                height: 3
            }}
            style={{
                backgroundColor: theme.colors.surface,
                elevation: 2,
                height: 48, // Explicit height
            }}
            labelStyle={{
                color: theme.colors.onSurface,
                textTransform: 'none',
                margin: 0,
                padding: 0,
                fontSize: 14,
            }}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.onSurfaceVariant}
        />
    );
};

export default function FolderDetailsScreen() {
    const theme = useTheme();
    const navigation = useAppNavigation<"FolderDetails">();
    const route = useRoute();
    const { user } = useContext(AuthContext);
    const { folderId } = route.params as FolderDetailsScreenProps;

    const {
        selectedFolder,
        fetchFolderDetails,
        updateFolder,
        deleteFolder,
        error,
        resetError,
    } = useFolderStore();

    const [isLoading, setIsLoading] = useState(true);
    const [members, setMembers] = useState<FolderMember[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const [tabState, setTabState] = useState({
        index: 0,
        routes: [
            { key: 'ExpensesTab', title: 'Expenses' }, // new tab
            { key: 'FilesTab', title: 'Files' },
            { key: 'details', title: 'Details' },
            { key: 'members', title: 'Members' },
        ],
    });

    const loadGroupDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            await fetchFolderDetails(folderId);
        } catch (error) {
            console.error('Error loading group details:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchFolderDetails, folderId]);

    // Update the loadMembers function
    const loadMembers = useCallback(async () => {
        if (!selectedFolder) return;

        try {
            setIsLoadingMembers(true);
            const members = await folderMemberService.fetchMembers(selectedFolder.id);
            console.log("members___loadMembers", members);

            setMembers(members);
        } catch (error) {
            console.error('Error loading members:', error);
            Alert.alert('Error', 'Failed to load members');
        } finally {
            setIsLoadingMembers(false);
        }
    }, [selectedFolder]);

    useEffect(() => {
        loadGroupDetails();
    }, [loadGroupDetails]);

    useEffect(() => {
        if (selectedFolder) {
            loadMembers();
        }
    }, [selectedFolder, loadMembers]);

    // Update the handleAddMember function
    const handleAddMember = useCallback(async (email: string, permission: PermissionLevel): Promise<void> => {
        if (!selectedFolder) return;

        try {
            const newMember = await folderMemberService.addMember(
                selectedFolder.id,
                email,
                permission,
                user?.id || ''
            );

            // Update the members list
            setMembers(prev => [...prev, newMember]);
            Alert.alert('Success', 'Member added successfully');
        } catch (error) {
            console.error('Error adding member:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add member');
            throw error; // Re-throw to let the MembersTab handle the loading state
        }
    }, [selectedFolder]);

    const handleRemoveMember = useCallback(async (member: FolderMember) => {
        if (!selectedFolder) return;
        try {
            await folderMemberService.removeMember(selectedFolder.id, member.user_id);
            setMembers(prev => prev.filter(m => m.user_id !== member.user_id));
        } catch (error) {
            console.error('Error removing member:', error);
            throw error;
        }
    }, [selectedFolder]);

    // Add this new function
    const handleUpdateMember = useCallback(async (member: FolderMember, permission: PermissionLevel): Promise<void> => {
        if (!selectedFolder) return;
        try {
            const updatedMember = await folderMemberService.updateMemberPermission(
                selectedFolder.id,
                member.user_id,
                permission
            );
            setMembers(prev =>
                prev.map(m =>
                    m.user_id === member.user_id ? updatedMember : m
                )
            );
        } catch (error) {
            console.error('Error updating member:', error);
            throw error;
        }
    }, [selectedFolder]);

    const handleSave = useCallback(async (formData: Partial<EditableFolderInputModel>) => {
        if (!selectedFolder) return;

        try {
            await updateFolder(selectedFolder.id, {
                ...formData,
                updated_by: (await supabase.auth.getUser()).data.user?.id || '',
            });
        } catch (error) {
            console.error('Error updating folder:', error);
            throw error; // This will be caught by the FolderDetailsTab
        }
    }, [selectedFolder, updateFolder]);

    const handleDelete = useCallback(async () => {
        if (!selectedFolder) return;

        try {
            await deleteFolder(selectedFolder.id);
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting group:', error);
        } finally {
            setDeleteDialogVisible(false);
        }
    }, [selectedFolder, deleteFolder, navigation]);

    const renderTabBar = (props: any) => <FolderDetailsCustomTabBar {...props} />;

    // Update the renderScene function
    const renderScene = useCallback(({ route }: { route: { key: string } }) => {
        if (!selectedFolder) return null;

        switch (route.key) {
            case 'ExpensesTab':
                return <ExpensesTab
                    fileId={0}
                    folderId={selectedFolder.id}
                />;
            case 'FilesTab':
                return <FilesTab
                    folderId={selectedFolder.id}
                // onFilePress={(file) => {
                //     // Handle file press if needed
                //     console.log('File pressed:', file);
                // }}
                />;
            case 'details':
                return (
                    <FolderDetailsTab
                        folder={selectedFolder}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        isLoading={isLoading}
                    />
                );
            case 'members':
                return (
                    <MembersTab
                        folderId={folderId}
                        members={members}
                        currentUserId={user?.id || ''}
                        onAddMember={handleAddMember}
                        onRemoveMember={handleRemoveMember}
                        onUpdateMember={handleUpdateMember}
                        // canEdit={selectedFolder.permission_level === 'Editor'}
                        canEdit={true}
                        isLoading={isLoadingMembers}
                    />
                );

            default:
                return null;
        }
    }, [
        selectedFolder,
        members,
        isLoading,
        isLoadingMembers,
        handleSave,
        handleDelete,
        handleAddMember,
        handleRemoveMember,
        handleUpdateMember,
    ]);


    if (isLoading || !selectedFolder) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TabView
                navigationState={tabState}
                renderScene={renderScene}
                onIndexChange={(index) => setTabState(prev => ({ ...prev, index }))}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={renderTabBar}
                style={{ flex: 1 }}
            // sceneContainerStyle={{ flex: 1 }}
            />

            <Portal>
                <Dialog
                    visible={deleteDialogVisible}
                    onCancel={() => setDeleteDialogVisible(false)}
                    title='Delete Folder'
                    confirmLabel='Are you sure you want to delete this folder? This action cannot be undone.'
                    onConfirm={handleDelete}
                >
                </Dialog>
            </Portal>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContent: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 10,
        backgroundColor: 'white',
    },
    descriptionInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    tabView: {
        flex: 1,
    },
    sceneContainer: {
        flex: 1,
    },
});