// src/types/FileDetailTypes.ts
import { FileStatus } from './File';
import { File } from '../types/File';

export type FileDetailRouteParams = {
    fileId: number;
};

export interface DetailsTabProps {
    file: File | null;
    isEditing: boolean;
    formData: {
        title: string;
        description: string;
        status: FileStatus;
    };
    onFormChange: (field: string, value: string) => void;
}

export type FileDetailTabType = {
    key: string;
    title: string;
};