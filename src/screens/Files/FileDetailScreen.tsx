// src/screens/Files/FileDetailScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import {
    Text,
    Button,
    TextInput,
    useTheme,
    ActivityIndicator,
    Divider,
    IconButton,
    Menu,
    Portal,
    Dialog,
    List,
    Chip
} from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { File, FileMember, FileStatus } from '../../types/File';
import { fileService } from '../../api/fileService';
import { AuthContext } from '../../context/AuthContext';
import { format } from 'date-fns';
import { PermissionLevel } from '../../types/Folder';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { ExpensesTab } from '../../components/FileDetails/ExpensesTab';

type FileDetailRouteParams = {
    fileId: number;
};

interface DetailsTabProps {
    file: File | null;
    isEditing: boolean;
    formData: {
        title: string;
        description: string;
        status: FileStatus;
    };
    onFormChange: (field: string, value: string) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
    file,
    isEditing,
    formData,
    onFormChange
}) => {
    if (!file) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading file details...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.tabContent}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.detailSection}>
                {isEditing ? (
                    <TextInput
                        label="Title"
                        value={formData.title}
                        onChangeText={(text) => onFormChange('title', text)}
                        style={styles.input}
                        mode="outlined"
                        error={!formData.title}
                        disabled={!isEditing}
                    />
                ) : (
                    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                        {file?.title || 'Untitled File'}
                    </Text>
                )}

                <View style={styles.metaContainer}>
                    <Chip
                        icon="calendar"
                        style={[styles.chip, styles.dateChip]}
                        textStyle={styles.chipText}
                    >
                        Created: {format(new Date(file.created_at), 'MMM d, yyyy')}
                    </Chip>
                    <Chip
                        icon={file.status === 'Active' ? 'check-circle' : 'archive'}
                        style={[
                            styles.chip,
                            styles.statusChip,
                            {
                                backgroundColor: file.status === 'Active'
                                    ? '#e8f5e9'
                                    : '#fff3e0',
                            }
                        ]}
                        textStyle={[
                            styles.chipText,
                            {
                                color: file.status === 'Active'
                                    ? '#2e7d32'
                                    : '#e65100'
                            }
                        ]}
                    >
                        {file.status}
                    </Chip>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    {isEditing ? (
                        <TextInput
                            label="Description"
                            value={formData.description}
                            onChangeText={(text) => onFormChange('description', text)}
                            multiline
                            numberOfLines={4}
                            style={[styles.input, styles.descriptionInput]}
                            mode="outlined"
                            disabled={!isEditing}
                        />
                    ) : (
                        <Text
                            style={[
                                styles.description,
                                !file.description && styles.placeholderText
                            ]}
                        >
                            {file.description || 'No description provided'}
                        </Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default function FileDetailScreen() {
    const theme = useTheme();
    const navigation = useAppNavigation<"FileDetail">();
    const route = useRoute<RouteProp<{ params: FileDetailRouteParams }, 'params'>>();
    const { user } = React.useContext(AuthContext);
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'details', title: 'Details' },
        { key: 'expenses', title: 'Expenses' },
    ]);

    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Active' as FileStatus,
    });
    const [members, setMembers] = useState<FileMember[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case 'details':
                return (
                    <DetailsTab
                        file={file}
                        isEditing={isEditing}
                        formData={formData}
                        onFormChange={(field, value) =>
                            setFormData(prev => ({ ...prev, [field]: value }))
                        }
                    />
                );
            case 'expenses':
                return file ? <ExpensesTab fileId={file.id} /> : null;
            default:
                return null;
        }
    };

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{
                backgroundColor: theme.colors.surface,
                elevation: 2, // Add shadow on Android
                shadowColor: '#000', // Add shadow on iOS
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            }}
            labelStyle={{
                color: theme.colors.primary,
                textTransform: 'none', // Prevent uppercase transformation
                fontSize: 14,
                fontWeight: '500',
            }}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.onSurfaceVariant}
        />
    );

    const loadFileDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const fileData = await fileService.getFileById(route.params.fileId);
            setFile(fileData);
            setFormData({
                title: fileData.title,
                description: fileData.description || '',
                status: fileData.status,
            });
        } catch (error) {
            console.error('Error loading file:', error);
            Alert.alert('Error', 'Failed to load file details');
        } finally {
            setIsLoading(false);
        }
    }, [route.params.fileId]);

    const loadMembers = useCallback(async () => {
        try {
            setIsLoadingMembers(true);
            const membersList = await fileService.listFileMembers(route.params.fileId);
            setMembers(membersList);
        } catch (error) {
            console.error('Error loading members:', error);
            Alert.alert('Error', 'Failed to load file members');
        } finally {
            setIsLoadingMembers(false);
        }
    }, [route.params.fileId]);

    useEffect(() => {
        loadFileDetails();
        loadMembers();
    }, [loadFileDetails, loadMembers]);

    const handleSave = async () => {
        if (!file) return;

        try {
            const updatedFile = await fileService.updateFile(file.id, formData);
            setFile(updatedFile);
            setIsEditing(false);
            Alert.alert('Success', 'File updated successfully');
        } catch (error) {
            console.error('Error updating file:', error);
            Alert.alert('Error', 'Failed to update file');
        }
    };

    const handleDelete = async () => {
        if (!file) return;

        try {
            await fileService.deleteFile(file.id);
            navigation.goBack();
            Alert.alert('Success', 'File deleted successfully');
        } catch (error) {
            console.error('Error deleting file:', error);
            Alert.alert('Error', 'Failed to delete file');
        }
    };

    const handleAddMember = async (email: string, permission: PermissionLevel) => {
        if (!file) return;

        try {
            const newMember = await fileService.addFileMember(file.id, email, permission);
            setMembers(prev => [...prev, newMember]);
            Alert.alert('Success', 'Member added successfully');
        } catch (error) {
            console.error('Error adding member:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add member');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!file) return;

        try {
            await fileService.removeFileMember(file.id, memberId);
            setMembers(prev => prev.filter(m => m.user_id !== memberId));
            Alert.alert('Success', 'Member removed successfully');
        } catch (error) {
            console.error('Error removing member:', error);
            Alert.alert('Error', 'Failed to remove member');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    onPress={() => navigation.goBack()}
                    size={24}
                />
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {file?.title || 'File Details'}
                    </Text>
                </View>
                <Menu
                    visible={isMenuVisible}
                    onDismiss={() => setIsMenuVisible(false)}
                    anchor={
                        <IconButton
                            icon="dots-vertical"
                            onPress={() => setIsMenuVisible(true)}
                            size={24}
                        />
                    }
                >
                    <Menu.Item
                        onPress={() => {
                            setIsMenuVisible(false);
                            setIsEditing(!isEditing);
                        }}
                        title={isEditing ? 'Cancel' : 'Edit'}
                        leadingIcon={isEditing ? 'close' : 'pencil'}
                    />
                    <Divider />
                    <Menu.Item
                        onPress={() => {
                            setIsMenuVisible(false);
                            setShowDeleteDialog(true);
                        }}
                        title="Delete"
                        leadingIcon="delete"
                        titleStyle={{ color: theme.colors.error }}
                    />
                </Menu>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: Dimensions.get('window').width }}
                        renderTabBar={renderTabBar}
                        style={[styles.tabView, { marginTop: 8 }]} // Add some top margin
                    />
                </View>
            )}

            {isEditing && (
                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={handleSave}
                        style={styles.saveButton}
                        loading={isLoading}
                    >
                        Save Changes
                    </Button>
                </View>
            )}

            <Portal>
                <Dialog
                    visible={showDeleteDialog}
                    onDismiss={() => setShowDeleteDialog(false)}
                >
                    <Dialog.Title>Delete File</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete this file? This action cannot be undone.</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button
                            onPress={handleDelete}
                            textColor={theme.colors.error}
                            loading={isLoading}
                        >
                            Delete
                        </Button>
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
    tabView: {
        flex: 1,
    },
    header: {
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    headerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerRightActions: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    section: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#424242',
    },
    divider: {
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailLabel: {
        width: 100,
        fontWeight: 'bold',
        marginRight: 16,
    },
    detailValue: {
        flex: 1,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    descriptionInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    statusChip: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    activeChip: {
        backgroundColor: '#e8f5e9',
    },
    archivedChip: {
        backgroundColor: '#ffebee',
    },
    chipText: {
        fontSize: 12,
    },
    memberActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    permissionChip: {
        marginRight: 8,
        height: 32,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginVertical: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#f9f9f9',
    },
    cancelButton: {
        marginRight: 8,
    },
    saveButton: {
        minWidth: 120,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    scrollContent: {
        padding: 16,
    },
    detailSection: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },

    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
        gap: 8,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    dateChip: {
        backgroundColor: '#f5f5f5',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    placeholderText: {
        color: '#999',
        fontStyle: 'italic',
    },
    headerTitleContainer: {
        flex: 1,
        marginHorizontal: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    tabContent: {
        flex: 1,
        backgroundColor: '#fff',
    },
});