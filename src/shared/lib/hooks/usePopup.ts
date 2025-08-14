import React, { useState, useContext, createContext, ReactNode } from 'react';
import { telegramService } from '../telegram';
import { PopupButton } from '../../ui/Popup';

interface PopupParams {
    title: string;
    message: string;
    buttons: PopupButton[];
}

interface PopupContextType {
    showPopup: (params: PopupParams, callback?: (buttonId?: string) => void) => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};

interface PopupProviderProps {
    children: ReactNode;
    setPopupState: (state: any) => void;
}

export const PopupProvider = ({ children, setPopupState }: PopupProviderProps) => {
    const showPopup = (params: PopupParams, callback?: (buttonId?: string) => void) => {
        telegramService.hapticNotification('warning');
        
        // Use native Telegram popup if the `isVersionAtLeast` method exists (indicating a real environment)
        if (telegramService.tg.isVersionAtLeast) {
            telegramService.showPopup(params, callback);
        } else {
            // Fallback to custom React component popup
            setPopupState({
                isOpen: true,
                ...params,
                onClose: (buttonId?: string) => {
                    setPopupState({ isOpen: false, title: '', message: '', buttons: [], onClose: () => {} });
                    if (callback) {
                        callback(buttonId);
                    }
                },
            });
        }
    };
    
    return React.createElement(PopupContext.Provider, { value: { showPopup } }, children);
};
