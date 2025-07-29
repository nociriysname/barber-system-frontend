import { Skeleton } from '@/shared/ui/Skeleton';
import React from 'react';

export const BookingHistorySkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-secondary-bg rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
};
