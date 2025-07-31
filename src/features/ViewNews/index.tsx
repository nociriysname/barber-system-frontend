import React, { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NewsItem } from '@/shared/types/news'
import { BottomSheet } from '@/shared/ui/BottomSheet'
import { Icons } from '@/shared/ui/Icon'
import { useTelegram } from '@/shared/lib/hooks/useTelegram'
import { useIsAdminMode } from '@/entities/User/model/store'
import { Button } from '@/shared/ui/Button'
import { deleteNews, updateNews } from '@/shared/api/news'
import { uploadFile, type FileUploadResponse } from '@/shared/api/files'

interface ViewNewsProps {
  newsItem: NewsItem | null
  isOpen: boolean
  onClose: () => void
}

// Отдельный компонент для админских кнопок, чтобы изолировать сложную логику
const AdminActions = ({
  newsItem,
  onClose,
}: {
  newsItem: NewsItem
  onClose: () => void
}) => {
  const queryClient = useQueryClient()
  const { hapticFeedback, showPopup } = useTelegram()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Мутация для удаления новости
  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      hapticFeedback('success')
      onClose()
    },
    onError: (error) => {
      hapticFeedback('error')
      console.error('Delete failed:', error)
    },
  })

  // Мутация для загрузки файла
  const uploadMutation = useMutation<FileUploadResponse, Error, File>({
    mutationFn: uploadFile,
  })
  
  // Мутация для обновления новости (конкретно - смена картинки)
  const updateMutation = useMutation<
    NewsItem,
    Error,
    { id: number; data: { image_id: string } }
  >({
    mutationFn: (vars) => updateNews(vars.id, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
      hapticFeedback('success')
    },
    onError: (error) => {
      hapticFeedback('error')
      console.error('Update failed:', error)
    },
  })

  const handleDelete = async () => {
    hapticFeedback('warning')
    const buttonId = await showPopup({
      title: 'Удаление новости',
      message: `Вы уверены, что хотите удалить "${newsItem.title}"? Это действие необратимо.`,
      buttons: [
        { id: 'confirm', type: 'destructive', text: 'Удалить' },
        { type: 'cancel' },
      ],
    })

    if (buttonId === 'confirm') {
      deleteMutation.mutate(newsItem.id)
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return
    const file = event.target.files[0]
    try {
      const { file_name } = await uploadMutation.mutateAsync(file)
      await updateMutation.mutateAsync({
        id: newsItem.id,
        data: { image_id: file_name },
      })
    } catch (error) {
      console.error('Failed to update image:', error)
    }
  }
  
  const isProcessing = deleteMutation.isPending || uploadMutation.isPending || updateMutation.isPending;

  return (
    <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="outline"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
        isLoading={uploadMutation.isPending || updateMutation.isPending}
        disabled={isProcessing}
      >
        Изменить фото
      </Button>
      <Button
        variant="destructive"
        className="w-full"
        onClick={handleDelete}
        isLoading={deleteMutation.isPending}
        disabled={isProcessing}
      >
        Удалить новость
      </Button>
    </div>
  )
}


export const ViewNews = ({ newsItem, isOpen, onClose }: ViewNewsProps) => {
  const { hapticFeedback } = useTelegram()
  const isAdminMode = useIsAdminMode()

  const handleClose = () => {
    hapticFeedback('light')
    onClose()
  }

  if (!newsItem) return null

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} snapPoint="h-[90%]">
      <div className="flex flex-col h-full text-white/90">
        {newsItem.image_url && (
          <img
            src={newsItem.image_url}
            alt={newsItem.title}
            className="w-full h-56 object-cover rounded-xl flex-shrink-0"
          />
        )}
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
  )
}