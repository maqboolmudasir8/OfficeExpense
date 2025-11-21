import React from "react";
import { List, Text } from "react-native-paper";
import { GroupMember } from "../types/ExpenseGroup";

export default function MemberListItem({ member }: { member: GroupMember }) {
    return (
        <List.Item
            title={member.full_name}
            description={`Role: ${member.permission_level}`}
            left={() => <List.Icon icon="account" />}
        />
    );
}
