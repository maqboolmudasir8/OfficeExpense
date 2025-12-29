import React from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, ActivityIndicator, Chip } from 'react-native-paper';
import { format } from 'date-fns';
import { File, FileStatus } from '../../types/File';
import { Text } from '../Text';

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

export default function DetailsTab({ file, isEditing, formData, onFormChange }: DetailsTabProps) {
    if (!file) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Loading details...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ padding: 16 }}>
            {isEditing ? (
                <TextInput
                    label="Title"
                    mode="outlined"
                    value={formData.title}
                    onChangeText={(v) => onFormChange('title', v)}
                />
            ) : (
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{file.title}</Text>
            )}

            <Chip style={{ marginTop: 12 }}>
                Created (components - Files - DetailsTab): {format(new Date(file.created_at ?? ''), 'MMM d, yyyy')}
            </Chip>

            <View style={{ marginTop: 20 }}>
                {isEditing ? (
                    <TextInput
                        label="Description"
                        mode="outlined"
                        multiline
                        value={formData.description}
                        onChangeText={(v) => onFormChange('description', v)}
                    />
                ) : (
                    <Text>{file.description || 'No description'}</Text>
                )}
            </View>
        </ScrollView>
    );
}
