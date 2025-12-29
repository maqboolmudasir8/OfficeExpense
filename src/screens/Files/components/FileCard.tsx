import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, useTheme, IconButton, Avatar } from "react-native-paper";
import { File, FileStatus, FileVisibility } from "../../../types/File";
import { Text } from "../../../components/Text";

interface FileCardProps {
    file: File;
    onPress: () => void;
    onMenuPress: () => void; // renamed for clarity
}

export const FileCard: React.FC<FileCardProps> = ({ file, onPress, onMenuPress }) => {
    const theme = useTheme();

    const statusColor = file.status === FileStatus.Active
        ? theme.colors.primary
        : theme.colors.error;

    return (
        <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={onPress}
        >
            <Card.Content style={styles.cardContent}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Avatar.Icon
                            size={40}
                            icon='file-document-edit'
                            style={[
                                styles.avatar,
                                { backgroundColor: theme.colors.primaryContainer }
                            ]}
                            color={theme.colors.onPrimaryContainer}
                        />
                        <View style={styles.titleWrapper}>
                            <Text
                                variant="titleMedium"
                                style={[styles.title, { color: theme.colors.onSurface }]}
                                numberOfLines={1}
                            >
                                {file.title}
                            </Text>
                            {file.description && (
                                <Text
                                    variant="bodyMedium"
                                    style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
                                    numberOfLines={2}
                                >
                                    {file.description}
                                </Text>
                            )}
                        </View>
                    </View>
                    <IconButton
                        icon="dots-vertical"
                        size={20}
                        onPress={onMenuPress}
                        style={styles.menuButton}
                    />
                </View>

                <View style={styles.footer}>
                    <View style={styles.metaContainer}>
                        <Text
                            variant="labelSmall"
                            style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}
                        >
                            {file.created_at && new Date(file.created_at).toLocaleDateString()}
                        </Text>
                        {file.visibility && (
                            <Text
                                variant="labelSmall"
                                style={[styles.metaText, { color: theme.colors.onSurfaceVariant }]}
                            >
                                • {file.visibility}
                            </Text>
                        )}
                        {file.status && (
                            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                                <Text
                                    variant="labelSmall"
                                    style={[styles.statusText, { color: statusColor }]}
                                >
                                    {file.status}
                                </Text>
                            </View>
                        )}
                    </View>
                    <IconButton
                        icon="chevron-right"
                        size={24}
                        onPress={onPress}
                        style={styles.arrowIcon}
                    />
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        marginHorizontal: 4,
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardContent: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
    },
    avatar: {
        marginRight: 12,
    },
    titleWrapper: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontWeight: '500',
        marginBottom: 4,
    },
    description: {
        opacity: 0.8,
    },
    menuButton: {
        margin: -8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.08)',
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        flex: 1,
    },
    metaText: {
        marginRight: 8,
        opacity: 0.7,
    },
    statusBadge: {
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 8,
    },
    statusText: {
        fontWeight: '500',
    },
    arrowIcon: {
        margin: -8,
    },
});