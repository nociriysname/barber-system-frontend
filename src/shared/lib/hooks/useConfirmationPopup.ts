// This file is potentially unused after refactoring to usePopup. 
// Keeping it for history but it can be deleted if not needed.
import { useCallback } from 'react';
import { telegramService } from '../telegram';

type PopupButton = {
  id?: string;
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  text: string;
};

type PopupParams = {
  title: string;
  message: string;
  buttons: PopupButton[];
};

export const useConfirmationPopup = () => {
  const showConfirmation = useCallback(
    (params: PopupParams, onConfirm: (buttonId: string) => void) => {
      telegramService.hapticNotification('warning');
      
      const callback = (buttonId?: string) => {
        if (buttonId) {
            onConfirm(buttonId);
        }
      };

      telegramService.showPopup(params, callback);
    },
    []
  );

  return { showConfirmation };
};
