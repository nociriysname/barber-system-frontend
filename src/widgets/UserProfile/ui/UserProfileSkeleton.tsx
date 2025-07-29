import { Skeleton } from '@/shared/ui/Skeleton';
import React from 'react';

export const UserProfileSkeleton = () => {
  return (
    <div className="bg-secondary-bg rounded-2xl p-5 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="flex-grow space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    </div>
  );
};
