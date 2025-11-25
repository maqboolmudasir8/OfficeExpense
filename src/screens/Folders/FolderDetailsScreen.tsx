// src/screens/Folders/FolderDetailsScreen.tsx
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, Alert } from 'react-native';
import {
    Text,
    Button,
    useTheme,
    Portal,
    Dialog,
    TextInput,
    Menu,
    Divider
} from 'react-native-paper';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useRoute } from '@react-navigation/native';
import { useGroupStore } from '../../store/groupStore';
import { Folder, FolderMember, PermissionLevel } from '../../types/Folder';
import { supabase } from '../../api/supabaseClient';
import { folderMemberService } from '../../api/folderMemberService';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { DetailsTab } from '../../components/FolderDetails/DetailsTab';
import { MembersTab } from '../../components/FolderDetails/MembersTab';
import { FilesTab } from '../../components/FolderDetails/FilesTab';
import { AuthContext } from '../../context/AuthContext';

type RouteParams = {
    groupId: number;
};

type GroupStatus = 'Active' | 'Archived';

// 1. Move the TabBar component outside the main component to prevent unnecessary re-renders
const CustomTabBar = (props: any) => {
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
    const { groupId } = route.params as RouteParams;

    const {
        selectedGroup,
        fetchGroupDetails,
        updateGroup,
        deleteGroup,
        error,
        resetError,
    } = useGroupStore();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [members, setMembers] = useState<FolderMember[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Active' as GroupStatus,
        visibility: 'Private' as 'Private' | 'Public',
        color_code: '#2196F3',
        icon: 'folder',
    });

    const [tabState, setTabState] = useState({
        index: 0,
        routes: [
            { key: 'details', title: 'Details' },
            { key: 'members', title: 'Members' },
            { key: 'FilesTab', title: 'Files' },
        ],
    });

    const loadGroupDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            await fetchGroupDetails(groupId);
        } catch (error) {
            console.error('Error loading group details:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchGroupDetails, groupId]);

    // Update the loadMembers function
    const loadMembers = useCallback(async () => {
        if (!selectedGroup) return;

        try {
            setIsLoadingMembers(true);
            const members = await folderMemberService.fetchMembers(selectedGroup.id);
            setMembers(members);
        } catch (error) {
            console.error('Error loading members:', error);
            Alert.alert('Error', 'Failed to load members');
        } finally {
            setIsLoadingMembers(false);
        }
    }, [selectedGroup]);

    useEffect(() => {
        loadGroupDetails();
    }, [loadGroupDetails]);

    useEffect(() => {
        if (selectedGroup) {
            setFormData({
                title: selectedGroup.title,
                description: selectedGroup.description || '',
                status: selectedGroup.status as GroupStatus,
                visibility: selectedGroup.visibility as 'Private' | 'Public',
                color_code: selectedGroup.color_code || '#2196F3',
                icon: selectedGroup.icon || 'folder',
            });
            loadMembers();
        }
    }, [selectedGroup, loadMembers]);

    // Update the handleAddMember function
    const handleAddMember = useCallback(async (email: string, permission: PermissionLevel): Promise<void> => {
        if (!selectedGroup) return;

        try {
            const newMember = await folderMemberService.addMember(
                selectedGroup.id,
                email,
                permission
            );

            // Update the members list
            setMembers(prev => [...prev, newMember]);
            Alert.alert('Success', 'Member added successfully');
        } catch (error) {
            console.error('Error adding member:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add member');
            throw error; // Re-throw to let the MembersTab handle the loading state
        }
    }, [selectedGroup]);

    const handleRemoveMember = useCallback(async (member: FolderMember) => {
        if (!selectedGroup) return;
        try {
            await folderMemberService.removeMember(selectedGroup.id, member.user_id);
            setMembers(prev => prev.filter(m => m.user_id !== member.user_id));
        } catch (error) {
            console.error('Error removing member:', error);
            throw error;
        }
    }, [selectedGroup]);

    // Add this new function
    const handleUpdateMember = useCallback(async (member: FolderMember, permission: PermissionLevel): Promise<void> => {
        if (!selectedGroup) return;
        try {
            const updatedMember = await folderMemberService.updateMemberPermission(
                selectedGroup.id,
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
    }, [selectedGroup]);

    const handleSave = useCallback(async () => {
        if (!selectedGroup) return;

        try {
            await updateGroup(selectedGroup.id, {
                ...formData,
                updated_by: (await supabase.auth.getUser()).data.user?.id || '',
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating group:', error);
        }
    }, [selectedGroup, formData, updateGroup]);

    const handleDelete = useCallback(async () => {
        if (!selectedGroup) return;

        try {
            await deleteGroup(selectedGroup.id);
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting group:', error);
        } finally {
            setDeleteDialogVisible(false);
        }
    }, [selectedGroup, deleteGroup, navigation]);

    const renderTabBar = (props: any) => <CustomTabBar {...props} />;

    // Update the renderScene function
    const renderScene = useCallback(({ route }: { route: { key: string } }) => {
        if (!selectedGroup) return null;

        switch (route.key) {
            case 'FilesTab':
                return (
                    <FilesTab
                        folderId={selectedGroup.id}
                    // onFilePress={(file) => {
                    //     // Handle file press if needed
                    //     console.log('File pressed:', file);
                    // }}
                    />
                );
            case 'details':
                return <DetailsTab
                    group={selectedGroup}
                    isEditing={isEditing}
                    formData={formData}
                    onFormDataChange={setFormData}
                />;
            case 'members':
                return (
                    <MembersTab
                        members={members}
                        currentUserId={user?.id || ''}
                        onAddMember={handleAddMember}
                        onRemoveMember={handleRemoveMember}
                        onUpdateMember={handleUpdateMember}
                        // canEdit={selectedGroup.permission_level === 'Editor'}
                        canEdit={true}
                        isLoading={isLoadingMembers}
                    />
                );

            default:
                return null;
        }
    }, [selectedGroup, isEditing, formData, members, user, handleAddMember, handleRemoveMember, handleUpdateMember, isLoadingMembers]);

    if (isLoading || !selectedGroup) {
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
                    onDismiss={() => setDeleteDialogVisible(false)}>
                    <Dialog.Title>Delete Folder</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete this folder? This action cannot be undone.</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
                        <Button onPress={handleDelete} textColor="red">Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
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