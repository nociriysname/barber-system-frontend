import React from 'react';
import { User } from '@/shared/types/user';
import { TopUpBalance } from '@/features/TopUpBalance';
import { SwitchAdminMode } from '@/features/SwitchAdminMode';

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="bg-secondary-bg rounded-2xl p-5">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-link flex items-center justify-center text-4xl font-bold text-white">
          {user.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-grow">
          <p className="text-2xl font-bold text-white">{user.name}</p>
          <p className="text-base text-hint">ID: {user.telegram_id}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/10 text-sm space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Баланс:</span>
          <span className="font-semibold text-white">{user.balance.toFixed(2)} ₽</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Роль:</span>
          <span className="font-semibold text-white">{user.role}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
        <TopUpBalance />
        {user.role === 'ADMIN' && <SwitchAdminMode />}
      </div>
    </div>
  );
};
