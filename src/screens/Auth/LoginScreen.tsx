// src/screens/Auth/LoginScreen.tsx
import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme, Card } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from '../../context/AuthContext';
import { RootStackParamList } from '../../types/RootStackParamList';
import { Icon } from '../../components/Icon';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const theme = useTheme();
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signIn(email, password);
            // navigation.replace('Home');
        } catch (error: any) {
            Alert.alert(error.message || 'Login failed');
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
                    <Text
                        variant="headlineMedium"
                        style={{ marginBottom: 24, color: theme.colors.onSurface, textAlign: 'center' }}
                    >
                        Login
                    </Text>

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                        left={<TextInput.Icon icon="email" color={theme.colors.primary} />}
                    />

                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        mode="outlined"
                        style={styles.input}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                        left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
                    />

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.button}
                        contentStyle={{ paddingVertical: 6 }}
                        loading={loading}
                        disabled={loading}
                        buttonColor={theme.colors.primary} // Set proper background
                        icon="login" // Pass icon name as string (Paper will use your Paper icon set)
                    >
                        Login
                    </Button>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                        style={styles.signupContainer}
                    >
                        <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                            Don't have an account? Sign Up
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
    signupContainer: {
        marginTop: 16,
        alignSelf: 'center',
    },
});
