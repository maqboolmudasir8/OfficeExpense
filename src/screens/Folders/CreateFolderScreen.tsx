// screens/Folders/CreateFolderScreen.tsx
import React, { useContext, useState } from 'react';
import { View, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { useFolderStore } from '../../store/folderStore';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { EditableFolderInputModel, FolderStatus, FolderVisibility } from '../../types/Folder';
import WheelColorPicker from "react-native-wheel-color-picker";
import { colorPicker, globalStyles } from '../../styles/globalStyles';
import { Text } from '../../components/Text';

export default function CreateFolderScreen() {
    const theme = useTheme();
    const navigation = useAppNavigation<"CreateFolderScreen">();
    const { createFolder } = useFolderStore();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState<EditableFolderInputModel>({
        title: '',
        description: '',
        visibility: FolderVisibility.Private.toString(),
        color_code: '#2196F3',
        icon: 'folder',
        status: FolderStatus.Active.toString(),
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [tempColor, setTempColor] = useState<string>(formData.color_code || '#2196F3');

    const handleCreateFolder = async () => {
        if (!formData.title.trim()) {
            Alert.alert('Please enter a folder name');
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = {
                ...formData,
                status: FolderStatus.Active.toString(),
                created_at: new Date().toISOString(),
                created_by: user?.id,
            };

            await createFolder(payload);

            navigation.goBack();
        } catch (error) {
            console.error('Error creating Folder:', error);
            Alert.alert(`Failed to create Folder. Please try again.\n${String(error)}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>
            <TextInput
                label="Title"
                value={formData.title}
                onChangeText={(text) =>
                    setFormData(prev => ({ ...prev, title: text }))
                }
                style={{ marginBottom: 16 }}
                autoFocus
            />

            <TextInput
                label="Description"
                value={formData.description ?? ""}
                onChangeText={(text) =>
                    setFormData(prev => ({ ...prev, description: text }))
                }
                multiline
                numberOfLines={3}
                style={{ marginBottom: 16 }}
            />

            {/* COLOR PICKER BUTTON */}
            <View style={{ marginBottom: 16 }}>
                <Text style={colorPicker.label}>Color</Text>

                <TouchableOpacity
                    onPress={() => setShowColorPicker(true)}
                    style={colorPicker.pickerButton}
                >
                    <View
                        style={[
                            colorPicker.colorPreview,
                            { backgroundColor: formData.color_code || tempColor },
                        ]}
                    />
                    <Text style={colorPicker.colorText}>
                        {formData.color_code}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* COLOR PICKER MODAL */}
            <Modal
                visible={showColorPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowColorPicker(false)}
            >
                <View style={colorPicker.modalContainer}>
                    <View style={colorPicker.modalContent}>
                        <WheelColorPicker
                            color={tempColor}
                            onColorChangeComplete={(color) => {
                                setTempColor(color.toUpperCase());
                            }}
                            thumbSize={30}
                            sliderSize={30}
                            row={false}
                            noSnap
                            swatchesOnly={false}
                        />

                        <View style={{ marginTop: 20 }}>
                            <Button
                                label="Apply"
                                mode="contained"
                                onPress={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        color_code: tempColor,
                                    }));
                                    setShowColorPicker(false);
                                }}
                                style={{ marginBottom: 10 }}
                            />

                            <Button
                                label="Cancel"
                                mode="outlined"
                                style={globalStyles.buttons.secondary}
                                onPress={() => {
                                    setTempColor(formData.color_code || tempColor);
                                    setShowColorPicker(false);
                                }}
                            />
                            {/* </View> */}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* <TextInput
                label="Icon"
                value={formData.icon}
                onChangeText={(text) => setFormData({ ...formData, icon: text })}
                style={{ marginBottom: 24 }}
            /> */}

            <Button
                label="Save"
                mode="contained"
                onPress={handleCreateFolder}
                loading={isSubmitting}
                disabled={isSubmitting}
            />
        </ScrollView>
    );
}