// src/screens/Profile/EditProfileScreen.tsx
import React, { useState, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/RootStackParamList';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { TextInput } from '../../components/TextInput';

const EditProfileScreen = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const theme = useTheme();

    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateInput = () => {
        if (!firstName.trim()) {
            setError('First name is required');
            return false;
        }
        if (!lastName.trim()) {
            setError('Last name is required');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateInput()) return;

        try {
            setIsLoading(true);
            setError(null);

            await updateUser({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim()
            });

            navigation.goBack();
        } catch (error) {
            console.error('Update profile error:', error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>
            <View style={{ marginBottom: 16 }}>
                <TextInput
                    mode="outlined"
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    disabled={isLoading}
                />
            </View>

            <View style={{ marginBottom: 16 }}>
                <TextInput
                    mode="outlined"
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    disabled={isLoading}
                />
            </View>

            <View style={{ marginBottom: 24 }}>
                <TextInput
                    mode="outlined"
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    disabled={true}
                    textColor={theme.colors.onSurfaceDisabled}
                />
                <Text
                    variant="bodySmall"
                    style={{
                        marginTop: 4,
                        color: theme.colors.onSurfaceVariant,
                        marginLeft: 12
                    }}
                >
                    Contact support to change your email address
                </Text>
            </View>

            <Button
                label="Save Changes"
                mode="contained"
                onPress={handleSave}
                loading={isLoading}
                disabled={isLoading || !firstName.trim() || !lastName.trim()}
                labelStyle={{ color: theme.colors.onPrimary }}
            />
        </ScrollView>
    );
};

export default EditProfileScreen;