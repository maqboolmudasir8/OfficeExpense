// screens/ExpenseGroups/CreateExpenseGroupScreen.tsx
import React, { useContext, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { useGroupStore } from '../../store/groupStore';
import { AuthContext } from '../../context/AuthContext';

export default function CreateExpenseGroupScreen() {
    const theme = useTheme();
    const navigation = useAppNavigation<"CreateExpenseGroup">();
    const { createGroup } = useGroupStore();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        visibility: 'Private' as const,
        color_code: '#2196F3',
        icon: 'folder',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateGroup = async () => {
        if (!formData.title.trim()) {
            Alert.alert('Please enter a group name');
            return;
        }

        try {
            setIsSubmitting(true);
            await createGroup({
                ...formData,
                created_by: user?.id,
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error creating group:', error);
            Alert.alert('Failed to create group. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>
            <TextInput
                label="Group Name"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                style={{ marginBottom: 16 }}
                autoFocus
            />

            <TextInput
                label="Description"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
                style={{ marginBottom: 16 }}
            />

            <TextInput
                label="Color Code"
                value={formData.color_code}
                onChangeText={(text) => setFormData({ ...formData, color_code: text })}
                style={{ marginBottom: 16 }}
            />

            <TextInput
                label="Icon"
                value={formData.icon}
                onChangeText={(text) => setFormData({ ...formData, icon: text })}
                style={{ marginBottom: 24 }}
            />

            <Button
                mode="contained"
                onPress={handleCreateGroup}
                loading={isSubmitting}
                disabled={isSubmitting}
            >
                Create Group
            </Button>
        </ScrollView>
    );
}