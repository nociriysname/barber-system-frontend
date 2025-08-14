
import React, { useState } from 'react';
import { useImageUpload } from '../../../shared/lib/hooks/useImageUpload';
import { LoaderIcon } from '../../../shared/ui/icons';

interface CreateNewsProps {
  onAddNews: (item: { title: string; text: string; imageFile: File; }) => Promise<void>;
  onClose: () => void;
}

export const CreateNews = ({ onAddNews, onClose }: CreateNewsProps) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { previewUrl, isUploading, inputRef, handleFileSelect, triggerFileInput, removeImage } = useImageUpload({});

  const handleSubmit = async () => {
    if (title && text && handleFileSelect.file) {
      setIsSubmitting(true);
      await onAddNews({
        title,
        text,
        imageFile: handleFileSelect.file,
      });
      setIsSubmitting(false);
      onClose();
    }
  };

  const isFormValid = title && text && previewUrl && !isUploading;

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-4">Создать новость</h2>
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
          <input id="image-upload" type="file" accept="image/*" ref={inputRef} onChange={handleFileSelect.handleFileSelect} className="hidden" />
          {!previewUrl ? (
            <button onClick={triggerFileInput} className="w-full text-center p-4 bg-[#2c2c2e] rounded-lg block cursor-pointer font-semibold hover:bg-[#3a3a3c] transition-colors">
              Прикрепить фото
            </button>
          ) : (
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
                  Изменить
                </button>
                <button onClick={removeImage} className="w-full text-center py-3 bg-[#FF3B30]/20 text-[#FF3B30] rounded-lg cursor-pointer font-semibold hover:bg-[#FF3B30]/30 transition-colors">
                  Удалить
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="w-full bg-[#007BFF] text-white font-bold py-3 rounded-xl active:scale-95 transition-transform flex items-center justify-center disabled:bg-gray-500 disabled:opacity-50"
        >
          {isSubmitting ? <LoaderIcon className="w-6 h-6 animate-spin" /> : 'Опубликовать'}
        </button>
      </div>
    </div>
  );
};
