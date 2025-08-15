import React, { useMemo } from 'react';
import { Booking } from '../../../shared/api/types';
import { usePopup } from '../../../shared/lib/hooks';

interface CancelBookingButtonProps {
    booking: Booking;
    onCancel: (id: number) => void;
    isCompact?: boolean;
    isAdmin?: boolean;
}

export const CancelBookingButton = ({ booking, onCancel, isCompact = false, isAdmin = false }: CancelBookingButtonProps) => {
    const { showPopup } = usePopup();

    const isCancelDisabled = useMemo(() => {
        if (isAdmin) return false; // Admin can always cancel

        const appointmentDate = new Date(booking.date);
        const [hours, minutes] = booking.time.split(':').map(Number);
        appointmentDate.setHours(hours, minutes, 0, 0);
    
        const now = new Date();
        const hoursDifference = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
        return hoursDifference <= 24;
    }, [booking.date, booking.time, isAdmin]);


    const handleCancelClick = () => {
        if (isCancelDisabled) return;

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
        ? "w-full text-center text-amber-400 font-semibold py-1.5 rounded-lg border-2 border-amber-400/50 hover:bg-amber-400/10 transition active:scale-95 text-sm disabled:text-gray-500 disabled:border-gray-600 disabled:bg-transparent disabled:opacity-70 disabled:cursor-not-allowed"
        : "w-full text-center text-[#FF3B30] font-semibold py-2 rounded-lg border-2 border-[#FF3B30]/50 hover:bg-[#FF3B30]/10 transition active:scale-95 disabled:text-gray-500 disabled:border-gray-600 disabled:bg-transparent disabled:opacity-70 disabled:cursor-not-allowed";

    return (
        <button 
            className={buttonClass}
            onClick={handleCancelClick}
            disabled={isCancelDisabled}
        >
            Отменить
        </button>
    );
};
