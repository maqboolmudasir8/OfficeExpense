import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { TextInput, Button, Snackbar, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/RootStackParamList";
import { useFolderStore } from "../../store/folderStore";
import { useNavigation } from "@react-navigation/native";
import { PermissionLevel } from "../../types/Folder";

type AddMemberRouteProp = RouteProp<RootStackParamList, "AddMember">;

export default function AddMemberScreen() {
    const route = useRoute<AddMemberRouteProp>();
    const navigation = useNavigation();
    const { groupId } = route.params;
    const [email, setEmail] = useState("");
    const [permissionLevel, setPermissionLevel] = useState<PermissionLevel>("Viewer");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const addMember = useFolderStore((state) => state.addMember);

    const permissionLevels: PermissionLevel[] = ["Viewer", "Contributor", "Editor"];

    const handleAdd = async () => {
        if (!email.trim()) {
            setError("Please enter an email address");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await addMember(groupId, email.trim(), permissionLevel);
            navigation.goBack();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add member");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="User Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                disabled={loading}
                style={styles.input}
            />

            <Text style={styles.label}>Permission Level</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={permissionLevel}
                    onValueChange={(itemValue) => setPermissionLevel(itemValue as PermissionLevel)}
                    style={styles.picker}
                    dropdownIconColor="#6200ee"
                >
                    {permissionLevels.map((level) => (
                        <Picker.Item key={level} label={level} value={level} />
                    ))}
                </Picker>
            </View>

            <Button
                mode="contained"
                onPress={handleAdd}
                style={styles.addButton}
                loading={loading}
                disabled={loading}
            >
                Add Member
            </Button>

            <Snackbar
                visible={!!error}
                onDismiss={() => setError(null)}
                duration={3000}
                action={{
                    label: "Dismiss",
                    onPress: () => setError(null),
                }}
            >
                {error}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
        color: 'rgba(0, 0, 0, 0.6)',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 16,
        overflow: 'hidden',
    },
    picker: {
        backgroundColor: 'white',
    },
    addButton: {
        marginTop: 8,
    },
});