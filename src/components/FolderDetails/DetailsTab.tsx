// src/components/folders/DetailsTab.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, Switch, Button } from 'react-native';
import { TextInput, useTheme, Text, Card, Chip, Avatar } from 'react-native-paper';
import { Folder } from '../../types/Folder';

interface DetailsTabProps {
    group: Folder;
    isEditing: boolean;
    formData: {
        title: string;
        description: string;
        status: string;
        visibility: 'Private' | 'Public';
        color_code: string;
        icon: string;
    };
    onFormDataChange: (data: any) => void;
}

export const DetailsTab: React.FC<DetailsTabProps> = ({
    group,
    isEditing,
    formData,
    onFormDataChange,
}: DetailsTabProps) => (
    <ScrollView style={styles.tabContent}>
        <Card style={styles.card}>
            <Card.Title
                title={
                    isEditing ? (
                        <TextInput
                            label="Title"
                            value={formData.title}
                            onChangeText={(text) =>
                                onFormDataChange({ ...formData, title: text })
                            }
                            style={styles.input}
                            mode="outlined"
                            dense
                        />
                    ) : (
                        group.title
                    )
                }
                subtitle={
                    isEditing ? (
                        <TextInput
                            label="Description"
                            value={formData.description}
                            onChangeText={(text) =>
                                onFormDataChange({ ...formData, description: text })
                            }
                            multiline
                            numberOfLines={2}
                            style={[styles.input, styles.descriptionInput]}
                            mode="outlined"
                            dense
                        />
                    ) : (
                        group.description
                    )
                }
                left={props => (
                    <Avatar.Icon
                        {...props}
                        icon={formData.icon || 'folder'}
                        style={{ backgroundColor: formData.color_code }}
                        color="white"
                    />
                )}
            // right={() => (
            //     <View style={styles.actionButtons}>
            //         {isEditing ? (
            //             <>
            //                 <Button onPress={onSave} mode="contained" style={styles.button}>
            //                     Save
            //                 </Button>
            //                 <Button onPress={onCancelEdit} style={styles.button}>
            //                     Cancel
            //                 </Button>
            //             </>
            //         ) : canEdit ? (
            //             <IconButton
            //                 icon="pencil"
            //                 onPress={onEditPress}
            //                 iconColor={theme.colors.primary}
            //             />
            //         ) : null}
            //     </View>
            // )}
            />
            <Card.Content>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    {isEditing ? (
                        <Switch
                            value={formData.status === 'Active'}
                            onValueChange={(value) =>
                                onFormDataChange({
                                    ...formData,
                                    status: value ? 'Active' : 'Archived',
                                })
                            }
                        />
                    ) : (
                        <Chip
                            icon={group.status === 'Active' ? 'check-circle' : 'archive'}
                            style={styles.statusChip}
                        >
                            {group.status}
                        </Chip>
                    )}
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Visibility:</Text>
                    {isEditing ? (
                        <Switch
                            value={formData.visibility === 'Public'}
                            onValueChange={(value) =>
                                onFormDataChange({
                                    ...formData,
                                    visibility: value ? 'Public' : 'Private',
                                })
                            }
                        />
                    ) : (
                        <Chip
                            icon={group.visibility === 'Public' ? 'earth' : 'lock'}
                            style={styles.visibilityChip}
                        >
                            {group.visibility}
                        </Chip>
                    )}
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Created:</Text>
                    <Text>{new Date(group.created_at).toLocaleDateString()}</Text>
                </View>
            </Card.Content>
            {/* {!isEditing && (
                <Card.Actions style={styles.cardActions}>
                    <Button
                        mode="outlined"
                        onPress={onDeletePress}
                        textColor="red"
                        loading={isDeleting}
                        disabled={isDeleting}
                    >
                        Delete Folder
                    </Button>
                </Card.Actions>
            )} */}
        </Card>
    </ScrollView>
);



const styles = StyleSheet.create({
    label: {
        marginTop: 8,
        color: 'rgba(0, 0, 0, 0.6)',
    },
    value: {
        marginBottom: 16,
    },

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    saveButton: {
        marginTop: 16,
    },
    tabContent: {
        // flex: 1,
        padding: 16,
    },
    card: {
        margin: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    detailLabel: {
        fontWeight: 'bold',
        marginRight: 8,
    },
    statusChip: {
        backgroundColor: '#e3f2fd',
    },
    visibilityChip: {
        backgroundColor: '#e8f5e9',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        marginHorizontal: 4,
    },
    cardActions: {
        justifyContent: 'flex-end',
    },
    searchBar: {
        margin: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    avatar: {
        backgroundColor: '#e0e0e0',
    },
    dialogInput: {
        marginBottom: 16,
    },
    permissionLabel: {
        marginTop: 8,
        marginBottom: 4,
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
    },
    permissionButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    permissionChip: {
        margin: 4,
    },
    colorPreview: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    descriptionInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
});