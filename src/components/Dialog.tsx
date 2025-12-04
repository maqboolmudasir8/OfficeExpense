import React from "react";
import { Button } from "./Button";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { Dialog as RNPDialog, Portal, Text, IconButton } from "react-native-paper";

export interface DialogProps {
    visible: boolean;

    // Content
    title?: string;
    message?: string;
    children?: React.ReactNode; // Allows form fields inside dialog

    // Button labels
    confirmLabel?: string;
    cancelLabel?: string;

    // Behavior
    loading?: boolean;
    onCancel: () => void;
    onConfirm?: () => void; // optional so dialog can be "info only"

    // Visual customization
    icon?: string;            // MaterialCommunityIcons name
    danger?: boolean;         // Makes confirm button red
    confirmColor?: string;    // Override confirm button color
}

export default function Dialog({
    visible,
    title = "Are you sure?",
    message,
    children,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    loading = false,
    icon,
    danger = false,
    confirmColor,
    onCancel,
    onConfirm,
}: DialogProps) {
    // Animation
    const slideAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            // Reset animation when hiding
            slideAnim.setValue(0);
        }
    }, [visible]);

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
    });

    const finalConfirmColor = danger ? "red" : confirmColor;

    if (!visible) return null; // Don't render anything if not visible

    return (
        <Portal>
            <View
                style={StyleSheet.absoluteFill}
                pointerEvents={visible ? 'auto' : 'none'}
            >
                <RNPDialog
                    visible={visible}
                    onDismiss={onCancel}
                    style={{
                        borderRadius: 12,
                        backgroundColor: "white",
                        paddingVertical: 4,
                        width: "90%",
                        maxWidth: 600,
                        alignSelf: "center",
                        margin: 0,
                        position: 'absolute',
                        top: '20%',
                        elevation: 24,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                    }}
                >
                    <Animated.View style={{ transform: [{ translateY }], opacity: slideAnim }}>
                        {/* Title + Icon */}
                        <RNPDialog.Title>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                {icon && (
                                    <IconButton
                                        icon={icon}
                                        size={22}
                                        iconColor={danger ? "red" : undefined}
                                        style={{
                                            marginRight: 8,
                                            marginLeft: -8,
                                            marginVertical: 0,
                                        }}
                                    />
                                )}
                                <Text variant="titleLarge">{title}</Text>
                            </View>
                        </RNPDialog.Title>

                        {/* Content */}
                        <RNPDialog.Content>
                            {message && <Text>{message}</Text>}
                            {children}
                        </RNPDialog.Content>

                        {/* Buttons */}
                        <RNPDialog.Actions style={{ paddingRight: 8, paddingBottom: 8 }}>
                            <Button
                                onPress={onCancel}
                                disabled={loading}
                                mode="outlined"
                                style={{ marginRight: 8 }}
                                label={cancelLabel}
                            />

                            {onConfirm && (
                                <Button
                                    onPress={onConfirm}
                                    loading={loading}
                                    mode="contained"
                                    buttonColor={finalConfirmColor}
                                    label={confirmLabel}
                                />
                            )}
                        </RNPDialog.Actions>
                    </Animated.View>
                </RNPDialog>
            </View>
        </Portal>
    );
}