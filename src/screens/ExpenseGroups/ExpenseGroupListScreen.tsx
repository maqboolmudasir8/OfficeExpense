import React, { useEffect } from "react";
import { View, FlatList } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useGroupStore } from "../../store/groupStore";
import GroupCard from "../../components/GroupCard";
import { useAppNavigation } from "../../hooks/useAppNavigation";

export default function ExpenseGroupListScreen() {
    const navigation = useAppNavigation<"ExpenseGroupList">();
    const { groups, fetchGroups } = useGroupStore();

    useEffect(() => {
        fetchGroups(); // fetch groups from store/backend
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
                    <GroupCard
                        group={item}
                        onPress={() => navigation.navigate("ExpenseGroupDetails", { groupId: item?.id })}
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
