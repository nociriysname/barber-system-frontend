import React from 'react';
import { useIsAdminMode, useUserStore } from '@/entities/User/model/store';
import { cn } from '@/shared/lib/utils';
import { useTelegram } from '@/shared/lib/hooks/useTelegram';

export const SwitchAdminMode = () => {
  const isAdminMode = useIsAdminMode();
  const { toggleAdminMode } = useUserStore((state) => state.actions);
  const { hapticFeedback } = useTelegram();

  const handleToggle = () => {
    hapticFeedback('light');
    toggleAdminMode();
  };

  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
      <label htmlFor="admin-mode-toggle" className="font-medium text-white/90">
        Режим администратора
      </label>
      <button
        id="admin-mode-toggle"
        role="switch"
        aria-checked={isAdminMode}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-secondary-bg',
          isAdminMode ? 'bg-link' : 'bg-gray-600'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            isAdminMode ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};
