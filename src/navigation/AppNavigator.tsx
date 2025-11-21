// src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ExpenseGroupListScreen from '../screens/ExpenseGroups/ExpenseGroupListScreen';
import CreateExpenseGroupScreen from '../screens/ExpenseGroups/CreateExpenseGroupScreen';
import ExpenseGroupDetailsScreen from '../screens/ExpenseGroups/ExpenseGroupDetailsScreen';
import ExpenseGroupMembersScreen from '../screens/ExpenseGroups/ExpenseGroupMembersScreen';
import AddMemberScreen from '../screens/ExpenseGroups/AddMemberScreen';
import { AuthContext } from '../context/AuthContext';
import { RootStackParamList } from '../types/RootStackParamList';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

// Auth stack for login/signup
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
);

// App tabs for main app screens
const AppTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
                let iconName = '';

                if (route.name === 'Home') iconName = 'home';
                if (route.name === 'ExpenseGroupList') iconName = 'clipboard-list';

                return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
            },
            tabBarActiveTintColor: '#6200ee',
            tabBarInactiveTintColor: 'gray',
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="ExpenseGroupList" component={ExpenseGroupListScreen} />
    </Tab.Navigator>
);

// Main stack that wraps the tab navigator and includes modal screens
const MainStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            presentation: 'card' // This is the default, but explicit is better
        }}
    >
        <Stack.Screen name="MainTabs" component={AppTabs} />
        <Stack.Screen
            name="CreateExpenseGroup"
            component={CreateExpenseGroupScreen}
            options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Create New Group'
            }}
        />
        <Stack.Screen
            name="ExpenseGroupDetails"
            component={ExpenseGroupDetailsScreen}
            options={{
                headerShown: true,
                title: 'Group Details'
            }}
        />
        <Stack.Screen
            name="ExpenseGroupMembers"
            component={ExpenseGroupMembersScreen}
            options={{
                headerShown: true,
                title: 'Group Members'
            }}
        />
        <Stack.Screen
            name="AddMember"
            component={AddMemberScreen}
            options={{
                headerShown: true,
                title: 'Add Member',
                presentation: 'modal'
            }}
        />
    </Stack.Navigator>
);

export default function AppNavigator() {
    const { user } = useContext(AuthContext);

    // If user exists, show MainStack (which contains AppTabs), else AuthStack
    return user ? <MainStack /> : <AuthStack />;
}