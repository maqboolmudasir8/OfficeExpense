// AddExpenseScreen.tsx
import React, { useContext, useState } from "react";
import { Alert, Image, ScrollView, View, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addExpense } from "../../api/expenseService";
import { CURRENCIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from "../../constants/expenseOptions";
import { RootStackParamList } from "../../types/RootStackParamList";
import { AuthContext } from "../../context/AuthContext";
import { Expense } from "../../types/Expense";
import DateTimeSelector from "../../components/Expenses/DateTimeSelector";
import { TextInput } from "../../components/TextInput";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { launchImageLibrary } from 'react-native-image-picker';
import { deleteFile, getPublicUrl, uploadFile } from "../Files/services/storageService";
import { globalStyles } from "../../styles/globalStyles";
import { theme } from "../../theme";
import { Divider, Icon } from "react-native-paper";

type Props = NativeStackScreenProps<RootStackParamList, "AddExpense">;

export default function AddExpenseScreen({ route, navigation }: Props) {
    const { fileId, folderId } = route.params;
    const { user } = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [spentAt, setSpentAt] = useState(new Date());
    const [image, setImage] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedPath, setUploadedPath] = useState<string | null>(null);

    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [expense, setExpense] = useState<Partial<Expense>>({
        expense_title: "",
        amount: 0,
        category: "",
        payment_method: "Cash",
        // status: "pending",
        currency: "PKR",
        notes: "",
        merchant_name: "",
        location: "",
        paid_by: "",
        tags: "",
        receipt_url: "",
    });

    const updateField = (key: keyof Expense, value: any) => {
        setExpense((prev) => ({ ...prev, [key]: value }));
    };

    // Pick image from library
    const pickImage = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
        if (!result.didCancel && result.assets && result.assets.length > 0) {
            setImage(result.assets[0]);
        }
    };

    // Upload selected image to Supabase
    const uploadImage = async () => {
        if (!image?.uri) {
            Alert.alert("No image selected", "Please pick an image first.");
            return;
        }

        if (!user?.id) {
            Alert.alert("Not logged in", "User must be logged in to upload.");
            return;
        }

        try {
            setIsUploading(true);

            const ext = image.fileName?.split('.').pop() || 'jpg';
            const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

            await uploadFile(image.uri, filePath, image.type || 'image/jpeg');
            const publicUrl = await getPublicUrl(filePath);

            if (publicUrl) {
                updateField("receipt_url", publicUrl);
                setUploadedPath(filePath);   // <-- store the actual path
                Alert.alert("Success", "Image uploaded successfully!");
            }
        } catch (error) {
            console.error("Upload Error:", error);
            Alert.alert("Upload Error", "Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = async () => {
        try {
            // If the image was uploaded, delete from storage
            if (uploadedPath) {
                await deleteFile(uploadedPath);
            }

            // Clear all local state
            setUploadedPath(null);
            setImage(null);
            updateField("receipt_url", "");

            Alert.alert("Deleted", "Receipt removed successfully.");
        } catch (error) {
            console.error("Delete Error:", error);
            Alert.alert("Error", "Failed to remove receipt.");
        }
    };

    const handleSave = async () => {
        if (!expense.expense_title || !expense.amount || !expense.category) {
            Alert.alert("Error", "Please fill in all required fields");
            return;
        }

        try {
            setIsSubmitting(true);
            await addExpense({
                file_id: fileId ?? 0,
                folder_id: folderId ?? 0,
                created_by: user?.id || "",
                expense_title: expense.expense_title,
                amount: Number(expense.amount),
                category: expense.category,
                currency: expense.currency || "PKR",
                // status: expense.status || "pending",
                notes: expense.notes || null,
                payment_method: expense.payment_method || "Cash",
                spent_at: spentAt.toISOString(),
                merchant_name: expense.merchant_name,
                location: expense.location,
                // paid_by: expense.paid_by,
                // tags: expense.tags,
                receipt_url: expense.receipt_url,
            });
            Alert.alert("Success", "Expense added successfully");
            navigation.goBack();
        } catch (error) {
            console.error("Error adding expense:", error);
            Alert.alert("Error", "Failed to add expense");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formGroup}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Expense Details</Text>
                    <TextInput
                        label="Title *"
                        value={expense?.expense_title ?? ''}
                        onChangeText={(text) => updateField('expense_title', text)}
                        style={styles.input}
                    />

                    <View style={styles.row}>
                        <View style={[styles.amountInput, { flex: 2 }]}>
                            <TextInput
                                label="Amount *"
                                value={expense.amount?.toString() ?? ''}
                                onChangeText={(text) => updateField('amount', text.replace(/[^0-9.]/g, ''))}
                                keyboardType="decimal-pad"
                            />
                        </View>
                        {/* <View style={[styles.dropdownContainer, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>Currency</Text>
                            <Dropdown
                                value={expense.currency || 'PKR'}
                                options={CURRENCIES}
                                onSelect={(value) => updateField('currency', value)}
                            />
                        </View> */}
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.categoryContainer, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>Category *</Text>
                            <TouchableOpacity
                                style={[
                                    styles.categoryButton,
                                    expense.category && styles.categoryButtonActive
                                ]}
                                onPress={() => setShowCategoryPicker(true)}
                            >
                                <Text style={[
                                    styles.categoryButtonText,
                                    { color: expense.category ? theme.colors.primary : theme.colors.onSurfaceVariant }
                                ]}>
                                    {expense.category || 'Select Category'}
                                </Text>
                                <Icon
                                    source="chevron-down"
                                    size={20}
                                    color={expense.category ? theme.colors.primary : theme.colors.onSurfaceVariant}
                                />
                            </TouchableOpacity>

                            <Modal
                                visible={showCategoryPicker}
                                animationType="slide"
                                transparent={true}
                                onRequestClose={() => setShowCategoryPicker(false)}
                            >
                                <TouchableWithoutFeedback onPress={() => setShowCategoryPicker(false)}>
                                    <View style={styles.modalOverlay} />
                                </TouchableWithoutFeedback>

                                <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
                                    <View style={styles.modalHeader}>
                                        <Text variant="titleMedium">Select Category</Text>
                                        <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                                            <Icon source="close" size={24} />
                                        </TouchableOpacity>
                                    </View>
                                    <Divider />
                                    <ScrollView style={styles.categoriesList}>
                                        {EXPENSE_CATEGORIES.map((category) => (
                                            <TouchableOpacity
                                                key={category.value}
                                                style={styles.categoryItem}
                                                onPress={() => {
                                                    updateField('category', category.value);
                                                    setShowCategoryPicker(false);
                                                }}
                                            >
                                                <Text>{category.label}</Text>
                                                {expense.category === category.value && (
                                                    <Icon source="check" size={20} color={theme.colors.primary} />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </Modal>
                        </View>
                        {/* <View style={[styles.dropdownContainer, { flex: 1 }]}>
                            <Text style={styles.inputLabel}>Payment Method</Text>
                            <Dropdown
                                options={PAYMENT_METHODS}
                                value={expense.payment_method || 'Cash'}
                                onSelect={(value) => updateField('payment_method', value)}
                            />
                            </View>
                            <View style={[styles.dropdownContainer, { flex: 1 }]}>
                            <Text style={styles.inputLabel}>Status</Text>
                            Dropdown
                                label="Status"
                                options={EXPENSE_STATUSES}
                                value={expense.status}
                                onSelect={(v) => updateField("status", v)}
                            /> 
                        </View>
                        </View> */}
                    </View>

                    <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 16 }]}>Additional Information</Text>

                    <View style={styles.dateTimeContainer}>
                        <Text style={styles.inputLabel}>Date & Time</Text>
                        <DateTimeSelector
                            value={spentAt}
                            onChange={setSpentAt}
                            style={styles.dateTimeInput}
                        />
                    </View>

                    {/* <TextInput
                        label="Merchant"
                        value={expense?.merchant_name ?? ''}
                        onChangeText={(text) => updateField('merchant_name', text)}
                        style={styles.input}
                    /> */}

                    {/* <TextInput
                        label="Location"
                        value={expense?.location ?? ''}
                        onChangeText={(text) => updateField('location', text)}
                        style={styles.input}
                    /> */}

                    {/* <TextInput
                        label="Paid By"
                        value={expense?.paid_by ?? ''}
                        onChangeText={(text) => updateField('paid_by', text)}
                        style={styles.input}
                    /> */}

                    {/* <TextInput
                        label="Tags (comma separated)"
                        value={expense?.tags ?? ''}
                        onChangeText={(text) => updateField('tags', text)}
                        style={styles.input}
                    /> */}

                    <TextInput
                        label="Notes"
                        value={expense?.notes ?? ''}
                        onChangeText={(text) => updateField('notes', text)}
                        multiline
                        numberOfLines={3}
                        style={[styles.input, styles.textArea]}
                    />

                    <View style={styles.receiptContainer}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Receipt</Text>
                        {image?.uri && (
                            <Image
                                source={{ uri: image.uri }}
                                // style={{
                                //     width: '100%',
                                //     height: 200,
                                //     marginVertical: 16,
                                //     borderRadius: 8,
                                // }}
                                style={styles.imagePreview}
                                resizeMode="contain"
                            />
                        )}
                        <Button
                            label={image ? 'Change Image' : 'Select Receipt'}
                            mode="outlined"
                            onPress={pickImage}
                            style={globalStyles.buttons.secondary}
                        />
                        {image && (
                            <View style={styles.imagePreviewContainer}>
                                {/* <Image source={{ uri: image }} style={styles.imagePreview} /> */}
                                <Button
                                    label="Remove Receipt"
                                    mode="outlined"
                                    onPress={removeImage}
                                    // style={styles.removeImageButton}
                                    style={globalStyles.buttons.secondary}
                                    textStyle={{ color: theme.colors.error }}
                                />
                            </View>
                        )}

                        {image && !expense.receipt_url && (
                            <Button
                                label={isUploading ? 'Uploading...' : 'Upload Receipt'}
                                mode="outlined"
                                onPress={uploadImage}
                                icon="camera"
                                loading={isUploading}
                                style={globalStyles.buttons.secondary}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    label={isSubmitting ? 'Saving...' : 'Save Expense'}
                    mode="contained"
                    onPress={handleSave}
                    loading={isSubmitting}
                    style={styles.submitButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    formGroup: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 16,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        marginBottom: 4,
        color: theme.colors.onSurfaceVariant,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    amountInput: {
        marginRight: 8,
    },
    categoryContainer: {
        marginBottom: 16,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: theme.colors.outline,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 56,
        backgroundColor: theme.colors.surface,
    },
    categoryButtonActive: {
        borderColor: theme.colors.primary,
    },
    categoryButtonText: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '60%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    categoriesList: {
        maxHeight: 300,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.outlineVariant,
    },
    dateTimeContainer: {
        marginBottom: 16,
    },
    dateTimeInput: {
        borderWidth: 1,
        borderColor: theme.colors.outline,
        borderRadius: 4,
        padding: 12,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    receiptContainer: {
        marginTop: 8,
        marginBottom: 24,
    },
    uploadButton: {
        borderStyle: 'dashed',
        borderColor: theme.colors.primary,
        borderWidth: 1,
    },
    imagePreviewContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
        resizeMode: 'contain',
        backgroundColor: theme.colors.surfaceVariant,
    },
    removeImageButton: {
        borderColor: theme.colors.error,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.outlineVariant,
        elevation: 4,
    },
    submitButton: {
        width: '100%',
    },
});