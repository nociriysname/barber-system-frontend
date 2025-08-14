
import React, { useState } from 'react';
import { NewsItem } from '../../../shared/api/types';
import { ChevronDownIcon, PencilIcon } from '../../../shared/ui/icons';
import { usePopup } from '../../../shared/lib/hooks';
import { EditNewsSheet } from './EditNewsSheet';

interface NewsDetailsProps {
    newsItem: NewsItem;
    isAdmin: boolean;
    onClose: () => void;
    deleteNewsItem: (id: number) => void;
    updateNewsItem: (id: number, data: { title?: string; text?: string; imageFile?: File; }) => Promise<void>;
}

export const NewsDetails = ({ newsItem, isAdmin, onClose, deleteNewsItem, updateNewsItem }: NewsDetailsProps) => {
    const { showPopup } = usePopup();
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
    
    const handleDeleteClick = () => {
        showPopup({
            title: 'Подтвердите удаление',
            message: `Вы уверены, что хотите удалить новость "${newsItem.title}"?`,
            buttons: [
                { type: 'destructive', text: 'Да, удалить', id: 'confirm_delete' },
                { type: 'cancel', text: 'Нет' },
            ]
        }, (buttonId?: string) => {
            if (buttonId === 'confirm_delete') {
                deleteNewsItem(newsItem.id);
                onClose();
            }
        });
    };

    return (
        <>
            <div className="flex flex-col h-full text-white/90">
                <div className="relative flex-shrink-0">
                    <img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-56 object-cover rounded-xl" />
                </div>

                <h2 className="text-2xl font-bold my-4">{newsItem.title}</h2>
                
                <div className="flex-grow overflow-y-auto text-[#aeaeae] space-y-4 pr-2">
                    <p>{newsItem.text}</p>
                </div>

                {isAdmin && (
                  <div className="mt-4 flex flex-col space-y-3">
                     <button onClick={() => setIsEditSheetOpen(true)} className="w-full text-center text-[#007BFF] font-semibold py-3 rounded-lg border-2 border-[#007BFF]/50 hover:bg-[#007BFF]/10 transition flex items-center justify-center">
                        <PencilIcon className="w-5 h-5 mr-2" /> Изменить
                     </button>
                     <button onClick={handleDeleteClick} className="w-full text-center text-[#FF3B30] font-semibold py-3 rounded-lg border-2 border-[#FF3B30]/50 hover:bg-[#FF3B30]/10 transition">Удалить новость</button>
                  </div>
                )}

                <div className="flex justify-center py-4 mt-auto flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-90"
                        aria-label="Close news details"
                    >
                        <ChevronDownIcon className="w-8 h-8 text-white" />
                    </button>
                </div>
            </div>
            <EditNewsSheet 
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
                newsItem={newsItem}
                updateNewsItem={updateNewsItem}
            />
        </>
    );
};
