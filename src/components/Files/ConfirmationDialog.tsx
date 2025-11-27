import React from 'react';
import { Animated, Easing, View } from "react-native";
import { Dialog, Portal, Button, Text, IconButton } from 'react-native-paper';

// 1
// export default function DeleteDialog({ visible, onCancel, onDelete }: any) {
//     return (
//         <Portal>
//             <Dialog visible={visible} onDismiss={onCancel}>
//                 <Dialog.Title>Delete File</Dialog.Title>
//                 <Dialog.Content>
//                     <Text>This action cannot be undone.</Text>
//                 </Dialog.Content>
//                 <Dialog.Actions>
//                     <Button onPress={onCancel}>Cancel</Button>
//                     <Button textColor="red" onPress={onDelete}>
//                         Delete
//                     </Button>
//                 </Dialog.Actions>
//             </Dialog>
//         </Portal>
//     );
// }

// 2
// export interface DeleteDialogProps {
//     visible: boolean;
//     title?: string;
//     message?: string;
//     confirmLabel?: string;
//     cancelLabel?: string;
//     loading?: boolean;
//     confirmColor?: string;
//     onCancel: () => void;
//     onConfirm: () => void;
// }

// export default function DeleteDialog({
//     visible,
//     title = "Delete",
//     message = "Are you sure? This action cannot be undone.",
//     confirmLabel = "Delete",
//     cancelLabel = "Cancel",
//     loading = false,
//     confirmColor = "red",
//     onCancel,
//     onConfirm,
// }: DeleteDialogProps) {
//     return (
//         <Portal>
//             <Dialog visible={visible} onDismiss={onCancel}>
//                 <Dialog.Title>{title}</Dialog.Title>

//                 <Dialog.Content>
//                     <Text>{message}</Text>
//                 </Dialog.Content>

//                 <Dialog.Actions>
//                     <Button onPress={onCancel}>{cancelLabel}</Button>

//                     <Button
//                         onPress={onConfirm}
//                         textColor={confirmColor}
//                         loading={loading}
//                     >
//                         {confirmLabel}
//                     </Button>
//                 </Dialog.Actions>
//             </Dialog>
//         </Portal>
//     );
// }


// 3

export interface ConfirmationDialogProps {
    visible: boolean;

    // Content
    title?: string;
    message?: string;

    // Labels
    confirmLabel?: string;
    cancelLabel?: string;

    // Behavior
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;

    // Visual customization
    icon?: string;            // Icon name from MaterialCommunityIcons
    danger?: boolean;         // Danger mode (red)
    confirmColor?: string;    // Confirm button color
}

export default function ConfirmationDialog({
    visible,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    loading = false,
    icon = undefined,
    danger = false,
    confirmColor = undefined,
    onCancel,
    onConfirm,
}: ConfirmationDialogProps) {

    // Slide animation
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
            slideAnim.setValue(0);
        }
    }, [visible]);

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
    });

    const dangerColor = danger ? "red" : confirmColor || undefined;

    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={onCancel}
                style={{
                    borderRadius: 12,
                    backgroundColor: "white",
                    paddingVertical: 4,
                    width: "90%",
                    alignSelf: "center",
                    elevation: 6,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                }}
            >
                <Dialog.Title>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {icon && (
                            <IconButton
                                icon={icon}
                                size={22}
                                iconColor={danger ? "red" : undefined}
                                style={{
                                    marginRight: 4,
                                    marginLeft: -8,
                                    marginVertical: 0,
                                }}
                            />
                        )}
                        <Text variant="titleLarge">{title}</Text>
                    </View>
                </Dialog.Title>

                <Dialog.Content>
                    <Text>{message}</Text>
                </Dialog.Content>

                <Dialog.Actions style={{ paddingRight: 8 }}>
                    <Button onPress={onCancel} disabled={loading}>
                        {cancelLabel}
                    </Button>

                    <Button
                        onPress={onConfirm}
                        loading={loading}
                        textColor={danger ? "red" : confirmColor}
                    >
                        {confirmLabel}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
