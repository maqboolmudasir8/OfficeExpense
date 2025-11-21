import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text, RadioButton } from "react-native-paper";
import { useGroupStore } from "../../store/groupStore";
import { useAppNavigation } from "../../hooks/useAppNavigation";

export default function CreateExpenseGroupScreen() {
    const navigation = useAppNavigation<"CreateExpenseGroup">();
    const { createGroup } = useGroupStore();

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [visibility, setVisibility] = useState("Private");

    async function handleCreate() {
        await createGroup({
            name,
            description: desc,
            visibility
        });

        navigation.goBack();
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <TextInput label="Group Name" value={name} onChangeText={setName} />

            <TextInput
                label="Description"
                value={desc}
                onChangeText={setDesc}
                style={{ marginTop: 16 }}
            />

            <Text style={{ marginTop: 24, marginBottom: 8 }}>Visibility</Text>

            <RadioButton.Group
                onValueChange={setVisibility}
                value={visibility}
            >
                <RadioButton.Item label="Private" value="Private" />
                <RadioButton.Item label="Public" value="Public" />
            </RadioButton.Group>

            <Button mode="contained" onPress={handleCreate} style={{ marginTop: 24 }}>
                Create Group
            </Button>
        </View>
    );
}
