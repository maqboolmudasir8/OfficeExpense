// components/FolderCard.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, useTheme, Avatar, IconButton } from 'react-native-paper';
import { Folder, FolderStatus, FolderVisibility } from '../types/Folder';
import { globalStyles } from '../styles/globalStyles';
import { Text } from './Text';

interface FolderCardProps {
    folder: Folder;
    onPress: () => void;
}

const getStatusColor = (status: string, theme: any) => {
    switch (status) {
        case FolderStatus.Active:
            return theme.colors.primary;
        case FolderStatus.Archived:
            return theme.colors.error;
        default:
            return theme.colors.outline;
    }
};

export const FolderCard = ({ folder, onPress }: FolderCardProps) => {
    const theme = useTheme();
    const statusColor = getStatusColor(folder.status, theme);

    return (
        <Card
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderLeftWidth: 4,
                    borderLeftColor: folder.color_code || theme.colors.primary,
                }
            ]}
            onPress={onPress}
        >
            <Card.Content style={styles.cardContent}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Avatar.Icon
                            size={40}
                            icon={folder.icon || 'folder'}
                            style={[
                                styles.avatar,
                                { backgroundColor: folder.color_code || theme.colors.primary }
                            ]}
                            color="#fff"
                        />
                        <View style={styles.titleWrapper}>
                            <Text
                                variant="titleMedium"
                                style={[styles.title, { color: theme.colors.onSurface }]}
                                numberOfLines={1}
                            >
                                {folder.title}
                            </Text>
                            {folder.description ? (
                                <Text
                                    variant="bodyMedium"
                                    style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
                                    numberOfLines={2}
                                >
                                    {folder.description}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    <IconButton
                        icon="chevron-right"
                        size={24}
                        onPress={onPress}
                        style={styles.arrowIcon}
                    />
                </View>

                {/* <View style={styles.footer}>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                        <View style={styles.statusIcon}>
                            <Icon
                                source={folder.status === FolderStatus.Archived ? 'archive' : 'folder-open'}
                                size={14}
                                color={statusColor}
                            />
                        </View>
                        <Text
                            variant="labelSmall"
                            style={[styles.statusText, { color: statusColor }]}
                        >
                            {folder.status}
                        </Text>
                    </View>

                    <View style={styles.visibilityBadge}>
                        <View style={styles.visibilityIcon}>
                            <Icon
                                source={folder.visibility === FolderVisibility.Private ? 'lock' : 'earth'}
                                size={14}
                                color={theme.colors.onSurfaceVariant}
                            />
                        </View>
                        <Text
                            variant="labelSmall"
                            style={[styles.visibilityText, { color: theme.colors.onSurfaceVariant }]}
                        >
                            {folder.visibility}
                        </Text>
                    </View>
                </View> */}
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        marginHorizontal: 4,
        elevation: 1,
        overflow: 'hidden',
    },
    cardContent: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    avatar: {
        marginRight: 12,
    },
    titleWrapper: {
        flex: 1,
    },
    title: {
        fontWeight: '500',
        marginBottom: 2,
    },
    description: {
        opacity: 0.8,
    },
    arrowIcon: {
        margin: -12,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 8,
    },
    statusIcon: {
        marginRight: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        fontWeight: '500',
    },
    visibilityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    visibilityIcon: {
        marginRight: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    visibilityText: {
        fontWeight: '500',
    },
});