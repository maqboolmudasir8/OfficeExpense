// src/screens/ExpenseGroups/AddGroupScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { createGroup } from '../../api/groupService';
import { RootStackParamList } from '../../types/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'AddGroup'>;

export default function AddGroupScreen({ navigation }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddGroup = async () => {
        if (!name) return Alert.alert('Error', 'Group name is required');
        setLoading(true);
        try {
            await createGroup(name, description || null);
            Alert.alert('Success', 'Group created successfully');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TextInput
                placeholder="Group Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Description (optional)"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            <Button title={loading ? 'Creating...' : 'Create Group'} onPress={handleAddGroup} disabled={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 6 },
});
