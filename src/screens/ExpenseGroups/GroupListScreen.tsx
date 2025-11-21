// src/screens/ExpenseGroups/GroupListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { fetchGroups } from '../../api/groupService';
import { RootStackParamList } from '../../types/RootStackParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'GroupList'>;

export default function GroupListScreen({ navigation }: Props) {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadGroups = async () => {
        setLoading(true);
        try {
            const data = await fetchGroups();
            setGroups(data);
        } catch (error) {
            console.log('Error fetching groups:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGroups();
    }, []);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Button title="Add Group" onPress={() => navigation.navigate('AddGroup')} />
            {loading ? (
                <ActivityIndicator size="small" />
            ) : (
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.groupCard} onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}>
                            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                            {item.description && <Text style={{ color: 'gray' }}>{item.description}</Text>}
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    groupCard: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
});
