import { supabase } from "../../../api/supabaseClient";
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

export const uploadFile = async (uri: string, path: string, type: string) => {
    try {
        // Remove "file://" prefix if present
        const filePath = uri.startsWith('file://') ? uri.slice(7) : uri;

        // Read file as base64
        const base64Data = await RNFS.readFile(filePath, 'base64');

        // Convert base64 → Uint8Array using Buffer
        const arrayBuffer = Uint8Array.from(Buffer.from(base64Data, 'base64'));

        // Upload to Supabase
        const { data, error } = await supabase.storage.from('expense_attachments').upload(path, arrayBuffer, {
            contentType: type,
            upsert: false,
        });

        if (error) throw error;
        return data;
    } catch (err) {
        console.log('uploadFile ERROR:', err);
        throw err;
    }
};

// Upload Post
const uploadExpenseAttachment = async (image: any) => {
    if (!image) {
        // Alert.alert('Please select an image first');
        return;
    }

    try {
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('User not logged in');

        const userId = user.id;

        // Generate unique filename
        const ext = image.fileName?.split('.').pop() || 'jpg';
        const filePath = `${userId}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

        // Upload file to Supabase Storage
        await uploadFile(image.uri, filePath, image.type || 'image/jpeg');

        // Get public URL
        const { data: urlData } = supabase.storage.from('expense_attachments').getPublicUrl(filePath);
        const publicUrl = urlData.publicUrl;



        // Alert.alert('Success', 'Post uploaded successfully!');
    } catch (err: any) {
        console.log('UPLOAD ERROR:', err);
        // Alert.alert('Upload Error', err.message || 'Something went wrong');
    }
};

export const getPublicUrl = async (filePath: string) => {
    // Get public URL
    const { data: urlData } = await supabase.storage.from('expense_attachments').getPublicUrl(filePath);
    return urlData?.publicUrl;
}