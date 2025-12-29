import React, { useEffect, useState, useContext } from "react";
import { ScrollView, Alert, StyleSheet, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";

import { TextInput } from "../../components/TextInput";
import { Button } from "../../components/Button";
import { Dropdown } from "../../components/Dropdown";
import { Text } from "../../components/Text";
import DateTimeSelector from "../../components/Expenses/DateTimeSelector";

import { EXPENSE_CATEGORIES } from "../../constants/expenseOptions";
import { fetchExpenseById, updateExpense } from "../../api/expenseService";

import { launchImageLibrary } from "react-native-image-picker";
import { uploadFile, getPublicUrl, deleteFile } from "../Files/services/storageService";
import { AuthContext } from "../../context/AuthContext";
import { Expense } from "../../types/Expense";

type Props = NativeStackScreenProps<RootStackParamList, "EditExpense">;

export default function EditExpenseScreen({ route, navigation }: Props) {
    const { expenseId } = route.params;
    const { user } = useContext(AuthContext);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    /** NEW: separated states */
    const [image, setImage] = useState<any>(null);                       // newly picked image
    const [remoteImage, setRemoteImage] = useState<string | null>(null); // from Supabase
    const [uploadedPath, setUploadedPath] = useState<string | null>(null);

    const [spentAt, setSpentAt] = useState(new Date());
    const [expense, setExpense] = useState<Partial<Expense>>({});

    /** Load Expense Details */
    useEffect(() => {
        const loadExpense = async () => {
            try {
                const data = await fetchExpenseById(expenseId);
                setExpense(data);

                // Preload date
                setSpentAt(new Date(data.spent_at));

                if (data?.receipt_url) {
                    setRemoteImage(data?.receipt_url);

                    // Extract the Supabase storage file path from the URL
                    const match = data?.receipt_url.match(/\/object\/public\/[^/]+\/(.+)$/);
                    const extractedPath = match ? match[1] : null;

                    setUploadedPath(extractedPath);
                }

            } catch (error) {
                Alert.alert("Error", "Failed to load expense");
                navigation.goBack();
            }
        };

        loadExpense();
    }, [expenseId]);

    const updateField = (key: keyof Expense, value: any) => {
        setExpense((prev) => ({ ...prev, [key]: value }));
    };

    /** Pick Image */
    const pickImage = async () => {
        const result = await launchImageLibrary({ mediaType: "photo", quality: 0.8 });
        if (!result?.didCancel && result?.assets && result?.assets?.length > 0) {
            setImage(result?.assets[0]);
            setRemoteImage(null);  // clear remote image when picking new
        }
    };

    /** Upload Image */
    const uploadImage = async () => {
        if (!image?.uri) {
            Alert.alert("No image", "Please select an image first.");
            return;
        }
        if (!user?.id) {
            Alert.alert("Auth error", "You must be logged in.");
            return;
        }

        try {
            setIsUploading(true);

            const ext = image.fileName?.split(".").pop() || "jpg";
            const filePath = `${user.id}/${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 8)}.${ext}`;

            await uploadFile(image.uri, filePath, image.type || "image/jpeg");
            const publicUrl = await getPublicUrl(filePath);

            // update expense field
            updateField("receipt_url", publicUrl);

            // clear old remote image
            if (uploadedPath) {
                try {
                    await deleteFile(uploadedPath);
                } catch (e) {
                    Alert.alert("Warning", "Failed to delete old image.");
                }
            }

            setUploadedPath(filePath);
            setRemoteImage(publicUrl);

            Alert.alert("Uploaded", "Image uploaded successfully.");

            setImage(null);

        } catch (error) {
            Alert.alert("Upload failed", "Unable to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    /** Delete Remote Image */
    const deleteRemoteImage = async () => {
        console.log("uploadedPath___deleteRemoteImage", uploadedPath);

        if (!uploadedPath) return;

        try {
            await deleteFile(uploadedPath);

            setUploadedPath(null);
            setRemoteImage(null);
            updateField("receipt_url", "");

            Alert.alert("Deleted", "Receipt image removed.");
        } catch {
            Alert.alert("Error", "Unable to delete image.");
        }
    };

    /** Save Expense */
    const handleUpdate = async () => {
        if (!expense.amount || !expense.category) {
            Alert.alert("Error", "Please fill required fields.");
            return;
        }

        try {
            setIsSubmitting(true);

            await updateExpense(expenseId, {
                amount: Number(expense.amount),
                category: expense.category,
                created_at: expense.created_at,
                created_by: expense.created_by,
                currency: expense.currency,
                expense_title: expense.expense_title,
                location: expense.location,
                merchant_name: expense.merchant_name,
                notes: expense.notes,
                paid_by: expense.paid_by,
                payment_method: expense.payment_method,
                receipt_url: expense.receipt_url,
                spent_at: spentAt.toISOString(),
                tags: expense.tags,
                updated_at: new Date().toISOString(),
                updated_by: user?.id || "",
                // status: expense.status,
                // attachment_urls: expense.attachment_urls,
                // is_reimbursable: expense.is_reimbursable,
                // approved_at: expense.approved_at,
                // approved_by: expense.approved_by,
            });

            Alert.alert("Updated", "Expense saved.");
            navigation.goBack();

        } catch (error) {
            Alert.alert("Error", "Failed to update expense.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!expense?.id) {
        return (
            <Text style={{ marginTop: 50, textAlign: "center" }}>
                Loading expense...
            </Text>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineSmall" style={{ marginBottom: 12 }}>
                Edit Expense
            </Text>

            <TextInput
                label="Title"
                value={expense?.expense_title ?? ''}
                onChangeText={(v) => updateField("expense_title", v)}
                style={styles.input}
            />

            <TextInput
                label="Amount"
                keyboardType="numeric"
                value={expense.amount?.toString() || ""}
                onChangeText={(v) => updateField("amount", Number(v))}
                style={styles.input}
            />

            <TextInput
                label="Notes"
                value={expense.notes || ""}
                onChangeText={(v) => updateField("notes", v)}
                style={styles.input}
            />

            <TextInput
                label="Merchant Name"
                value={expense.merchant_name || ""}
                onChangeText={(v) => updateField("merchant_name", v)}
                style={styles.input}
            />

            <TextInput
                label="Location"
                value={expense.location || ""}
                onChangeText={(v) => updateField("location", v)}
                style={styles.input}
            />

            <Dropdown
                label="Category"
                options={EXPENSE_CATEGORIES}
                value={expense.category}
                onSelect={(v) => updateField("category", v)}
            />

            <DateTimeSelector value={spentAt} onChange={setSpentAt} />
            <Text> {spentAt.toDateString()}</Text>

            <Button
                label={image ? "Change Image" : "Pick New Image"}
                mode="outlined"
                onPress={pickImage}
                style={{ marginVertical: 10 }}
            />

            {/* New Local Image */}
            {image && (
                <>
                    <Image source={{ uri: image.uri }} style={styles.image} />
                    <Button
                        label={isUploading ? "Uploading..." : "Upload Image"}
                        mode="contained"
                        onPress={uploadImage}
                        disabled={isUploading}
                    />
                </>
            )}

            {/* Existing Remote Receipt */}
            {!image && remoteImage && (
                <>
                    <Text>Existing Receipt:</Text>
                    <Image source={{ uri: remoteImage }} style={styles.image} />

                    <Button
                        label="Remove Image"
                        mode="outlined"
                        onPress={deleteRemoteImage}
                        style={{ marginTop: 8 }}
                    />
                </>
            )}

            <Button
                label="Update Expense"
                mode="contained"
                loading={isSubmitting}
                disabled={isSubmitting}
                onPress={handleUpdate}
                style={styles.saveButton}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    input: { marginBottom: 12 },
    image: { width: "100%", height: 250, marginVertical: 10, borderRadius: 8 },
    saveButton: { marginTop: 20 },
});