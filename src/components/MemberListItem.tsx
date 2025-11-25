import React from "react";
import { List, Text } from "react-native-paper";
import { FolderMember } from "../types/Folder";

export default function MemberListItem({ member }: { member: FolderMember }) {
    return (
        <List.Item
            title={member.full_name}
            description={`Role: ${member.permission_level}`}
            left={() => <List.Icon icon="account" />}
        />
    );
}
