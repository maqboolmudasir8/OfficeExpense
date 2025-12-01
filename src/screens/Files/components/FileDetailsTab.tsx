// src/screens/Files/components/FileDetailsTab.tsx
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
    Text,
    TextInput,
    Chip,
    ActivityIndicator
} from 'react-native-paper';
import { format } from 'date-fns';
import { File, FileStatus } from '../../../types/File';

interface FileDetailsTabProps {
    file: File | null;
    isEditing: boolean;
    formData: {
        title: string;
        description: string;
        status: FileStatus;
    };
    onFormChange: (field: string, value: string) => void;
}

export const FileDetailsTab: React.FC<FileDetailsTabProps> = ({ file, isEditing, formData, onFormChange }) => {

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

                {/* Title */}
                {isEditing ? (
                    <TextInput
                        label="Title"
                        value={formData.title}
                        onChangeText={(text) => onFormChange('title', text)}
                        style={styles.input}
                        mode="outlined"
                        error={!formData.title}
                    />
                ) : (
                    <Text style={styles.title} numberOfLines={2}>
                        {file.title || 'Untitled File'}
                    </Text>
                )}

                {/* Chips */}
                <View style={styles.metaContainer}>
                    <Chip
                        icon="calendar"
                        style={[styles.chip, styles.dateChip]}
                        textStyle={styles.chipText}
                    >
                        Created (screens - Files - Components - DetailsTab): {format(new Date(file.created_at ?? ''), 'MMM d, yyyy')}
                    </Chip>

                    <Chip
                        icon={file.status == FileStatus.Active ? 'check-circle' : 'archive'}
                        style={[
                            styles.chip,
                            styles.statusChip,
                            {
                                backgroundColor:
                                    file.status == FileStatus.Active ? '#e8f5e9' : '#fff3e0',
                            },
                        ]}
                        textStyle={[
                            styles.chipText,
                            {
                                color:
                                    file.status == FileStatus.Active ? '#2e7d32' : '#e65100',
                            },
                        ]}
                    >
                        {file.status}
                    </Chip>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    {isEditing ? (
                        <TextInput
                            label="Description"
                            value={formData.description}
                            onChangeText={(text) =>
                                onFormChange('description', text)
                            }
                            multiline
                            numberOfLines={4}
                            style={[styles.input, styles.descriptionInput]}
                            mode="outlined"
                        />
                    ) : (
                        <Text
                            style={[
                                styles.description,
                                !file.description && styles.placeholderText,
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


const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    detailSection: {
        gap: 16,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    metaContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    chip: {
        borderRadius: 16,
    },
    chipText: {
        fontSize: 13,
    },
    dateChip: {},
    statusChip: {},
    section: {
        marginTop: 12,
    },
    sectionTitle: {
        fontWeight: '600',
        marginBottom: 8,
        fontSize: 16,
    },
    descriptionInput: {
        minHeight: 120,
    },
    description: {
        fontSize: 14,
        color: '#444',
    },
    placeholderText: {
        color: '#aaa',
        fontStyle: 'italic',
    },
    input: {
        backgroundColor: 'white',
    },
});
