import React, 'useState'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FloatingActionButton } from '@/shared/ui/FloatingActionButton'
import { BottomSheet } from '@/shared/ui/BottomSheet'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { Button } from '@/shared/ui/Button'
import { uploadFile, type FileUploadResponse } from '@/shared/api/files'
import { createNews } from '@/shared/api/news'
import type { NewsItem } from '@/shared/types/news'
import { useTelegram } from '@/shared/lib/hooks/useTelegram'

// Типы для формы и для API-запроса
type FormInputs = {
  title: string
  text: string
  image?: FileList
}

interface CreateNewsPayload {
  title: string
  text: string
  image_id?: string
}

export const CreateNews = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { hapticFeedback } = useTelegram()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>()

  // Мутация для загрузки файла
  const uploadMutation = useMutation<FileUploadResponse, Error, File>({
    mutationFn: uploadFile,
  })

  // Мутация для создания новости
  const createNewsMutation = useMutation<NewsItem, Error, CreateNewsPayload>({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] }) // Обновляем список новостей
      hapticFeedback('success')
      setIsOpen(false)
      reset()
    },
    onError: (error) => {
      hapticFeedback('error')
      console.error('Failed to create news item:', error)
      // Здесь можно показать попап с ошибкой
    },
  })

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    let imageId: string | undefined = undefined

    // 1. Сначала загружаем файл, если он есть
    if (data.image && data.image.length > 0) {
      const file = data.image[0]
      try {
        const uploadResponse = await uploadMutation.mutateAsync(file)
        imageId = uploadResponse.file_name
      } catch (error) {
        console.error('File upload failed:', error)
        return // Прерываем, если файл не загрузился
      }
    }

    // 2. Затем создаем новость с полученным ID картинки
    await createNewsMutation.mutateAsync({
      title: data.title,
      text: data.text,
      image_id: imageId,
    })
  }

  const isLoading = uploadMutation.isPending || createNewsMutation.isPending

  return (
    <>
      <FloatingActionButton onClick={() => setIsOpen(true)} />
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-bold text-white">Создать новость</h2>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-hint mb-1"
            >
              Заголовок
            </label>
            <Input
              id="title"
              {...register('title', { required: 'Заголовок обязателен' })}
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="text"
              className="block text-sm font-medium text-hint mb-1"
            >
              Текст
            </label>
            <Textarea
              id="text"
              {...register('text', { required: 'Текст новости обязателен' })}
              rows={5}
            />
            {errors.text && (
              <p className="text-red-400 text-xs mt-1">{errors.text.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-hint mb-1"
            >
              Изображение
            </label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register('image')}
            />
          </div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Создать
          </Button>
        </form>
      </BottomSheet>
    </>
  )
}