// src/components/FolderDetails/MembersTab.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { List, Button, TextInput, Menu, Avatar, Chip, Portal, Dialog, Text } from 'react-native-paper';
import { FolderMember, PermissionLevel } from '../../types/Folder';
import { folderMemberService } from '../../api/folderMemberService';

interface MembersTabProps {
    members: FolderMember[];
    currentUserId: string;
    onAddMember: (email: string, permission: PermissionLevel) => Promise<void>;
    onRemoveMember: (member: FolderMember) => Promise<void>;
    onUpdateMember: (member: FolderMember, permission: PermissionLevel) => Promise<void>;
    canEdit: boolean;
    isLoading?: boolean;
}

export const MembersTab: React.FC<MembersTabProps> = ({
    members,
    currentUserId,
    onAddMember,
    onRemoveMember,
    onUpdateMember,
    canEdit,
    isLoading = false,
}) => {
    console.log('MembersTab rendered with members:', members.length); // Debug log


    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState<PermissionLevel>('Viewer');
    const [isAdding, setIsAdding] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<FolderMember | null>(null);
    const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
    const [newPermission, setNewPermission] = useState<PermissionLevel>('Viewer');

    // In MembersTab component
    const handleAddMember = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter an email address');
            return;
        }

        try {
            setIsAdding(true);
            await onAddMember(email.trim(), permission);
            setEmail('');
            setPermission('Viewer');
            // No need to update local state here as parent will provide updated members
        } catch (error) {
            // Error is already handled in the parent
        } finally {
            setIsAdding(false);
        }
    };


    const handleUpdatePermission = async () => {
        if (!selectedMember) return;

        try {
            await onUpdateMember(selectedMember, newPermission);
            setPermissionDialogVisible(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to update permission');
        }
    };

    const handleRemoveMember = async () => {
        if (!selectedMember) return;

        try {
            await onRemoveMember(selectedMember);
            setMenuVisible(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to remove member');
        }
    };

    const openPermissionDialog = (member: FolderMember) => {
        setSelectedMember(member);
        setNewPermission(member.permission_level);
        setPermissionDialogVisible(true);
    };

    const openMenu = (member: FolderMember) => {
        setSelectedMember(member);
        setMenuVisible(true);
    };

    const getPermissionColor = (level: PermissionLevel) => {
        switch (level) {
            case 'Editor':
                return '#4caf50';
            case 'Contributor':
                return '#2196f3';
            case 'Viewer':
                return '#9e9e9e';
            default:
                return '#9e9e9e';
        }
    };

    return (
        <View style={styles.container}>
            {/* Add a test view at the top */}
            <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
                <Text>Members Tab Loaded</Text>
                <Text>Total members: {members.length}</Text>
                <Text>Can edit: {canEdit ? 'Yes' : 'No'}</Text>
            </View>
            {canEdit && (
                <View style={styles.addMemberContainer}>
                    <TextInput
                        label="Add member by email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.emailInput}
                        autoCapitalize="none"
                        autoComplete="email"
                        keyboardType="email-address"
                        disabled={isLoading || isAdding}
                    />
                    <Button
                        mode="contained"
                        onPress={handleAddMember}
                        loading={isAdding}
                        disabled={isLoading || isAdding || !email.trim()}
                        style={styles.addButton}
                    >
                        Add
                    </Button>
                </View>
            )}

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text>Loading members...</Text>
                </View>
            ) : (
                <List.Section>
                    {members.map((member) => (
                        <List.Item
                            key={`${member.folder_id}-${member.user_id}`}
                            title={member.user_name || member.user_email || 'Unknown User'}
                            description={member.user_email}
                            left={props => (
                                <Avatar.Text
                                    {...props}
                                    size={40}
                                    label={member.user_name?.[0]?.toUpperCase() || 'U'}
                                    style={[props.style, { backgroundColor: getPermissionColor(member.permission_level) }]}
                                    labelStyle={{ color: 'white' }}
                                />
                            )}
                            right={props =>
                                canEdit && member.user_id !== currentUserId ? (
                                    <View style={styles.memberActions}>
                                        <Chip
                                            style={[styles.permissionChip, { backgroundColor: getPermissionColor(member.permission_level) }]}
                                            textStyle={{ color: 'white' }}
                                            onPress={() => openPermissionDialog(member)}
                                        >
                                            {member.permission_level}
                                        </Chip>
                                        <Button
                                            icon="dots-vertical"
                                            onPress={() => openMenu(member)} children={undefined} />
                                    </View>
                                ) : (
                                    <Chip
                                        style={[styles.permissionChip, {
                                            backgroundColor: getPermissionColor(member.permission_level),
                                            opacity: 0.7
                                        }]}
                                        textStyle={{ color: 'white' }}
                                    >
                                        {member.permission_level}
                                    </Chip>
                                )
                            }
                        />
                    ))}
                </List.Section>
            )}

            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={{ x: 0, y: 0 }}
            >
                <Menu.Item
                    leadingIcon="pencil"
                    onPress={() => {
                        setMenuVisible(false);
                        if (selectedMember) {
                            openPermissionDialog(selectedMember);
                        }
                    }}
                    title="Change Permission"
                />
                <Menu.Item
                    leadingIcon="account-remove"
                    onPress={() => {
                        handleRemoveMember();
                    }}
                    title="Remove Member"
                />
            </Menu>

            <Portal>
                <Dialog
                    visible={permissionDialogVisible}
                    onDismiss={() => setPermissionDialogVisible(false)}
                >
                    <Dialog.Title>Change Permission</Dialog.Title>
                    <Dialog.Content>
                        <Text>Set permission for {selectedMember?.user_name || selectedMember?.user_email}:</Text>
                        <View style={styles.permissionButtons}>
                            {(['Viewer', 'Contributor', 'Editor'] as PermissionLevel[]).map((level) => (
                                <Button
                                    key={level}
                                    mode={newPermission === level ? 'contained' : 'outlined'}
                                    onPress={() => setNewPermission(level)}
                                    style={styles.permissionButton}
                                >
                                    {level}
                                </Button>
                            ))}
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setPermissionDialogVisible(false)}>Cancel</Button>
                        <Button onPress={handleUpdatePermission}>Save</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addMemberContainer: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        gap: 8,
    },
    emailInput: {
        flex: 1,
    },
    addButton: {
        minWidth: 80,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    memberActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    permissionChip: {
        marginRight: 8,
        height: 32,
        justifyContent: 'center',
    },
    permissionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    permissionButton: {
        margin: 4,
    },
});