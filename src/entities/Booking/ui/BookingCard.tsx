import React from 'react';
import { Booking } from '@/shared/types/booking';
import { cn } from '@/shared/lib/utils';
import { CancelBooking } from '@/features/CancelBooking';
import { useIsAdminMode } from '@/entities/User/model/store';
import { Clock, CheckCircle, XCircle, User, Calendar } from 'lucide-react';

interface BookingCardProps {
    booking: Booking;
}

const statusConfig = {
    CONFIRMED: { text: "Подтверждена", icon: Clock, color: "text-blue-400" },
    COMPLETED: { text: "Завершена", icon: CheckCircle, color: "text-green-400" },
    CANCELED: { text: "Отменена", icon: XCircle, color: "text-red-400" },
};

export const BookingCard = ({ booking }: BookingCardProps) => {
    const isAdminMode = useIsAdminMode();
    const { text, icon: Icon, color } = statusConfig[booking.status];
    const appointmentDate = new Date(booking.appointment_time);

    const formattedDate = appointmentDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
    });
    const formattedTime = appointmentDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const isUpcoming = !booking.is_past && booking.status === 'CONFIRMED';

    return (
        <div className={cn("bg-secondary-bg rounded-2xl p-4 mb-4", isAdminMode && "border-l-4 border-link")}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg font-bold text-white">Услуга #{booking.service_id}</p>
                    <p className="text-sm text-hint">Мастер #{booking.employee_id}</p>
                </div>
                <div className={cn("flex items-center text-sm font-semibold px-2 py-1 rounded-full", color)}>
                    <Icon className="w-4 h-4 mr-1.5" />
                    {text}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-sm">
                 <div className="flex items-center text-white/80">
                    <Calendar className="w-4 h-4 mr-2 text-hint" />
                    <span>{formattedDate}, {formattedTime}</span>
                </div>
                 {isAdminMode && (
                    <div className="flex items-center text-white/80">
                        <User className="w-4 h-4 mr-2 text-hint" />
                        <span>User ID: {booking.user_id}</span>
                    </div>
                )}
            </div>

            {isUpcoming && !isAdminMode && (
                <div className="mt-4">
                    <CancelBooking bookingId={booking.id} />
                </div>
            )}
        </div>
    );
};
