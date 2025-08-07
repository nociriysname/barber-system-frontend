// This service abstracts away the direct use of window.Telegram
// providing a mock for environments where it's not available.

export interface TelegramWebApp {
    colorScheme: 'light' | 'dark';
    themeParams: Record<string, string>;
    MainButton: MainButton;
    HapticFeedback: HapticFeedback;
    showPopup(params: any, callback?: (buttonId?: string) => void): void;
    ready(): void;
    expand(): void;
    isVersionAtLeast?: (version: string) => boolean;
}

interface MainButton {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(): void;
    hideProgress(): void;
    _onClick: (() => void) | null;
}

interface HapticFeedback {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
}

declare global {
  interface Window { Telegram?: { WebApp: TelegramWebApp } }
}

const getTelegram = (): TelegramWebApp => {
    if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        return window.Telegram.WebApp;
    }
    // Provide a mock object for development in a regular browser
    return {
        colorScheme: 'dark',
        themeParams: { bg_color: '#121212', text_color: '#ffffff', hint_color: '#8E8E93', link_color: '#007BFF', button_color: '#007BFF', button_text_color: '#ffffff' },
        MainButton: { text: '', color: '#007BFF', textColor: '#FFFFFF', isVisible: false, isActive: true, isProgressVisible: false, setText: function (text: string) { this.text = text; console.log('TMA MainButton.setText:', text); }, onClick: function (callback: () => void) { this._onClick = callback; console.log('TMA MainButton.onClick:', callback);}, offClick: function (callback: () => void) { this._onClick = null; console.log('TMA MainButton.offClick:', callback); }, show: function () { this.isVisible = true; console.log('TMA MainButton.show'); }, hide: function () { this.isVisible = false; console.log('TMA MainButton.hide');}, enable: function() { this.isActive = true; console.log('TMA MainButton.enable'); }, disable: function() { this.isActive = false; console.log('TMA MainButton.disable'); }, showProgress: function() { this.isProgressVisible = true; console.log('TMA MainButton.showProgress');}, hideProgress: function() { this.isProgressVisible = false; console.log('TMA MainButton.hideProgress');}, _onClick: null },
        HapticFeedback: { impactOccurred: (style) => console.log(`Haptic impact: ${style}`), notificationOccurred: (type) => console.log(`Haptic notification: ${type}`), selectionChanged: () => console.log('Haptic selection changed'), },
        showPopup: (params, callback) => {
            console.warn("Mock showPopup called. This should be handled by usePopup hook.", { params, callback });
        },
        ready: () => console.log('TMA ready() called'),
        expand: () => console.log('TMA expand() called'),
    }
}

class TelegramService {
    public readonly tg: TelegramWebApp;

    constructor() {
        this.tg = getTelegram();
    }
    
    ready() {
        this.tg.ready();
    }

    expand() {
        this.tg.expand();
    }

    hapticImpact(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') {
        this.tg.HapticFeedback.impactOccurred(style);
    }
    
    hapticNotification(type: 'error' | 'success' | 'warning') {
        this.tg.HapticFeedback.notificationOccurred(type);
    }

    hapticSelection() {
        this.tg.HapticFeedback.selectionChanged();
    }
    
    showPopup(params: any, callback?: (buttonId?: string) => void) {
        this.tg.showPopup(params, callback);
    }
}

export const telegramService = new TelegramService();