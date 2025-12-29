import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { File } from "../../../types/File";
import { FileCard } from "./FileCard";
import { globalStyles } from "../../../styles/globalStyles";

interface FileListProps {
    files: File[];
    onOpen: (file: File) => void;
    onMenu: (file: File) => void;
    isRefreshing: boolean;
    onRefresh: () => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onOpen, onMenu, isRefreshing, onRefresh }) => {
    const theme = useTheme();
    return (
        <FlatList
            data={files}
            keyExtractor={(item) => item?.id?.toString() ?? "0"}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            contentContainerStyle={[styles.container]}
            ListEmptyComponent={
                <View style={[styles.empty, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        No files found
                    </Text>
                </View>
            }
            renderItem={({ item }) => (
                <FileCard
                    file={item}
                    onPress={() => onOpen(item)}
                    onMenuPress={() => onMenu(item)}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    empty: {
        flex: 1,
        padding: 30,
    },
});