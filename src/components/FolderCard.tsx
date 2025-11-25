// components/FolderCard.tsx
import React from 'react';
import { Card, useTheme, Avatar, Text } from 'react-native-paper';
import { Folder } from '../types/Folder';

interface FolderCardProps {
    group: Folder;
    onPress: () => void;
}

export const FolderCard = ({ group, onPress }: FolderCardProps) => {
    const theme = useTheme();

    return (
        <Card
            style={{ marginBottom: 12, backgroundColor: group.color_code ? `${group.color_code}20` : undefined }}
            onPress={onPress}
        >
            <Card.Title
                title={group.title}
                subtitle={group.description}
                left={props => (
                    <Avatar.Icon
                        {...props}
                        icon={group.icon || 'folder'}
                        style={{ backgroundColor: group.color_code || theme.colors.primary }}
                    />
                )}
            />
            <Card.Content>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {group.visibility} • {group.status}
                </Text>
            </Card.Content>
        </Card>
    );
};