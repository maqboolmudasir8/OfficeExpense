// src/screens/Auth/LoginScreen.tsx
import React, { useContext, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useTheme, Card } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from '../../context/AuthContext';
import { RootStackParamList } from '../../types/RootStackParamList';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { TextInput } from '../../components/TextInput';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ field?: 'email' | 'password' | 'general'; message: string } | null>(null);
    const { signIn } = useContext(AuthContext);
    const theme = useTheme();

    const validateForm = (): boolean => {
        if (!email.trim()) {
            setError({ field: 'email', message: 'Email is required' });
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError({ field: 'email', message: 'Please enter a valid email' });
            return false;
        }
        if (!password) {
            setError({ field: 'password', message: 'Password is required' });
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            await signIn(email, password);
        } catch (err: any) {
            setError({
                field: 'general',
                message: err.message || 'Failed to sign in. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            <Card style={styles.card}>
                <Text variant="headlineMedium" style={styles.title}>
                    Welcome Back
                </Text>

                <Text variant="bodyMedium" style={styles.subtitle}>
                    Sign in to continue
                </Text>

                {error?.field === 'general' && (
                    <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                        {error.message}
                    </Text>
                )}

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        if (error?.field === 'email') setError(null);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    leftIcon="email"
                    error={error?.field === 'email'}
                    errorText={error?.field === 'email' ? error.message : undefined}
                    style={styles.input}
                />

                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        if (error?.field === 'password') setError(null);
                    }}
                    secureTextEntry
                    leftIcon="lock"
                    error={error?.field === 'password'}
                    errorText={error?.field === 'password' ? error.message : undefined}
                    style={styles.input}
                />

                <Button
                    label="Login"
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    icon="login"
                />

                {/* <Button
                    mode="text"
                    label={"Don't have an account? Sign Up"}
                    onPress={() => navigation.navigate('Signup')}
                    style={styles.signupButton}
                    textStyle={styles.signupText}
                /> */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Signup')}
                    style={styles.signupButton}
                >
                    <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                        Don't have an account? Sign Up
                    </Text>
                </TouchableOpacity>
            </Card>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    card: {
        padding: 24,
        borderRadius: 8,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24,
        color: 'rgba(0, 0, 0, 0.6)',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        marginBottom: 16,
    },
    signupButton: {
        alignItems: 'center',
        padding: 8,
    },
    errorText: {
        marginBottom: 16,
        textAlign: 'center',
    },
});