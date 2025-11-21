// src/types/useAppNavigation.ts
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/RootStackParamList";

export const useAppNavigation = <Screen extends keyof RootStackParamList>() =>
    useNavigation<NativeStackNavigationProp<RootStackParamList, Screen>>();
