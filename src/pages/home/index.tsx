import React, { useState } from 'react';
import { useApi } from '../../shared/api';
import BottomSheet from '../../shared/ui/BottomSheet';
import { PlusIcon } from '../../shared/ui/icons';
import { NewsFeed } from '../../widgets/news-feed';
import { CreateNews } from '../../features/manage-news/ui/CreateNews';

interface HomePageProps {
  api: ReturnType<typeof useApi>;
  isAdmin: boolean;
}

export const HomePage = ({ api, isAdmin }: HomePageProps) => {
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const { news, addNewsItem, deleteNewsItem, updateNewsItemImage } = api;

  const handleCloseCreateSheet = () => {
    setIsCreateSheetOpen(false);
  };

  return (
    <div className="p-4 pb-24 animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-6 text-white">Новости</h1>
        
        <NewsFeed 
            newsItems={news} 
            isAdmin={isAdmin}
            deleteNewsItem={deleteNewsItem}
            updateNewsItemImage={updateNewsItemImage}
        />

        {isAdmin && (
            <button 
                onClick={() => setIsCreateSheetOpen(true)}
                className="fixed bottom-32 right-4 bg-[#007BFF] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform active:scale-90 z-40"
            >
                <PlusIcon className="w-8 h-8 text-white" />
            </button>
        )}

        <BottomSheet isOpen={isCreateSheetOpen} onClose={handleCloseCreateSheet}>
            <CreateNews 
                onAddNews={addNewsItem}
                onClose={handleCloseCreateSheet}
            />
        </BottomSheet>
    </div>
  );
};