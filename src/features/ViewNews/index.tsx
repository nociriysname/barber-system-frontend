import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NewsItem } from '@/shared/types/news';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Icons } from '@/shared/ui/Icon';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';
import { useIsAdminMode } from '@/entities/User/model/store';
import { Button } from '@/shared/ui/Button';
import { deleteNews } from '@/shared/api/news';

interface ViewNewsProps {
  newsItem: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const AdminActions = ({ newsItem, onClose }: { newsItem: NewsItem, onClose: () => void }) => {
    const queryClient = useQueryClient();
    const { hapticFeedback } = useTelegram();
    
    const deleteMutation = useMutation({
        mutationFn: deleteNews,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['news'] });
            hapticFeedback('success');
            onClose();
        },
        onError: () => {
            hapticFeedback('error');
        }
    });

    const handleDelete = () => {
        // TODO: Add confirmation popup
        deleteMutation.mutate(newsItem.id);
    };

    return (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
            <Button variant="outline" className="w-full">Изменить фото</Button>
            <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleDelete}
                isLoading={deleteMutation.isPending}
            >
                Удалить новость
            </Button>
        </div>
    );
};

export const ViewNews = ({ newsItem, isOpen, onClose }: ViewNewsProps) => {
    const { hapticFeedback } = useTelegram();
    const isAdminMode = useIsAdminMode();

    const handleClose = () => {
        hapticFeedback('light');
        onClose();
    };

  if (!newsItem) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} snapPoint="h-[90%]">
      <div className="flex flex-col h-full text-white/90">
        {newsItem.image_url && <img src={newsItem.image_url} alt={newsItem.title} className="w-full h-56 object-cover rounded-xl flex-shrink-0" />}
        <h2 className="text-2xl font-bold my-4">{newsItem.title}</h2>
        <div className="flex-grow overflow-y-auto text-[#aeaeae] space-y-4 pr-2">
          <p>{newsItem.text}</p>
        </div>

        {isAdminMode && <AdminActions newsItem={newsItem} onClose={onClose} />}

        <div className="flex justify-center py-4 mt-auto flex-shrink-0">
          <button
            onClick={handleClose}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-90"
            aria-label="Close news details"
          >
            <Icons.ChevronDown className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
