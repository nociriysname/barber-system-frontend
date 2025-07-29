import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNews } from '@/shared/api/news';
import { NewsCard } from '@/entities/News/ui/NewsCard';
import { Skeleton } from '@/shared/ui/Skeleton';
import { NewsItem } from '@/shared/types/news';
import { ViewNews } from '@/features/ViewNews';
import { useIsAdminMode } from '@/entities/User/model/store';
import { CreateNews } from '@/features/CreateNews';

const NewsListSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-secondary-bg rounded-2xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>
        ))}
    </div>
);

export const NewsList = () => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const isAdminMode = useIsAdminMode();
    
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['news', { limit: 20, offset: 0 }],
    queryFn: () => getNews({ limit: 20, offset: 0 }),
  });

  if (isLoading) {
    return <NewsListSkeleton />;
  }

  if (isError) {
    return <div className="text-red-500">Ошибка при загрузке новостей: {error.message}</div>;
  }

  const handleNewsClick = (item: NewsItem) => {
    setSelectedNews(item);
  };

  const handleCloseSheet = () => {
    setSelectedNews(null);
  };

  return (
    <>
      <div className="animate-fade-in-up">
        {data?.items.map((item) => (
          <NewsCard key={item.id} item={item} onClick={() => handleNewsClick(item)} />
        ))}
      </div>
      <ViewNews
        newsItem={selectedNews}
        isOpen={!!selectedNews}
        onClose={handleCloseSheet}
      />
      {isAdminMode && <CreateNews />}
    </>
  );
};
