// src/components/FolderDetails/MembersTab.tsx
import React, { useContext, useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Avatar, IconButton, ActivityIndicator } from "react-native-paper";
import { FolderMember, PermissionLevel } from "../../types/Folder";
import { Text } from "../Text";
import { Button } from "../Button";
import { Dropdown } from "../Dropdown";
import { TextInput } from "../TextInput";
import { AuthContext } from "../../context/AuthContext";

interface MembersTabProps {
    members: FolderMember[];
    currentUserId: string;
    folderId: number;
    onAddMember: (email: string, permission: PermissionLevel) => Promise<void>;
    onRemoveMember: (member: FolderMember) => Promise<void>;
    onUpdateMember: (member: FolderMember, permission: PermissionLevel) => Promise<void>;
    canEdit: boolean;
    isLoading?: boolean;
}

export const MembersTab: React.FC<MembersTabProps> = ({
    members,
    currentUserId,
    onAddMember,
    onRemoveMember,
    onUpdateMember,
    canEdit,
    isLoading = false,
}) => {
    const { users } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [permission, setPermission] = useState<PermissionLevel>(PermissionLevel.Contributor);
    const [isAdding, setIsAdding] = useState(false);

    console.log("isLoading____MembersTab", isLoading);
    console.log("members____MembersTab", members);
    console.log("users from context____MembersTab", users);

    const handleAddMember = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "Please enter an email");
            return;
        }

        try {
            setIsAdding(true);
            await onAddMember(email.trim(), permission);
            setEmail("");
            setPermission(PermissionLevel.Contributor);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to add member");
        } finally {
            setIsAdding(false);
        }
    };

    const renderMemberItem = (member: FolderMember) => {
        const isCurrentUser = member.user_id === currentUserId;
        const canEditMember = canEdit && !isCurrentUser;
        const user = users.find(u => u.id === member.user_id);
        const userName = user ? `${user.first_name} ${user.last_name}`.trim() : member.user_name || 'Unknown User';
        const userEmail = user?.email || member.user_email || '';
        const userInitial = userName[0]?.toUpperCase() || 'U';

        const permissionColors = {
            [PermissionLevel.Viewer]: { bg: "#f5f5f5", color: "#424242" },
            [PermissionLevel.Contributor]: { bg: "#e3f2fd", color: "#1565c0" },
            [PermissionLevel.Editor]: { bg: "#e8f5e9", color: "#2e7d32" },
        };

        return (
            <View key={member.id} style={styles.memberItem}>
                <Avatar.Text
                    size={40}
                    label={userInitial}
                    style={{ backgroundColor: "#e0e0e0" }}
                />

                <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{userName}</Text>
                    <Text style={styles.memberEmail}>{userEmail}</Text>

                    {/* <View
                        style={[
                            styles.permissionBadge,
                            { backgroundColor: permissionColors[member.permission_level].bg },
                        ]}
                    >
                        <Text
                            style={[
                                styles.permissionText,
                                { color: permissionColors[member.permission_level].color },
                            ]}
                        >
                            {member.permission_level}
                        </Text>
                    </View> */}
                </View>

                {canEdit && (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {/* <Dropdown
                            options={[
                                { label: "Viewer", value: PermissionLevel.Viewer },
                                { label: "Contributor", value: PermissionLevel.Contributor },
                                { label: "Editor", value: PermissionLevel.Editor },
                            ]}
                            value={member.permission_level}
                            onSelect={(value) =>
                                onUpdateMember(member, value as PermissionLevel)
                            }
                            style={{ minWidth: 140 }}
                            mode="outlined"
                        /> */}

                        {canEditMember && (
                            <IconButton
                                icon="delete"
                                size={20}
                                onPress={() => onRemoveMember(member)}
                                style={styles.actionButton}
                            />
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {canEdit && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Add Member</Text>

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    {/* <Dropdown
                        label="Permission Level"
                        options={[
                            { label: "Viewer", value: PermissionLevel.Viewer },
                            { label: "Contributor", value: PermissionLevel.Contributor },
                            { label: "Editor", value: PermissionLevel.Editor },
                        ]}
                        value={permission}
                        onSelect={(value) => setPermission(value as PermissionLevel)}
                        style={{ marginTop: 8 }}
                        mode="outlined"
                    /> */}

                    <Button
                        label="Add Member"
                        mode="contained"
                        onPress={handleAddMember}
                        loading={isAdding}
                        disabled={!email || isAdding}
                        style={styles.addButton}
                    />
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Team Members</Text>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" />
                    </View>
                ) : members.length > 0 ? (
                    <View style={styles.memberList}>{members.map(renderMemberItem)}</View>
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No members added yet</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    section: { marginBottom: 24 },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
        color: "#333",
    },
    memberList: {
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
    },
    memberItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    memberInfo: { flex: 1, marginLeft: 12 },
    memberName: { fontSize: 15, fontWeight: "500", color: "#333" },
    memberEmail: { fontSize: 13, color: "#666", marginTop: 2 },
    permissionBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 4,
        alignSelf: "flex-start",
    },
    permissionText: { fontSize: 12, fontWeight: "500" },
    emptyState: { padding: 16, alignItems: "center" },
    emptyText: { color: "#666" },
    loadingContainer: { padding: 16, alignItems: "center" },
    addButton: { marginTop: 8 },
    actionButton: { marginLeft: 12 },
});