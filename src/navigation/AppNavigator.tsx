// src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import FoldersListScreen from '../screens/Folders/FoldersListScreen';
import CreateExpenseGroupScreen from '../screens/Folders/CreateExpenseGroupScreen';
import FolderDetailsScreen from '../screens/Folders/FolderDetailsScreen';
import ExpenseGroupMembersScreen from '../screens/Folders/ExpenseGroupMembersScreen';
import AddMemberScreen from '../screens/Folders/AddMemberScreen';
import { AuthContext } from '../context/AuthContext';
import { RootStackParamList } from '../types/RootStackParamList';
import ExpenseListScreen from '../screens/Expenses/ExpenseListScreen';
import AddExpenseScreen from '../screens/Expenses/AddExpenseScreen';
import EditExpenseScreen from '../screens/Expenses/EditExpenseScreen';
import ExpenseDetailScreen from '../screens/Expenses/ExpenseDetailScreen';
import FileDetailScreen from '../screens/Files/FileDetailScreen';
import AddFileMemberScreen from '../screens/Files/AddFileMemberScreen';

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
                if (route.name === 'FoldersList') iconName = 'clipboard-list';

                return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
            },
            tabBarActiveTintColor: '#6200ee',
            tabBarInactiveTintColor: 'gray',
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="FoldersList" component={FoldersListScreen} />
        <Tab.Screen name="ExpenseList" component={ExpenseListScreen} />
    </Tab.Navigator>
);

// Main stack that wraps the tab navigator and includes modal screens
const MainStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            presentation: 'card',
        }}
    >
        {/* Tabs */}
        <Stack.Screen name="MainTabs" component={AppTabs} />

        <Stack.Screen
            name="FoldersList"
            component={FoldersListScreen}
            options={{ title: 'My Expense Groups' }}
        />
        <Stack.Screen
            name="FolderDetails"
            component={FolderDetailsScreen}
            options={{ title: 'Group Details' }}
        />
        <Stack.Screen
            name="CreateExpenseGroup"
            component={CreateExpenseGroupScreen}
            options={{ title: 'New Group' }}
        />

        <Stack.Screen
            name="FileDetail"
            component={FileDetailScreen}
            options={{ title: 'File Details' }}
        />
        <Stack.Screen
            name="AddFileMember"
            component={AddFileMemberScreen}
            options={{ title: 'Add Member' }}
        />

        {/* Modals / screens outside tabs */}
        {/* <Stack.Screen
            name="CreateExpenseGroup"
            component={CreateExpenseGroupScreen}
            options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Create New Group',
            }}
        /> */}
        {/* <Stack.Screen
            name="FolderDetails"
            component={ExpenseGroupDetailsScreen}
            options={{ headerShown: true, title: 'Group Details' }}
        /> */}
        {/* <Stack.Screen
            name="ExpenseGroupMembers"
            component={ExpenseGroupMembersScreen}
            options={{ headerShown: true, title: 'Group Members' }}
        /> */}
        <Stack.Screen
            name="AddMember"
            component={AddMemberScreen}
            options={{ headerShown: true, title: 'Add Member', presentation: 'modal' }}
        />

        {/* ✅ AddExpenseScreen */}
        <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{ headerShown: true, title: 'Add Expense' }}
        />

        {/* Optional: EditExpenseScreen */}
        <Stack.Screen
            name="EditExpense"
            component={EditExpenseScreen}
            options={{ headerShown: true, title: 'Edit Expense' }}
        />

        {/* Optional: ExpenseDetailScreen */}
        <Stack.Screen
            name="ExpenseDetail"
            component={ExpenseDetailScreen}
            options={{ headerShown: true, title: 'Expense Details' }}
        />
    </Stack.Navigator>
);


export default function AppNavigator() {
    const { user } = useContext(AuthContext);

    // If user exists, show MainStack (which contains AppTabs), else AuthStack
    return user ? <MainStack /> : <AuthStack />;
}