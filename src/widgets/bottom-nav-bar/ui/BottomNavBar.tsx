
import React from 'react';
import { View } from '../../../shared/api/types';
import { HomeIcon, HistoryIcon, BookIcon, ProfileIcon, ServicesIcon } from '../../../shared/ui/icons';
import { telegramService } from '../../../shared/lib/telegram';

interface BottomNavBarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isAdmin: boolean;
}

interface NavItemProps {
  view: View;
  label: string;
  Icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ view, label, Icon, isActive, onClick }: NavItemProps) => {
    const colorClass = isActive ? 'text-[#007BFF]' : 'text-[#8E8E93]';
    const specialBookClass = view === 'book' ? 'bg-[#007BFF] text-white rounded-full p-3 shadow-lg shadow-blue-500/30' : '';

    const handlePress = () => {
        telegramService.hapticImpact('light');
        onClick();
    }
    
    return (
        <button
            onClick={handlePress}
            className="flex flex-col items-center justify-center flex-1 transition-transform duration-200 active:scale-90 pt-2"
        >
            <div className={`relative ${specialBookClass}`}>
                <Icon className={`h-7 w-7 transition-colors ${view !== 'book' ? colorClass : ''}`} />
            </div>
            <span className={`text-xs mt-1 transition-colors ${colorClass}`}>{label}</span>
        </button>
    );
};

export const BottomNavBar = ({ activeView, setActiveView, isAdmin }: BottomNavBarProps) => {
  const navItemsConfig: { view: View; label: string; Icon: React.ElementType; adminOnly: boolean }[] = [
    { view: 'home', label: 'Новости', Icon: HomeIcon, adminOnly: false },
    { view: 'history', label: 'Записи', Icon: HistoryIcon, adminOnly: false },
    { view: 'book', label: 'Бронь', Icon: BookIcon, adminOnly: false },
    { view: 'services', label: 'Услуги', Icon: ServicesIcon, adminOnly: true },
    { view: 'profile', label: 'Профиль', Icon: ProfileIcon, adminOnly: false },
  ];

  const visibleNavItems = navItemsConfig.filter(item => !item.adminOnly || isAdmin);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E]/80 backdrop-blur-lg border-t border-white/10 z-30">
      <nav className="flex items-center justify-around h-20 max-w-lg mx-auto px-4">
        {visibleNavItems.map((item) => (
          <NavItem
            key={item.view}
            view={item.view}
            label={item.label}
            Icon={item.Icon}
            isActive={activeView === item.view}
            onClick={() => setActiveView(item.view)}
          />
        ))}
      </nav>
    </footer>
  );
};
