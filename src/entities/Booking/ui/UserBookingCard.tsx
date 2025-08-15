import React from 'react';
import { Booking, BookingStatus } from '../../../shared/api/types';
import { CancelBookingButton } from '../../../features/cancel-booking/ui/CancelBookingButton';

const getStatusClasses = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.PENDING: return 'bg-yellow-500/20 text-yellow-400';
        case BookingStatus.CONFIRMED: return 'bg-blue-500/20 text-blue-400';
        case BookingStatus.COMPLETED: return 'bg-green-500/20 text-green-400';
        case BookingStatus.CANCELED: return 'bg-gray-500/20 text-gray-400';
        default: return 'bg-gray-500/20 text-gray-400';
    }
}

interface UserBookingCardProps {
    booking: Booking;
    onCancel: (id: number) => void;
    isAdmin: boolean;
}

export const UserBookingCard = ({ booking, onCancel, isAdmin }: UserBookingCardProps) => {
    const formattedDate = new Date(booking.date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

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
            {(booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING) && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <CancelBookingButton booking={booking} onCancel={onCancel} isAdmin={isAdmin} />
                </div>
            )}
        </div>
    );
};
