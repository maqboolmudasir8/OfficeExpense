import React, { useEffect } from "react";
import { View, FlatList } from "react-native";
import { FAB, Text } from "react-native-paper";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types/RootStackParamList";
import { useGroupStore } from "../../store/groupStore";
import MemberListItem from "../../components/MemberListItem";
import { useAppNavigation } from "../../hooks/useAppNavigation";

type MembersRouteProp = RouteProp<RootStackParamList, "ExpenseGroupMembers">;

export default function ExpenseGroupMembersScreen() {
    const navigation = useAppNavigation<"ExpenseGroupMembers">();
    const route = useRoute<MembersRouteProp>();
    const { members, fetchGroupDetails } = useGroupStore();

    useEffect(() => {
        fetchGroupDetails(route?.params?.groupId);
    }, []);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={members}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 40 }}>
                        No members found.
                    </Text>
                }
                renderItem={({ item }) => <MemberListItem member={item} />}
            />

            <FAB
                icon="plus"
                style={{ position: "absolute", right: 16, bottom: 16 }}
                onPress={() => navigation.navigate("AddMember", { groupId: route?.params?.groupId })}
            />
        </View>
    );
}
