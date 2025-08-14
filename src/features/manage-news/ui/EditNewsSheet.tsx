
import React, { useState, useEffect } from 'react';
import BottomSheet from '../../../shared/ui/BottomSheet';
import { NewsItem } from '../../../shared/api/types';
import { useImageUpload } from '../../../shared/lib/hooks';
import { LoaderIcon } from '../../../shared/ui/icons';

interface EditNewsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    newsItem: NewsItem;
    updateNewsItem: (id: number, data: { title?: string; text?: string; imageFile?: File }) => Promise<void>;
}

export const EditNewsSheet = ({ isOpen, onClose, newsItem, updateNewsItem }: EditNewsSheetProps) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { previewUrl, isUploading, inputRef, handleFileSelect, triggerFileInput } = useImageUpload({
        initialImageUrl: newsItem.imageUrl,
    });

    useEffect(() => {
        if (isOpen) {
            setTitle(newsItem.title);
            setText(newsItem.text);
        }
    }, [isOpen, newsItem]);

    const handleSaveChanges = async () => {
        if (!title.trim() || !text.trim()) return;
        
        setIsSubmitting(true);
        await updateNewsItem(newsItem.id, {
            title: title.trim(),
            text: text.trim(),
            imageFile: handleFileSelect.file || undefined,
        });
        setIsSubmitting(false);
        onClose();
    };
    
    const isFormValid = title.trim() && text.trim();

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <div className="text-white">
                <h2 className="text-2xl font-bold mb-4">Редактировать новость</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Заголовок"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none"
                    />
                    <textarea
                        placeholder="Текст новости"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={5}
                        className="w-full p-3 bg-[#2c2c2e] rounded-lg border-2 border-transparent focus:border-[#007BFF] outline-none"
                    />
                    <div>
                        <input type="file" accept="image/*" ref={inputRef} onChange={handleFileSelect.handleFileSelect} className="hidden" />
                        {previewUrl ? (
                            <div className="space-y-3">
                                <div className="relative">
                                    <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                            <LoaderIcon className="w-10 h-10 animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex space-x-3">
                                    <button onClick={triggerFileInput} className="w-full text-center py-3 bg-[#2c2c2e] rounded-lg cursor-pointer font-semibold hover:bg-[#3a3a3c] transition-colors">
                                        Заменить фото
                                    </button>
                                </div>
                            </div>
                        ) : (
                             <button onClick={triggerFileInput} className="w-full text-center p-4 bg-[#2c2c2e] rounded-lg block cursor-pointer font-semibold hover:bg-[#3a3a3c] transition-colors">
                                Прикрепить фото
                             </button>
                        )}
                    </div>
                    <button
                        onClick={handleSaveChanges}
                        disabled={!isFormValid || isSubmitting || isUploading}
                        className="w-full bg-[#007BFF] text-white font-bold py-3 rounded-xl active:scale-95 transition-transform flex items-center justify-center disabled:bg-gray-500 disabled:opacity-50"
                    >
                        {isSubmitting ? <LoaderIcon className="w-6 h-6 animate-spin" /> : 'Сохранить изменения'}
                    </button>
                </div>
            </div>
        </BottomSheet>
    );
};
