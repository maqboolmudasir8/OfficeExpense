// src/screens/Auth/SignupScreen.tsx
import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Card, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';
import { AuthContext } from '../../context/AuthContext';
import { Icon } from '../../components/Icon';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
    const theme = useTheme();
    const { signUp } = useContext(AuthContext);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return Alert.alert('Error', 'Please fill all fields');
        }
        if (password !== confirmPassword) {
            return Alert.alert('Error', 'Passwords do not match');
        }

        try {
            setLoading(true);
            await signUp(email, password, firstName, lastName);
            Alert.alert('Success', 'Account created successfully');
            // navigation.replace('Home');
        } catch (error: any) {
            Alert.alert('Signup failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Card.Content>
                    <Text variant="headlineMedium" style={{ marginBottom: 24, textAlign: 'center', color: theme.colors.onSurface }}>
                        Create Account
                    </Text>

                    <TextInput
                        label="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                        left={<TextInput.Icon icon="account" color={theme.colors.primary} />}
                    />

                    <TextInput
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                        left={<TextInput.Icon icon="account" color={theme.colors.primary} />}
                    />

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        left={<TextInput.Icon icon="email" color={theme.colors.primary} />}
                    />

                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                        secureTextEntry
                        left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
                    />

                    <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                        secureTextEntry
                        left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSignup}
                        style={styles.button}
                        contentStyle={{ paddingVertical: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                        loading={loading}
                        disabled={loading}
                        buttonColor={theme.colors.primary}
                        icon={!loading ? () => <Icon name="account-plus" size={20} color="#fff" /> : undefined}
                    >
                        Sign Up
                    </Button>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={styles.loginContainer}
                    >
                        <Text variant="bodyMedium" style={{ color: theme.colors.primary, textAlign: 'center', marginTop: 16 }}>
                            Already have an account? Login
                        </Text>
                    </TouchableOpacity>
                </Card.Content>
            </Card>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    card: {
        borderRadius: 12,
        elevation: 3,
        paddingVertical: 24,
        paddingHorizontal: 16,
        marginHorizontal: 8,
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    button: {
        borderRadius: 8,
        marginTop: 8,
    },
    loginContainer: {
        marginTop: 8,
        alignSelf: 'center',
    },
});
