import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import {
    Text,
    Button,
    Card,
    IconButton,
    Menu,
    Divider,
    Searchbar,
    useTheme,
    Dialog,
    TextInput
} from 'react-native-paper';
import { useAppNavigation } from '../../../../hooks/useAppNavigation';
import { AuthContext } from '../../../../context/AuthContext';
import { CreateFileData, File, FileMember, FileStatus, } from '../../../../types/File';
import { fileService } from '../../../../api/fileService';
import ConfirmationDialog from '../../../../components/Files/ConfirmationDialog';

interface FilesTabProps {
    folderId: number;
    // onFilePress?: (file: File) => void;
}

// TODO: fix issue of not showing updated files when this component is mounted again(this page appears again from FileDetailScreen)

export const FilesTab: React.FC<FilesTabProps> = ({ folderId, /*onFilePress*/ }) => {
    const theme = useTheme();
    const navigation = useAppNavigation<"FilesTab">();
    const { user } = React.useContext(AuthContext);
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Omit<CreateFileData, 'folder_id' | 'created_by'>>({
        title: '',
        description: '',
        status: 'Active' as const,
        created_at: new Date().toISOString(),
        // created_by: user?.id || '',
    });

    // Load files
    const loadFiles = useCallback(async () => {
        try {
            const fetchedFiles = await fileService.listFiles({
                folder_id: folderId,
                search: searchQuery,
            });
            setFiles(fetchedFiles);
        } catch (error) {
            console.error('Error loading files:', error);
            Alert.alert('Error', 'Failed to load files');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [folderId, searchQuery]);

    // Initial load and search query changes
    useEffect(() => {
        loadFiles();
    }, [searchQuery, folderId]);

    // Handle refresh
    const handleRefresh = () => {
        setIsRefreshing(true);
        loadFiles();
    };

    // Handle search
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // Add a small delay before searching to avoid too many requests
        const timer = setTimeout(() => {
            loadFiles();
        }, 500);
        return () => clearTimeout(timer);
    };

    // Handle file press
    // const handleFilePress = (file: File) => {
    //     if (onFilePress) {
    //         onFilePress(file);
    //     }
    // };

    // Handle create file
    const handleCreateFile = async () => {
        try {
            if (!formData.title.trim()) {
                Alert.alert('Error', 'File title is required');
                return;
            }

            const fileData: CreateFileData = {
                ...formData,
                folder_id: folderId,
                created_by: user?.id || '',
            };

            const newFile = await fileService.createFile(fileData);

            setFiles([newFile, ...files]);
            setIsCreateModalVisible(false);
            setFormData({
                title: '',
                description: '',
                // file_type: 'document',
                status: 'Active',
                created_at: new Date().toISOString(),
                // created_by: user?.id || '',
            });
        } catch (error) {
            console.error('Error creating file:', error);
            Alert.alert('Error', 'Failed to create file');
        }
    };

    // Handle delete file
    const handleDeleteFile = async () => {
        if (!selectedFile) return;

        try {
            await fileService.deleteFile(selectedFile.id);
            setFiles(files.filter(f => f.id !== selectedFile.id));
            setIsDeleteDialogVisible(false);
        } catch (error) {
            console.error('Error deleting file:', error);
            Alert.alert('Error', 'Failed to delete file');
        }
    };

    // Render file item
    const renderFileItem = ({ item }: { item: File }) => (
        <Card
            style={styles.fileCard}
            // onPress={() => handleFilePress(item)}
            onPress={() => navigation.navigate('FileDetail', { fileId: item.id })}

            onLongPress={() => {
                setSelectedFile(item);
                setIsMenuVisible(true);
            }}
        >
            <Card.Content>
                <View style={styles.fileHeader}>
                    <Text variant="titleMedium" style={styles.fileTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    {/* <Text variant="bodySmall" style={styles.fileType}>
                        {item.file_type}
                    </Text> */}
                </View>
                {item.description ? (
                    <Text variant="bodyMedium" style={styles.fileDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                ) : null}
                <View style={styles.fileFooter}>
                    <Text variant="labelSmall" style={styles.fileDate}>
                        {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                    <Text variant="labelSmall" style={[
                        styles.fileStatus,
                        { color: item.status === 'Active' ? theme.colors.primary : theme.colors.error }
                    ]}>
                        {item.status}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );

    // Render empty state
    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text variant="titleMedium" style={styles.emptyText}>
                No files found
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
                {searchQuery
                    ? 'Try a different search term'
                    : 'Create a new file to get started'}
            </Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search files..."
                    onChangeText={handleSearch}
                    value={searchQuery}
                    style={styles.searchBar}
                />
                <Button
                    mode="contained"
                    onPress={() => setIsCreateModalVisible(true)}
                    style={styles.addButton}
                >
                    New File
                </Button>
            </View>

            <FlatList
                data={files}
                renderItem={renderFileItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                ItemSeparatorComponent={() => <View style={styles.divider} />}
            />

            {/* Create File Dialog */}
            <Dialog visible={isCreateModalVisible} onDismiss={() => setIsCreateModalVisible(false)}>
                <Dialog.Title>Create New File</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Title"
                        value={formData.title}
                        onChangeText={(text) => setFormData({ ...formData, title: text })}
                        style={styles.input}
                        mode="outlined"
                    />
                    <TextInput
                        label="Description (Optional)"
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        multiline
                        numberOfLines={3}
                        style={[styles.input, styles.textArea]}
                        mode="outlined"
                    />
                    {/* <TextInput
                        label="File Type"
                        value={formData.file_type}
                        onChangeText={(text) => setFormData({ ...formData, file_type: text })}
                        style={styles.input}
                        mode="outlined"
                    /> */}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setIsCreateModalVisible(false)}>Cancel</Button>
                    <Button onPress={handleCreateFile}>Create</Button>
                </Dialog.Actions>
            </Dialog>

            <ConfirmationDialog
                visible={isDeleteDialogVisible}
                onCancel={() => setIsDeleteDialogVisible(false)}
                onConfirm={handleDeleteFile}

                loading={isLoading}
                danger={true}
                icon="trash-can"
                title="Delete File"
                message={`Are you sure you want to delete ${selectedFile?.title}? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmColor={theme.colors.error}
            />

            {/* File Options Menu */}
            <Menu
                visible={isMenuVisible}
                onDismiss={() => setIsMenuVisible(false)}
                anchor={{
                    x: 0,
                    y: 0,
                }}
            >
                <Menu.Item
                    onPress={() => {
                        // if (selectedFile) handleFilePress(selectedFile);
                        setIsMenuVisible(false);
                    }}
                    title="Open"
                />
                <Divider />
                {/* <Menu.Item
                    onPress={() => {
                        // Handle share
                        setIsMenuVisible(false);
                    }}
                    title="Share"
                /> */}
                {/* <Menu.Item
                    onPress={() => {
                        // Handle download
                        setIsMenuVisible(false);
                    }}
                    title="Download"
                /> */}
                <Divider />
                <Menu.Item
                    onPress={() => {
                        if (selectedFile) {
                            setFormData({
                                title: selectedFile.title,
                                description: selectedFile.description || '',
                                status: selectedFile.status,
                                created_at: new Date().toISOString(),
                                // created_by: user?.id || '',
                            });
                            setIsCreateModalVisible(true);
                        }
                        setIsMenuVisible(false);
                    }}
                    title="Edit"
                />
                <Menu.Item
                    onPress={() => {
                        setIsDeleteDialogVisible(true);
                        setIsMenuVisible(false);
                    }}
                    title="Delete"
                    titleStyle={{ color: 'red' }}
                />
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    searchBar: {
        flex: 1,
        marginRight: 8,
    },
    addButton: {
        marginLeft: 8,
    },
    listContent: {
        paddingBottom: 16,
    },
    fileCard: {
        marginBottom: 8,
        elevation: 1,
    },
    fileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    fileTitle: {
        flex: 1,
        fontWeight: 'bold',
    },
    fileType: {
        marginLeft: 8,
        color: '#666',
    },
    fileDescription: {
        color: '#666',
        marginBottom: 8,
    },
    fileFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fileDate: {
        color: '#999',
    },
    fileStatus: {
        fontWeight: 'bold',
    },
    divider: {
        height: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        color: '#666',
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
    },
    textArea: {
        minHeight: 100,
    },
});