import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useUserStore } from '@/entities/User/model/store';
import { topUpBalance } from '@/shared/api/user';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';
import { Button } from '@/shared/ui/Button';
import { BottomSheet } from '@/shared/ui/BottomSheet';
import { Input } from '@/shared/ui/Input';
import type { User } from '@/shared/types/user';

type FormInputs = {
  amount: number;
};

export const TopUpBalance = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { hapticFeedback } = useTelegram();
  const { refetchUser } = useUserStore((state) => state.actions);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>();

  const mutation = useMutation<User, Error, number>({
    mutationFn: topUpBalance,
    onSuccess: () => {
      hapticFeedback('success');
      refetchUser();
      setIsOpen(false);
      reset();
    },
    onError: () => {
      hapticFeedback('error');
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    mutation.mutate(data.amount);
  };

  const handleOpen = () => {
    hapticFeedback('light');
    setIsOpen(true);
  }

  return (
    <>
      <Button
        className="w-full"
        onClick={handleOpen}
      >
        Пополнить баланс
      </Button>
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-xl font-bold text-white">Пополнение баланса</h2>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-hint mb-1">Сумма (₽)</label>
            <Input 
              id="amount" 
              type="number"
              placeholder="100.00"
              {...register('amount', { 
                required: 'Сумма обязательна',
                valueAsNumber: true,
                min: { value: 1, message: 'Минимальная сумма 1 ₽' }
              })} 
            />
             {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>}
          </div>
          <Button type="submit" className="w-full" isLoading={mutation.isPending}>
            Пополнить
          </Button>
        </form>
      </BottomSheet>
    </>
  );
};
