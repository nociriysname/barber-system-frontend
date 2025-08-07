import React from 'react';
import { Booking } from '../../../shared/api/types';
import { usePopup } from '../../../shared/lib/hooks';

interface CancelBookingButtonProps {
    booking: Booking;
    onCancel: (id: number) => void;
    isCompact?: boolean;
}

export const CancelBookingButton = ({ booking, onCancel, isCompact = false }: CancelBookingButtonProps) => {
    const { showPopup } = usePopup();

    const handleCancelClick = () => {
        showPopup({
            title: 'Подтвердите отмену',
            message: `Вы уверены, что хотите отменить запись на ${booking.serviceName}?`,
            buttons: [
                { type: 'destructive', text: 'Да, отменить', id: 'confirm_cancel' },
                { type: 'cancel', text: 'Нет' },
            ]
        }, (buttonId?: string) => {
            if (buttonId === 'confirm_cancel') {
                onCancel(booking.id);
            }
        });
    };

    const buttonClass = isCompact
        ? "w-full text-center text-amber-400 font-semibold py-1.5 rounded-lg border-2 border-amber-400/50 hover:bg-amber-400/10 transition active:scale-95 text-sm"
        : "w-full text-center text-[#FF3B30] font-semibold py-2 rounded-lg border-2 border-[#FF3B30]/50 hover:bg-[#FF3B30]/10 transition active:scale-95";

    return (
        <button 
            className={buttonClass}
            onClick={handleCancelClick}
        >
            Отменить
        </button>
    );
};