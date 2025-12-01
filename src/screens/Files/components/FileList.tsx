import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { File } from "../../../types/File";
import { FileCard } from "./FileCard";

interface FileListProps {
    files: File[];
    onOpen: (file: File) => void;
    onMenu: (file: File) => void;
    isRefreshing: boolean;
    onRefresh: () => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onOpen, onMenu, isRefreshing, onRefresh }) => {
    return (
        <FlatList
            data={files}
            keyExtractor={(item) => item?.id?.toString() ?? "0"}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            contentContainerStyle={styles.container}
            ListEmptyComponent={
                <View style={styles.empty}>
                    <Text variant="titleMedium">No files found</Text>
                </View>
            }
            renderItem={({ item }) => (
                <FileCard
                    file={item}
                    onPress={() => onOpen(item)}
                    onLongPress={() => onMenu(item)}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: { paddingBottom: 20 },
    empty: { padding: 30, alignItems: "center" },
});