import React, { useContext, useEffect } from "react";
import { View, FlatList } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useFolderStore } from "../../store/folderStore";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { FolderCard } from "../../components/FolderCard";
import { AuthContext } from '../../context/AuthContext';

export default function FoldersListScreen() {
    const navigation = useAppNavigation<"FoldersList">();
    const { user } = useContext(AuthContext);
    const { folders, fetchFoldersByUserId } = useFolderStore();

    useEffect(() => {
        // console.log("USER__FoldersListScreen", user);
        fetchFoldersByUserId(user?.id ?? "");
    }, []);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={folders}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 40 }}>
                        No folders found.
                    </Text>
                }
                renderItem={({ item }) => (
                    <FolderCard
                        folder={item}
                        onPress={() => navigation.navigate("FolderDetails", { folderId: item?.id })}
                    />
                )}
            />

            <FAB
                icon="plus"
                style={{ position: "absolute", right: 16, bottom: 16 }}
                onPress={() => navigation.navigate("CreateFolderScreen")}
            />
        </View>
    );
}
