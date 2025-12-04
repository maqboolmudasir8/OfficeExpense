// AddExpenseScreen.tsx
import React, { useContext, useState } from "react";
import { Alert, Image, ScrollView, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addExpense } from "../../api/expenseService";
import { EXPENSE_CATEGORIES } from "../../constants/expenseOptions";
import { RootStackParamList } from "../../types/RootStackParamList";
import { AuthContext } from "../../context/AuthContext";
import { Expense } from "../../types/Expense";
import DateTimeSelector from "../../components/Expenses/DateTimeSelector";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { Dropdown } from "../../components/Dropdown";
import Text from "../../components/Text";
import { launchImageLibrary } from 'react-native-image-picker';
import { deleteFile, getPublicUrl, uploadFile } from "../Files/services/storageService";
import { globalStyles } from "../../styles/globalStyles";
import { theme } from "../../theme";

type Props = NativeStackScreenProps<RootStackParamList, "AddExpense">;

export default function AddExpenseScreen({ route, navigation }: Props) {
    const { fileId, folderId } = route.params;
    const { user } = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [spentAt, setSpentAt] = useState(new Date());
    const [image, setImage] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedPath, setUploadedPath] = useState<string | null>(null);

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

    const deleteUploadedImage = async () => {
        if (!uploadedPath) return;

        try {
            await deleteFile(uploadedPath);
            setUploadedPath(null);
            updateField("receipt_url", "");
            setImage(null);

            Alert.alert("Deleted", "Image removed successfully.");
        } catch (error) {
            console.error("Delete Error:", error);
            Alert.alert("Error", "Failed to delete image.");
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
        <ScrollView style={globalStyles.layout.container}>
            <View style={{ padding: 16 }}>
                <Text style={[globalStyles.typography.title, { marginBottom: 16 }]}>
                    Add Expense
                </Text>

                <Text style={globalStyles.forms.label}>Title *</Text>
                <TextInput
                    value={expense.expense_title}
                    onChangeText={(v) => updateField("expense_title", v)}
                    style={globalStyles.forms.input}
                />

                <Text style={[globalStyles.forms.label, { marginTop: 8 }]}>Amount *</Text>
                <TextInput
                    keyboardType="numeric"
                    value={expense.amount?.toString() || ""}
                    onChangeText={(v) => updateField("amount", Number(v))}
                    style={globalStyles.forms.input}
                />

                <Text style={[globalStyles.forms.label, { marginTop: 8 }]}>Category *</Text>
                <Dropdown
                    options={EXPENSE_CATEGORIES}
                    value={expense.category}
                    onSelect={(value) => updateField("category", value)}
                    placeholder="Select category"
                    style={[globalStyles.forms.input, { marginBottom: 16 }]}
                />

                {/* <Dropdown
                label="Payment Method (optional)"
                options={PAYMENT_METHODS}
                value={expense.payment_method}
                onSelect={(v) => updateField("payment_method", v)}
            /> */}

                {/* <Dropdown
                label="Status"
                options={EXPENSE_STATUSES}
                value={expense.status}
                onSelect={(v) => updateField("status", v)}
            /> */}

                {/* <Dropdown
                label="Currency"
                options={CURRENCIES}
                value={expense.currency}
                onSelect={(v) => updateField("currency", v)}
            /> */}

                <Text style={[globalStyles.forms.label, { marginTop: 8 }]}>Payment Method</Text>

                <Text style={[globalStyles.forms.label, { marginTop: 8 }]}>Date & Time</Text>
                <DateTimeSelector
                    value={spentAt}
                    onChange={setSpentAt}
                    style={{ marginBottom: 16 }}
                />

                <Text style={[globalStyles.forms.label, { marginTop: 8 }]}>Notes (optional)</Text>
                <TextInput
                    // label="Notes (optional)"
                    value={expense.notes || ""}
                    onChangeText={(v) => updateField("notes", v)}
                    style={globalStyles.forms.input}
                    multiline
                    numberOfLines={3}
                />

                <Text style={[globalStyles.forms.label, { marginTop: 8 }]}>Merchant (optional)</Text>
                <TextInput
                    value={expense.merchant_name || ""}
                    onChangeText={(v) => updateField("merchant_name", v)}
                    style={globalStyles.forms.input}
                />

                <Text style={[globalStyles.forms.label, { marginTop: 8 }]}>Location (optional)</Text>
                <TextInput
                    value={expense.location || ""}
                    onChangeText={(v) => updateField("location", v)}
                    style={globalStyles.forms.input}
                />

                {/* <TextInput
                label="Paid By (optional)"
                value={expense.paid_by || ""}
                onChangeText={(v) => updateField("paid_by", v)}
                style={styles.input}
            />

            <TextInput
                label="Tags (comma separated)"
                value={expense.tags || ""}
                onChangeText={(v) => updateField("tags", v)}
                style={styles.input}
            /> */}

                {/* <TextInput
                label="Receipt URL (optional)"
                value={expense.receipt_url || ""}
                onChangeText={(v) => updateField("receipt_url", v)}
                style={styles.input}
            /> */}

                {image?.uri && (
                    <Image
                        source={{ uri: image.uri }}
                        style={{
                            width: '100%',
                            height: 200,
                            marginVertical: 16,
                            borderRadius: 8,
                        }}
                        resizeMode="contain"
                    />
                )}

                <View style={[globalStyles.layout.row, { marginTop: 16, marginBottom: 24 }]}>
                    <Button
                        label={image ? 'Change Image' : 'Select Receipt'}
                        mode="outlined"
                        onPress={pickImage}
                        style={{ flex: 1, marginRight: 8 }}
                    />
                    {image && (
                        <Button
                            label="Remove"
                            mode="outlined"
                            onPress={deleteUploadedImage}
                            style={{ flex: 1, marginLeft: 8 }}
                            textColor={theme.colors.error}
                        />
                    )}
                </View>

                {image && !expense.receipt_url && (
                    <Button
                        label={isUploading ? 'Uploading...' : 'Upload Receipt'}
                        mode="contained"
                        onPress={uploadImage}
                        loading={isUploading}
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Button
                    label={isSubmitting ? 'Saving...' : 'Save Expense'}
                    mode="contained"
                    onPress={handleSave}
                    loading={isSubmitting}
                    style={{ marginTop: 8, marginBottom: 32 }}
                />
            </View>
        </ScrollView>
    );
}