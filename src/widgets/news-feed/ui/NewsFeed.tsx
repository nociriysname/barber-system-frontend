import React, { useState } from 'react';
import { NewsItem } from '../../../shared/api/types';
import { NewsCard } from '../../../entities/news/ui/NewsCard';
import BottomSheet from '../../../shared/ui/BottomSheet';
import { NewsDetails } from '../../../features/manage-news/ui/NewsDetails';
import { telegramService } from '../../../shared/lib/telegram';

interface NewsFeedProps {
    newsItems: NewsItem[];
    isAdmin: boolean;
    deleteNewsItem: (id: number) => void;
    updateNewsItemImage: (id: number, imageFile: File) => Promise<void>;
}

export const NewsFeed = ({ newsItems, isAdmin, deleteNewsItem, updateNewsItemImage }: NewsFeedProps) => {
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    const handleNewsClick = (item: NewsItem) => {
        telegramService.hapticImpact('light');
        setSelectedNews(item);
    };

    const handleCloseSheet = () => {
        setSelectedNews(null);
    };

    return (
        <div>
            {newsItems.map(item => (
                <NewsCard key={item.id} item={item} onClick={() => handleNewsClick(item)} />
            ))}
             <BottomSheet isOpen={!!selectedNews} onClose={handleCloseSheet} snapPoint="h-[90%]">
                {selectedNews && (
                    <NewsDetails 
                        newsItem={selectedNews}
                        isAdmin={isAdmin}
                        onClose={handleCloseSheet}
                        deleteNewsItem={deleteNewsItem}
                        updateNewsItemImage={updateNewsItemImage}
                    />
                )}
            </BottomSheet>
        </div>
    );
};