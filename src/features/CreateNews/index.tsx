import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FloatingActionButton } from '@/shared/ui/FloatingActionButton';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Button } from '@/shared/ui/Button';
import { uploadFile, type FileUploadResponse } from '@/shared/api/files';
import { createNews } from '@/shared/api/news';
import type { NewsItem } from '@/shared/types/news';

type FormInputs = {
  title: string;
  text: string;
  image?: FileList;
};

export const CreateNews = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<FormInputs>();

  const uploadMutation = useMutation<FileUploadResponse, Error, File>({
    mutationFn: uploadFile,
  });

  const createNewsMutation = useMutation<NewsItem, Error, { title: string; text: string; image_id?: string }>({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setIsOpen(false);
      reset();
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    let imageId: string | undefined = undefined;
    if (data.image && data.image.length > 0) {
      const file = data.image[0];
      const uploadResponse = await uploadMutation.mutateAsync(file);
      imageId = uploadResponse.file_name;
    }

    await createNewsMutation.mutateAsync({
      title: data.title,
      text: data.text,
      image_id: imageId,
    });
  };

  const isLoading = uploadMutation.isPending || createNewsMutation.isPending;

  return (
    <>
      <FloatingActionButton onClick={() => setIsOpen(true)} />
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-bold text-white">Создать новость</h2>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-hint mb-1">Заголовок</label>
            <Input id="title" {...register('title', { required: true })} />
          </div>
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-hint mb-1">Текст</label>
            <Textarea id="text" {...register('text', { required: true })} rows={5} />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-hint mb-1">Изображение</label>
            <Input id="image" type="file" accept="image/*" {...register('image')} />
          </div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Создать
          </Button>
        </form>
      </BottomSheet>
    </>
  );
};