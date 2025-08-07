import React from 'react';
import { User, UserRole } from '../../../shared/api/types';

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
    return (
        <div className="bg-[#1E1E1E] rounded-2xl p-5">
            <div className="flex items-center space-x-4">
                <img src={user.avatarUrl} alt="User Avatar" className="w-20 h-20 rounded-full" />
                <div className="flex-grow">
                    <p className="text-2xl font-bold text-white">{user.name}</p>
                    <p className="text-base text-[#8E8E93]">{user.username}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-sm space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-400">Роль:</span>
                    <span className={`font-semibold ${user.role === UserRole.ADMIN ? 'text-amber-400' : 'text-white'}`}>{user.role}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">В приложении с:</span>
                    <span className="font-semibold text-white">{user.registrationDate}</span>
                </div>
            </div>
        </div>
    );
};
