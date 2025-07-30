import React from 'react';
import { BookingHistory } from '@/widgets/BookingHistory';
import { useCurrentUser } from '@/entities/User/model/store';

export const HistoryPage = () => {
  const user = useCurrentUser();
  const title = user?.role === 'ADMIN' ? "Все записи" : "Мои записи";

  return (
    <div className="p-4 pb-24">
      <h1 className="text-3xl font-bold mb-6 text-white">{title}</h1>
      <BookingHistory />
    </div>
  );
};
