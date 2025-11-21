// src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import { AuthContext } from '../context/AuthContext';
import { RootStackParamList } from '../types/RootStackParamList';
import SignupScreen from '../screens/Auth/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import AddGroupScreen from '../screens/ExpenseGroups/AddGroupScreen';
import GroupListScreen from '../screens/ExpenseGroups/GroupListScreen';
import GroupDetailScreen from '../screens/ExpenseGroups/GroupDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// export default function AppNavigator() {
//     return (
//         <NavigationContainer>
//             <Stack.Navigator screenOptions={{ headerShown: false }}>
//                 <Stack.Screen name="Login" component={LoginScreen} />
//                 {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// }

//////////////
// src/navigation/AppNavigator.tsx


const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
);

const AppStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GroupList" component={GroupListScreen} />
        <Stack.Screen name="AddGroup" component={AddGroupScreen} />
        <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
    </Stack.Navigator>
);

// export default function AppNavigator() {
//     const { user } = useContext(AuthContext);
//     console.log("user", user);

//     return (
//         <NavigationContainer>
//             {user ? <AppStack /> : <AuthStack />}
//         </NavigationContainer>
//     );
// }
export default function AppNavigator() {
    const { user } = useContext(AuthContext);

    return user ? <AppStack /> : <AuthStack />;
}