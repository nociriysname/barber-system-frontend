
import React, { useState, useEffect } from 'react';
import { View } from '../../shared/api/types';
import { HomePage } from '../../pages/home';
import { HistoryPage } from '../../pages/history';
import { BookPage } from '../../pages/book';
import { ProfilePage } from '../../pages/profile';
import { BottomNavBar } from '../../widgets/bottom-nav-bar/ui/BottomNavBar';
import { telegramService } from '../../shared/lib/telegram';
import { useApi } from '../../shared/api';
import { PopupProvider } from '../../shared/lib/hooks/usePopup';
import { Popup } from '../../shared/ui/Popup';
import { ServicesPage } from '../../pages/services';

export const App = () => {
  const [view, setView] = useState<View>('home');
  const [isAdminMode, setAdminMode] = useState(false);
  const api = useApi();
  const { currentUser } = api;

  const [popupState, setPopupState] = useState({
    isOpen: false,
    title: '',
    message: '',
    buttons: [],
    onClose: (id?: string) => {},
  });

  useEffect(() => {
    telegramService.ready();
    telegramService.expand();
  }, []);

  const views: Record<View, React.ReactNode> = {
    home: <HomePage api={api} isAdmin={isAdminMode} />,
    history: <HistoryPage api={api} isAdmin={isAdminMode} setActiveView={setView} />,
    book: <BookPage api={api} isAdmin={isAdminMode} setActiveView={setView} />,
    profile: <ProfilePage api={api} isAdminMode={isAdminMode} setAdminMode={setAdminMode} />,
    services: <ServicesPage api={api} />,
  };

  return (
    <PopupProvider setPopupState={setPopupState}>
        <main className="bg-[#121212] text-white min-h-screen antialiased">
        {currentUser && (
            <>
            {views[view]}
            <BottomNavBar activeView={view} setActiveView={setView} isAdmin={isAdminMode} />
            </>
        )}
        <Popup {...popupState} />
        </main>
    </PopupProvider>
  );
};
