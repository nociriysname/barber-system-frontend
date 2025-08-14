import { useState, useRef, useEffect, useCallback } from 'react';

interface UseImageUploadProps {
    initialImageUrl?: string | null;
    onFileSelect?: (file: File) => Promise<void> | void;
}

/**
 * A custom hook to handle image selection, preview, and optimistic updates.
 * @param initialImageUrl - The initial URL of the image to display.
 * @param onFileSelect - An async callback function that is triggered when a file is selected.
 *                         It receives the File object for uploading.
 */
export const useImageUpload = ({ initialImageUrl = null, onFileSelect }: UseImageUploadProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Effect to update preview if the initial URL changes from outside
    useEffect(() => {
        setPreviewUrl(initialImageUrl);
    }, [initialImageUrl]);

    const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        // In a real-world scenario, you might want to add image compression here
        // import imageCompression from 'browser-image-compression';
        // const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        // const compressedFile = await imageCompression(selectedFile, options);
        
        setFile(selectedFile);
        
        // Optimistic UI update: show local preview immediately
        const localPreviewUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(localPreviewUrl);
        
        if (onFileSelect) {
            setIsUploading(true);
            try {
                await onFileSelect(selectedFile);
            } catch (error) {
                console.error("Upload failed:", error);
                // Revert to the initial image on failure
                setPreviewUrl(initialImageUrl);
            } finally {
                setIsUploading(false);
            }
        }
    }, [onFileSelect, initialImageUrl]);
    
    const triggerFileInput = () => {
        inputRef.current?.click();
    };

    const removeImage = () => {
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setFile(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };
    
    // Cleanup the object URL when the component unmounts
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return {
        previewUrl,
        isUploading,
        inputRef,
        handleFileSelect: { file, handleFileSelect },
        triggerFileInput,
        removeImage,
        setPreviewUrl,
    };
};
