// src/screens/Profile/ProfileScreen.tsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';

const ProfileScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const getInitials = () => {
        if (!user) return 'U';
        if (user.first_name && user.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return user.email ? user.email[0].toUpperCase() : 'U';
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {getInitials()}
                    </Text>
                </View>
                <Text style={styles.name}>
                    {user?.full_name || user?.email || 'User'}
                </Text>
                <Text style={styles.email}>{user?.email || ''}</Text>
            </View>

            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
                    <Text style={styles.menuText}>Edit Profile</Text>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={logout}>
                    <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    profileHeader: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#6200ee',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    menuContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        fontSize: 16,
    },
    menuArrow: {
        fontSize: 24,
        color: '#999',
    },
    logoutText: {
        color: '#e74c3c',
    },
});

export default ProfileScreen;