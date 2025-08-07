import React from 'react';
import { NewsItem } from '../../../shared/api/types';
import { telegramService } from '../../../shared/lib/telegram';


export const NewsCard = ({ item, onClick }: { item: NewsItem, onClick: () => void }) => (
    <div 
        className="bg-[#1E1E1E] rounded-2xl overflow-hidden mb-4 active:scale-[0.98] transition-transform duration-200 cursor-pointer"
        onClick={onClick}
    >
        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h2 className="text-xl font-semibold text-white/90">{item.title}</h2>
            <p className="text-sm text-[#8E8E93] mt-1">{item.date}</p>
        </div>
    </div>
);
