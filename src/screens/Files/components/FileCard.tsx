import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { File, FileStatus } from "../../../types/File";

interface FileCardProps {
    file: File;
    onPress: () => void;
    onLongPress: () => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onPress, onLongPress }) => {
    const theme = useTheme();

    const statusColor =
        file.status === FileStatus.Active
            ? theme.colors.primary
            : theme.colors.error;

    return (
        <Card style={styles.card} onPress={onPress} onLongPress={onLongPress}>
            <Card.Content>

                {/* Title */}
                <View style={styles.header}>
                    <Text variant="titleMedium" numberOfLines={1} style={styles.title}>
                        {file.title}
                    </Text>
                </View>

                {/* Description */}
                {file.description ? (
                    <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
                        {file.description}
                    </Text>
                ) : null}

                {/* Tags: Status + Visibility */}
                <View style={styles.tagsRow}>
                    {file.status && (
                        <Text
                            variant="labelSmall"
                            style={[styles.tag, { color: statusColor }]}
                        >
                            {file.status}
                        </Text>
                    )}

                    {file.visibility && (
                        <Text
                            variant="labelSmall"
                            style={[styles.tag, { color: theme.colors.secondary }]}
                        >
                            {file.visibility}
                        </Text>
                    )}
                </View>

                {/* Footer metadata */}
                <View style={styles.footer}>

                    <Text variant="labelSmall">
                        Created at: {file.created_at ? new Date(file.created_at).toLocaleDateString() : "-"}
                    </Text>


                    <Text variant="labelSmall">
                        Created by: {file.created_by ? file.created_by : ""}

                    </Text>
                    {file.updated_at && (
                        <Text variant="labelSmall">
                            Updated at: {file.updated_at ? new Date(file.updated_at).toLocaleDateString() : "-"}
                        </Text>
                    )}

                    {file.updated_by && (
                        <Text variant="labelSmall">
                            Updated by: {file.updated_by ? file.updated_by : ""}
                        </Text>
                    )}

                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: { marginBottom: 8 },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    title: { fontWeight: "bold" },
    description: { color: "#666", marginBottom: 6 },
    tagsRow: { flexDirection: "row", gap: 12, marginBottom: 6 },
    tag: { fontWeight: "bold" },
    footer: {
        flexDirection: "column",
        marginTop: 4,
        gap: 2,
    },
});