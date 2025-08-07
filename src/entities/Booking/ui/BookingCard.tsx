import React from 'react';
import { Booking, BookingStatus } from '../../../shared/api/types';
import { CancelBookingButton } from '../../../features/cancel-booking/ui/CancelBookingButton';
import { usePopup } from '../../../shared/lib/hooks';

const getStatusClasses = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.CONFIRMED: return 'bg-blue-500/20 text-blue-400';
        case BookingStatus.COMPLETED: return 'bg-green-500/20 text-green-400';
        case BookingStatus.CANCELED: return 'bg-gray-500/20 text-gray-400';
        default: return 'bg-gray-500/20 text-gray-400';
    }
}

interface BookingCardProps {
    booking: Booking;
    onCancel: (id: number) => void;
    onDelete: (id: number) => void;
    isAdmin: boolean;
}

export const BookingCard = ({ booking, onCancel, onDelete, isAdmin }: BookingCardProps) => {
    const { showPopup } = usePopup();

    const handleDeleteClick = () => {
        showPopup({
            title: 'Подтвердите удаление',
            message: `Вы уверены, что хотите навсегда удалить эту запись? Действие необратимо.`,
            buttons: [
                { type: 'destructive', text: 'Да, удалить', id: 'confirm_delete' },
                { type: 'cancel', text: 'Нет' },
            ]
        }, (buttonId?: string) => {
            if (buttonId === 'confirm_delete') {
                onDelete(booking.id);
            }
        });
    };

    const formattedDate = new Date(booking.date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    if (isAdmin) {
        return (
            <div className="bg-[#1E1E1E] rounded-2xl p-3 mb-3">
                <div className="flex justify-between items-start text-xs">
                    <p className="font-semibold text-white/90">{formattedDate}, {booking.time}</p>
                    <div className={`font-medium px-2 py-1 rounded-full ${getStatusClasses(booking.status)}`}>
                        {booking.status}
                    </div>
                </div>
                <div className="mt-2 text-sm space-y-1">
                    <p className="font-bold text-base text-white">{booking.serviceName} - {booking.price} ₽</p>
                    <p><span className="font-semibold text-amber-400">Клиент:</span> {booking.userName}</p>
                    <p><span className="text-gray-400">Мастер:</span> {booking.masterName}</p>
                    <p><span className="text-gray-400">Филиал:</span> {booking.branchAddress}</p>
                </div>
                 {booking.status === BookingStatus.CONFIRMED && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex space-x-2">
                        <CancelBookingButton booking={booking} onCancel={onCancel} isCompact={true} />
                        <button 
                            className="w-full text-center text-[#FF3B30] font-semibold py-1.5 rounded-lg border-2 border-[#FF3B30]/50 hover:bg-[#FF3B30]/10 transition active:scale-95 text-sm"
                            onClick={handleDeleteClick}
                        >
                            Удалить
                        </button>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="bg-[#1E1E1E] rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg font-semibold text-white/90">{formattedDate}, {booking.time}</p>
                    <p className="text-base text-white/80 mt-1">{booking.serviceName}</p>
                    <p className="text-sm text-[#8E8E93] mt-2">{booking.masterName} · {booking.branchAddress}</p>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusClasses(booking.status)}`}>
                    {booking.status}
                </div>
            </div>
            {booking.status === BookingStatus.CONFIRMED && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <CancelBookingButton booking={booking} onCancel={onCancel} />
                </div>
            )}
        </div>
    );
};