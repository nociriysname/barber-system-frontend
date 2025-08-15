import React from 'react';
import { Booking, BookingStatus } from '../../../shared/api/types';
import { usePopup } from '../../../shared/lib/hooks';

const getStatusClasses = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.PENDING: return 'bg-yellow-500/20 text-yellow-400';
        case BookingStatus.CONFIRMED: return 'bg-blue-500/20 text-blue-400';
        case BookingStatus.COMPLETED: return 'bg-green-500/20 text-green-400';
        case BookingStatus.CANCELED: return 'bg-gray-500/20 text-gray-400';
        default: return 'bg-gray-500/20 text-gray-400';
    }
}

interface AdminBookingCardProps {
    booking: Booking;
    onDelete: (id: number) => void;
    onConfirm: (id: number) => void;
    onComplete: (id: number) => void;
}

export const AdminBookingCard = ({ booking, onDelete, onConfirm, onComplete }: AdminBookingCardProps) => {
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
             {booking.status === BookingStatus.PENDING && (
                <div className="mt-3 pt-3 border-t border-white/10 flex space-x-2">
                    <button
                        className="w-full text-center text-green-400 font-semibold py-1.5 rounded-lg border-2 border-green-400/50 hover:bg-green-400/10 transition active:scale-95 text-sm"
                        onClick={() => onConfirm(booking.id)}
                    >
                        Подтвердить
                    </button>
                    <button
                        className="w-full text-center text-[#FF3B30] font-semibold py-1.5 rounded-lg border-2 border-[#FF3B30]/50 hover:bg-[#FF3B30]/10 transition active:scale-95 text-sm"
                        onClick={handleDeleteClick}
                    >
                        Удалить
                    </button>
                </div>
             )}
             {booking.status === BookingStatus.CONFIRMED && (
                <div className="mt-3 pt-3 border-t border-white/10 flex space-x-2">
                    <button
                        className="w-full text-center text-green-400 font-semibold py-1.5 rounded-lg border-2 border-green-400/50 hover:bg-green-400/10 transition active:scale-95 text-sm"
                        onClick={() => onComplete(booking.id)}
                    >
                        Завершить
                    </button>
                    <button 
                        className="w-full text-center text-[#FF3B30] font-semibold py-1.5 rounded-lg border-2 border-[#FF3B30]/50 hover:bg-[#FF3B30]/10 transition active:scale-95 text-sm"
                        onClick={handleDeleteClick}
                    >
                        Удалить
                    </button>
                </div>
            )}
        </div>
    );
};
