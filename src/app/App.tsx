import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { HistoryPage } from '@/pages/HistoryPage';
import { BookingPage } from '@/pages/BookingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ROUTES } from '@/shared/config/routes';
import { useAuth } from '@/shared/lib/hooks/useAuth';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';

const queryClient = new QueryClient();

const App = () => {
  const { expand } = useTelegram();
  const { authenticate } = useAuth();

  useEffect(() => {
    expand();
    authenticate();
  }, [authenticate, expand]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path={ROUTES.HISTORY} element={<HistoryPage />} />
            <Route path={ROUTES.BOOK} element={<BookingPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
