import React, { useContext, useEffect } from "react";
import { View, FlatList } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useGroupStore } from "../../store/groupStore";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { FolderCard } from "../../components/FolderCard";
import { AuthContext } from '../../context/AuthContext';

export default function FoldersListScreen() {
    const navigation = useAppNavigation<"FoldersList">();
    const { user } = useContext(AuthContext);
    const { groups, fetchGroupsByUserId } = useGroupStore();

    useEffect(() => {
        // console.log("USER__FoldersListScreen", user);
        fetchGroupsByUserId(user?.id);
    }, []);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={groups}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 40 }}>
                        No groups found.
                    </Text>
                }
                renderItem={({ item }) => (
                    <FolderCard
                        group={item}
                        onPress={() => navigation.navigate("FolderDetails", { groupId: item?.id })}
                    />
                )}
            />

            <FAB
                icon="plus"
                style={{ position: "absolute", right: 16, bottom: 16 }}
                onPress={() => navigation.navigate("CreateExpenseGroup")}
            />
        </View>
    );
}
