// src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { LoginScreen } from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import FoldersListScreen from '../screens/Folders/FoldersListScreen';
import CreateFolderScreen from '../screens/Folders/CreateFolderScreen';
import FolderDetailsScreen from '../screens/Folders/FolderDetailsScreen';
import ExpenseGroupMembersScreen from '../screens/Folders/ExpenseGroupMembersScreen';
import AddMemberScreen from '../screens/Folders/AddMemberScreen';
import { AuthContext } from '../context/AuthContext';
import { RootStackParamList } from '../types/RootStackParamList';
// import ExpenseListScreen from '../screens/Expenses/ExpenseListScreen';
import AddExpenseScreen from '../screens/Expenses/AddExpenseScreen';
import EditExpenseScreen from '../screens/Expenses/EditExpenseScreen';
import ExpenseDetailScreen from '../screens/Expenses/ExpenseDetailScreen';
import FileDetailScreen from '../screens/Files/FileDetailScreen';
import AddFileMemberScreen from '../screens/Files/AddFileMemberScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';

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
                else if (route.name === 'FoldersList') iconName = 'folder';
                else if (route.name === 'Profile') iconName = 'account';

                return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
            },
            tabBarActiveTintColor: '#6200ee',
            tabBarInactiveTintColor: 'gray',
        })}
    >
        {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
        <Tab.Screen name="FoldersList" component={FoldersListScreen}
            options={{ title: 'Folders List' }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} />
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
            name="Profile"
            component={ProfileScreen}
            options={{ title: 'My Profile' }}
        />
        <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ headerShown: true, title: 'Edit Profile' }}
        />

        <Stack.Screen
            name="FoldersList"
            component={FoldersListScreen}
            options={{ title: 'My Expense Groups' }}
        />
        <Stack.Screen
            name="FolderDetails"
            component={FolderDetailsScreen}
            options={{
                headerShown: true,
                title: 'Folder Details',
                headerRight: () => null, // This will be overridden by the screen
            }}
        />
        <Stack.Screen
            name="CreateFolderScreen"
            component={CreateFolderScreen}
            options={{ headerShown: true, title: 'Add Folder' }}
        // options={{
        //     headerShown: true,
        //     headerTransparent: true,  // Makes the header transparent
        //     headerTitle: '',          // Hides the title
        //     headerBackTitle: '',      // Hides the back button text
        //     headerTintColor: '#000',  // Color of the back button
        //     // headerBackTitleVisible: false, // Hides the back button text on iOS
        //     headerStyle: {
        //         backgroundColor: 'transparent', // Makes the header transparent
        //     },
        // }}
        />

        <Stack.Screen
            name="FileDetail"
            component={FileDetailScreen}
            options={{ title: 'File Details', headerShown: true }}
        />
        <Stack.Screen
            name="AddFileMember"
            component={AddFileMemberScreen}
            options={{ title: 'Add Member' }}
        />

        {/* Modals / screens outside tabs */}
        {/* <Stack.Screen
            name="CreateFolderScreen"
            component={CreateFolderScreen}
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

        {/* AddExpenseScreen */}
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