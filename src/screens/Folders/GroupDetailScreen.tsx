// src/screens/ExpenseGroups/GroupDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, Alert } from 'react-native';
import { folderService } from '../../api/folderService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupDetail'>;

export default function GroupDetailScreen({ route, navigation }: Props) {
    const { groupId } = route.params;
    const [group, setGroup] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadGroup = async () => {
        setLoading(true);
        try {
            const data = await folderService.fetchGroupDetails(groupId);
            setGroup(data);
        } catch (error) {
            console.log('Error fetching group:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert('Confirm', 'Are you sure you want to delete this group?', [
            { text: 'Cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    try {
                        await folderService.deleteGroup(groupId);
                        Alert.alert('Deleted', 'Group deleted successfully');
                        navigation.goBack();
                    } catch (error: any) {
                        Alert.alert('Error', error.message);
                    }
                },
                style: 'destructive',
            },
        ]);
    };

    useEffect(() => {
        loadGroup();
    }, []);

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;

    if (!group) return <Text>Group not found</Text>;

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>{group.name}</Text>
            {group.description && <Text style={{ marginBottom: 20 }}>{group.description}</Text>}
            <Button title="Delete Group" color="red" onPress={handleDelete} />
        </View>
    );
}
