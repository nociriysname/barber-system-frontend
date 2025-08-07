import React from 'react';
import { useApi } from '../../shared/api';
import { UserProfile } from '../../entities/user/ui/UserProfile';
import { AdminToggle } from '../../features/admin-toggle/ui/AdminToggle';
import { UserRole } from '../../shared/api/types';

interface ProfilePageProps {
  api: ReturnType<typeof useApi>;
  isAdminMode: boolean;
  setAdminMode: (isAdmin: boolean) => void;
}

export const ProfilePage = ({ api, isAdminMode, setAdminMode }: ProfilePageProps) => {
    const { currentUser } = api;

    if (!currentUser) return null;

    return (
        <div className="p-4 pb-24 animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-6 text-white">Профиль</h1>

            <UserProfile user={currentUser} />

            <div className="mt-6">
                <button
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 rounded-xl active:scale-95 transition-transform shadow-lg shadow-blue-500/20"
                >
                    Пополнить баланс
                </button>
            </div>

            {currentUser.role === UserRole.ADMIN && (
                <AdminToggle isAdmin={isAdminMode} setAdmin={setAdminMode} />
            )}
        </div>
    );
};
