// src/screens/Files/AddFileMemberScreen.tsx
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
    Text,
    Button,
    TextInput,
    useTheme,
    ActivityIndicator,
    List,
    Chip,
    Divider,
    HelperText
} from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
import { fileService } from '../../api/fileService';
import { PermissionLevel } from '../../types/Folder';
import { SupabaseUser } from '../../types/User';
import { supabase } from '../../api/supabaseClient';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { AuthContext } from '../../context/AuthContext';

type AddFileMemberRouteParams = {
    fileId: number;
};

type RootStackParamList = {
    AddFileMember: { fileId: number };
};

// type AddFileMemberScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddFileMember'>;

export default function AddFileMemberScreen() {
    const theme = useTheme();
    // const navigation = useNavigation<AddFileMemberScreenNavigationProp>();
    const navigation = useAppNavigation<"AddFileMember">();
    const route = useRoute<RouteProp<{ params: AddFileMemberRouteParams }, 'params'>>();
    const { user } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState<PermissionLevel>(PermissionLevel.Viewer);
    const [searchResults, setSearchResults] = useState<SupabaseUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const searchUsers = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            // Implement user search API call
            // This is a placeholder - replace with your actual user search implementation
            const { data, error } = await supabase
                .from('users')
                // .select('id, email, full_name')
                .select('*')
                .ilike('email', `%${query}%`)
                .limit(5);

            if (error) throw error;
            setSearchResults(data || []);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddMember = async (userEmail: string) => {
        if (!userEmail) return;

        try {
            setIsAdding(true);
            await fileService.addFileMember(route.params.fileId, userEmail, permission);
            Alert.alert('Success', 'Member added successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error adding member:', error);
            Alert.alert('Error', 'Failed to add member');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        searchUsers(text);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    style={styles.input}
                />

                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionLabel}>Permission Level:</Text>
                    <View style={styles.permissionChips}>
                        {['Viewer', 'Editor', 'Admin'].map((level) => (
                            <Chip
                                key={level}
                                selected={permission === level}
                                onPress={() => setPermission(level as PermissionLevel)}
                                style={[
                                    styles.permissionChip,
                                    permission === level && styles.selectedPermissionChip,
                                ]}
                                textStyle={permission === level ? styles.selectedPermissionText : undefined}
                            >
                                {level}
                            </Chip>
                        ))}
                    </View>
                </View>

                <View style={styles.searchResults}>
                    {isSearching ? (
                        <ActivityIndicator style={styles.centered} />
                    ) : searchResults.length > 0 ? (
                        <List.Section>
                            <List.Subheader>Search Results</List.Subheader>
                            {searchResults.map((user) => (
                                <List.Item
                                    key={user.id}
                                    title={user.email}
                                    description={user.full_name}
                                    left={props => <List.Icon {...props} icon="account" />}
                                    onPress={() => {
                                        setEmail(user?.email ?? '');
                                        setSearchResults([]);
                                    }}
                                />
                            ))}
                        </List.Section>
                    ) : email ? (
                        <HelperText type="info">
                            No users found with this email
                        </HelperText>
                    ) : null}
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    mode="contained"
                    onPress={() => handleAddMember(email)}
                    disabled={!email || isAdding}
                    loading={isAdding}
                    style={styles.addButton}
                >
                    Add Member
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        padding: 16,
        flex: 1,
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    permissionContainer: {
        marginBottom: 24,
    },
    permissionLabel: {
        marginBottom: 8,
        fontWeight: '500',
    },
    permissionChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    permissionChip: {
        margin: 4,
        backgroundColor: '#f5f5f5',
    },
    selectedPermissionChip: {
        backgroundColor: '#e3f2fd',
    },
    selectedPermissionText: {
        color: '#1976d2',
    },
    searchResults: {
        flex: 1,
    },
    centered: {
        padding: 16,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#f9f9f9',
    },
    addButton: {
        width: '100%',
    },
});