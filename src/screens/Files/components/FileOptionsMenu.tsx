import React from "react";
import { Menu, Divider } from "react-native-paper";
import { File } from "../../../types/File";

interface Props {
    visible: boolean;
    onDismiss: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const FileOptionsMenu: React.FC<Props> = ({
    visible,
    onDismiss,
    onEdit,
    onDelete,
}) => {
    return (
        <Menu visible={visible} onDismiss={onDismiss} anchor={{ x: 0, y: 0 }}>
            <Menu.Item title="Open" onPress={onDismiss} />

            <Divider />

            <Menu.Item title="Edit" onPress={onEdit} />

            <Menu.Item
                title="Delete"
                onPress={onDelete}
                titleStyle={{ color: "red" }}
            />
        </Menu>
    );
};

export default FileOptionsMenu;