import React from 'react';
import { View } from 'react-native';
import { IconButton, Menu, Divider } from 'react-native-paper';
import { Text } from '../Text';

interface Props {
    title: string;
    isEditing: boolean;
    toggleEdit: () => void;
    openDeleteDialog: () => void;
    onBack: () => void;
}

export default function FileHeader({
    title,
    isEditing,
    toggleEdit,
    openDeleteDialog,
    onBack
}: Props) {
    const [menuVisible, setMenuVisible] = React.useState(false);

    return (
        <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
            <IconButton icon="arrow-left" onPress={onBack} />

            <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600' }}>
                {title}
            </Text>

            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                    <IconButton icon="dots-vertical" onPress={() => setMenuVisible(true)} />
                }
            >
                <Menu.Item
                    leadingIcon={isEditing ? 'close' : 'pencil'}
                    title={isEditing ? 'Cancel' : 'Edit'}
                    onPress={() => {
                        toggleEdit();
                        setMenuVisible(false);
                    }}
                />
                <Divider />
                <Menu.Item
                    leadingIcon="delete"
                    title="Delete"
                    onPress={() => {
                        openDeleteDialog();
                        setMenuVisible(false);
                    }}
                />
            </Menu>
        </View>
    );
}