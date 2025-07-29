import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icons } from '@/shared/ui/Icon';
import { cn } from '@/shared/lib/utils';
import { ROUTES } from '@/shared/config/routes';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';

type NavItemType = {
  to: string;
  label: string;
  Icon: React.ElementType;
};

const navItems: NavItemType[] = [
  { to: ROUTES.HOME, label: 'Новости', Icon: Icons.Home },
  { to: ROUTES.HISTORY, label: 'Записи', Icon: Icons.History },
  { to: ROUTES.BOOK, label: 'Бронь', Icon: Icons.Book },
  { to: ROUTES.PROFILE, label: 'Профиль', Icon: Icons.Profile },
];

const NavItem = ({ to, label, Icon }: NavItemType) => {
  const { hapticFeedback } = useTelegram();
  const isSpecialButton = to === ROUTES.BOOK;

  return (
    <NavLink
      to={to}
      onClick={() => hapticFeedback('light')}
      className={({ isActive }) =>
        cn(
          'flex flex-col items-center justify-center w-1/4 transition-transform duration-200 active:scale-90 pt-2',
          isActive ? 'text-link' : 'text-hint'
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className={cn('relative', isSpecialButton && isActive && 'bg-link text-white rounded-full p-3 shadow-lg shadow-blue-500/30 -mt-8')}>
            <Icon className="h-7 w-7 transition-colors" color={isSpecialButton && isActive ? 'white' : 'currentColor'} />
          </div>
          <span className="text-xs mt-1 transition-colors">{label}</span>
        </>
      )}
    </NavLink>
  );
};

export const BottomNavBar = () => {
  return (
    <footer className="sticky bottom-0 left-0 right-0 bg-secondary-bg/80 backdrop-blur-lg border-t border-white/10 z-30">
      <nav className="flex items-center h-20 max-w-lg mx-auto px-4">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </footer>
  );
};
