import React from 'react';
import { NewsItem } from '@/shared/types/news';
import { MotionDiv } from '@/shared/ui/MotionDiv';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';

interface NewsCardProps {
  item: NewsItem;
  onClick: () => void;
}

export const NewsCard = ({ item, onClick }: NewsCardProps) => {
    const { hapticFeedback } = useTelegram();

    const handleClick = () => {
        hapticFeedback('light');
        onClick();
    };
    
  const formattedDate = new Date(item.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <MotionDiv
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClick}
      className="bg-secondary-bg rounded-2xl overflow-hidden mb-4 active:scale-[0.98] transition-transform duration-200 cursor-pointer"
    >
      {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white/90">{item.title}</h2>
        <p className="text-sm text-hint mt-1">{formattedDate}</p>
      </div>
    </MotionDiv>
  );
};
