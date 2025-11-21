import React from "react";
import { Card, Text } from "react-native-paper";
import { ExpenseGroup } from "../types/ExpenseGroup";

export default function GroupCard({ group, onPress }: {
    group: ExpenseGroup;
    onPress: () => void;
}) {
    return (
        <Card onPress={onPress} style={{ marginBottom: 12 }}>
            <Card.Title title={group.name} />
            <Card.Content>
                <Text>{group.description || "No description"}</Text>
                <Text style={{ marginTop: 6, opacity: 0.6 }}>
                    Visibility: {group.visibility}
                </Text>
            </Card.Content>
        </Card>
    );
}
