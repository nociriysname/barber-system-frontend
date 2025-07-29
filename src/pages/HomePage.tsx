import React from 'react';
import { NewsList } from '@/widgets/NewsList';

export const HomePage = () => {
  return (
    <div className="p-4 pb-24">
      <h1 className="text-3xl font-bold mb-6 text-white">Новости</h1>
      <NewsList />
    </div>
  );
};
