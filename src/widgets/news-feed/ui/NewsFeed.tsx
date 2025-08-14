
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../../../shared/api/types';
import { NewsCard } from '../../../entities/News/ui/NewsCard';
import BottomSheet from '../../../shared/ui/BottomSheet';
import { NewsDetails } from '../../../features/manage-news/ui/NewsDetails';
import { telegramService } from '../../../shared/lib/telegram';

interface NewsFeedProps {
    newsItems: NewsItem[];
    isAdmin: boolean;
    deleteNewsItem: (id: number) => void;
    updateNewsItem: (id: number, data: { title?: string; text?: string; imageFile?: File; }) => Promise<void>;
}

export const NewsFeed = ({ newsItems, isAdmin, deleteNewsItem, updateNewsItem }: NewsFeedProps) => {
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    useEffect(() => {
        if (selectedNews) {
            const updatedNewsItem = newsItems.find(item => item.id === selectedNews.id);
            setSelectedNews(updatedNewsItem || null);
        }
    }, [newsItems, selectedNews]);

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
                        updateNewsItem={updateNewsItem}
                    />
                )}
            </BottomSheet>
        </div>
    );
};
