import { useCurrentUser, useAuthLoading } from '@/entities/User/model/store';
import React from 'react';
import { UserProfile } from '@/widgets/UserProfile';
import { UserProfileSkeleton } from '@/widgets/UserProfile/ui/UserProfileSkeleton';

export const ProfilePage = () => {
  const user = useCurrentUser();
  const isLoading = useAuthLoading();

  return (
    <div className="p-4 pb-24 animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-6 text-white">Профиль</h1>
      {isLoading || !user ? <UserProfileSkeleton /> : <UserProfile user={user} />}
      <div className="flex items-center justify-center h-48">
        <p className="text-hint">Дополнительные функции в разработке.</p>
      </div>
    </div>
  );
};
