import React, { useContext, useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Text, Button, Card, Portal, Dialog, useTheme } from "react-native-paper";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/RootStackParamList";
import { useGroupStore } from "../../store/groupStore";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { AuthContext } from '../../context/AuthContext';

type DetailsRouteProp = RouteProp<RootStackParamList, "ExpenseGroupDetails">;

export default function ExpenseGroupDetailsScreen() {
    const theme = useTheme();
    const navigation = useAppNavigation<"ExpenseGroupDetails">();
    const route = useRoute<DetailsRouteProp>();
    const { selectedGroup, fetchGroupDetails, deleteGroup } = useGroupStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        fetchGroupDetails(route.params.groupId);
    }, []);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteGroup(selectedGroup!.id);
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "Failed to delete group. Please try again.");
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    if (!selectedGroup) return null;
    console.log("selectedGroup", selectedGroup);

    // Get current user ID
    const { user: currentUser } = useContext(AuthContext);

    // Check if current user is the creator of the group
    // const isCreator = currentUser?.id === selectedGroup.created_by;
    const isCreator = currentUser?.id === selectedGroup.created_by;

    return (
        <View style={{ padding: 16 }}>
            <Card>
                <Card.Title title={selectedGroup.name} />
                <Card.Content>
                    <Text>{selectedGroup.description}</Text>
                    <Text style={{ marginTop: 12 }}>
                        Visibility: {selectedGroup.visibility}
                    </Text>
                </Card.Content>
            </Card>

            <Button
                mode="outlined"
                style={{ marginTop: 16 }}
                onPress={() =>
                    navigation.navigate("ExpenseGroupMembers", { groupId: selectedGroup?.id })
                }
            >
                View Members
            </Button>

            {isCreator && (
                <Button
                    mode="contained"
                    buttonColor={theme.colors.error}
                    textColor="white"
                    style={{ marginTop: 16 }}
                    onPress={() => setShowDeleteDialog(true)}
                    loading={isDeleting}
                    disabled={isDeleting}
                >
                    Delete Group
                </Button>
            )}

            <Portal>
                <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
                    <Dialog.Title>Delete Group</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete this group? This action cannot be undone.</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button
                            onPress={handleDelete}
                            textColor={theme.colors.error}
                            loading={isDeleting}
                            disabled={isDeleting}
                        >
                            Delete
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}
