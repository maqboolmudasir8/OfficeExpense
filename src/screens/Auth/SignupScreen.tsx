// src/screens/Auth/SignupScreen.tsx
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
    const { signUp } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword) {
            return Alert.alert('Error', 'Please fill all fields');
        }

        if (password !== confirmPassword) {
            return Alert.alert('Error', 'Passwords do not match');
        }

        try {
            setLoading(true);
            await signUp(email, password);
            Alert.alert('Success', 'Account created successfully');
            // navigation.replace('Home'); // Redirect to Home
        } catch (error: any) {
            Alert.alert('Signup failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Create Account</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
            />
            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
            />
            <Button title={loading ? 'Creating Account...' : 'Sign Up'} onPress={handleSignup} disabled={loading} />
            <View style={{ marginTop: 16, alignItems: 'center' }}>
                <Text>
                    Already have an account?{' '}
                    <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('Login')}>
                        Login
                    </Text>
                </Text>
            </View>
        </View>
    );
}
