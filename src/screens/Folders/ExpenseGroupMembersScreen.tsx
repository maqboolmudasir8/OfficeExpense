// components/FolderMembersList.tsx
import React from 'react';
import { View, FlatList } from 'react-native';
import { Avatar, List, Text, Button } from 'react-native-paper';
import { User } from '../../types/User';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/RootStackParamList';

interface FolderMembersListProps {
    members: Array<{
        user_id: string;
        user: User;
        permission_level: 'Viewer' | 'Contributor' | 'Editor';
    }>;
    onEditMember?: (userId: string) => void;
    onRemoveMember?: (userId: string) => void;
    currentUserId?: string;
    type: "ExpenseGroupMembers";
}


export default function ExpenseGroupMembersScreen({
    members,
    onEditMember,
    onRemoveMember,
    currentUserId
}: FolderMembersListProps) {
    return (
        <FlatList
            data={members}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => (
                <List.Item
                    title={item.user.full_name || item.user.email}
                    description={item.permission_level}
                    left={props => (
                        <Avatar.Text
                            size={40}
                            label={item.user.full_name?.charAt(0) || item.user.email?.charAt(0).toUpperCase() || 'U'}
                        />
                    )}
                    right={props => (
                        currentUserId !== item.user_id && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Button
                                    onPress={() => onEditMember?.(item.user_id)}
                                    mode="text"
                                >
                                    Edit
                                </Button>
                                <Button
                                    onPress={() => onRemoveMember?.(item.user_id)}
                                    mode="text"
                                    textColor="red"
                                >
                                    Remove
                                </Button>
                            </View>
                        )
                    )}
                />
            )}
        />
    );
};