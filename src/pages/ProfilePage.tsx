import { useCurrentUser, useAuthLoading } from '@/entities/User/model/store';
import { Skeleton } from '@/shared/ui/Skeleton';
import React from 'react';

export const ProfilePage = () => {
  const user = useCurrentUser();
  const isLoading = useAuthLoading();

  if (isLoading) {
    return (
        <div className="p-4 pb-24 animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-6 text-white">Профиль</h1>
            <div className="bg-secondary-bg rounded-2xl p-5 space-y-4">
                <div className="flex items-center space-x-4">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <div className="flex-grow space-y-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="p-4 pb-24 animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-6 text-white">Профиль</h1>
      <div className="bg-secondary-bg rounded-2xl p-5">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-link flex items-center justify-center text-4xl font-bold">
            {user?.name?.[0]}
          </div>
          <div className="flex-grow">
            <p className="text-2xl font-bold text-white">{user?.name}</p>
            <p className="text-base text-hint">ID: {user?.telegram_id}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 text-sm space-y-2">
            <div className="flex justify-between">
                <span className="text-gray-400">Баланс:</span>
                <span className="font-semibold text-white">{user?.balance} ₽</span>
            </div>
             <div className="flex justify-between">
                <span className="text-gray-400">Роль:</span>
                <span className="font-semibold text-white">{user?.role}</span>
            </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-48">
        <p className="text-hint">Дополнительные функции в разработке.</p>
      </div>
    </div>
  );
};
