import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./RootStackParamList";

// Make a global type for all screens
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}

// Optional helper type
export type AppNavigationProp<Screen extends keyof RootStackParamList> =
    NativeStackNavigationProp<RootStackParamList, Screen>;
