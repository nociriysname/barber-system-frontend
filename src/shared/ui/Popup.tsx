import React from 'react';

export interface PopupButton {
    id?: string;
    type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
    text?: string;
}

interface PopupProps {
    isOpen: boolean;
    title: string;
    message: string;
    buttons: PopupButton[];
    onClose: (buttonId?: string) => void;
}

export const Popup = ({ isOpen, title, message, buttons, onClose }: PopupProps) => {
    if (!isOpen) {
        return null;
    }

    const handleButtonClick = (button: PopupButton) => {
        onClose(button.id);
    };

    const getButtonClass = (type?: string) => {
        switch (type) {
            case 'destructive':
                return 'text-red-500 font-semibold';
            case 'cancel':
            case 'close':
                 return 'text-blue-500';
            default:
                return 'text-blue-500 font-semibold';
        }
    };
    
    // Ensure there's always at least one button to close the popup
    const displayButtons = buttons.length > 0 ? buttons : [{ type: 'ok', text: 'OK', id: 'ok' }];

    return (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" style={{ animationDuration: '200ms' }}>
            <div className="bg-[#2a2a2d] rounded-2xl w-full max-w-sm text-center shadow-2xl scale-100 animate-zoom-in" style={{ animationDuration: '200ms' }}>
                <div className="p-4">
                    <h3 className="font-bold text-lg text-white">{title}</h3>
                    {message && <p className="text-sm text-gray-300 mt-1">{message}</p>}
                </div>
                <div className="flex border-t border-white/10">
                    {displayButtons.map((button, index) => (
                        <button
                            key={button.id || index}
                            onClick={() => handleButtonClick(button)}
                            className={`flex-1 p-3 transition-colors ${getButtonClass(button.type)} ${index > 0 ? 'border-l border-white/10' : ''} active:bg-white/5`}
                        >
                            {button.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};