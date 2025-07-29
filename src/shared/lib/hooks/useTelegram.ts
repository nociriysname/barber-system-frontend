const tg = window.Telegram?.WebApp;

export function useTelegram() {
  const hapticFeedback = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    tg?.HapticFeedback.impactOccurred(style);
  };
  
  const showPopup = (params: any) => {
      return new Promise<string | undefined>((resolve) => {
          tg?.showPopup(params, (buttonId?: string) => {
              resolve(buttonId);
          });
      });
  };

  return {
    tg,
    webApp: tg,
    user: tg?.initDataUnsafe?.user,
    initData: tg?.initData,
    initDataUnsafe: tg?.initDataUnsafe,
    hapticFeedback,
    showPopup,
    expand: () => tg?.expand(),
  };
}

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}
