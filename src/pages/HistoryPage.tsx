import React from 'react';
import { BookingHistory } from '@/widgets/BookingHistory';

export const HistoryPage = () => {
  return (
    <div className="p-4 pb-24 animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-6 text-white">Мои записи</h1>
      <BookingHistory />
    </div>
  );
};
