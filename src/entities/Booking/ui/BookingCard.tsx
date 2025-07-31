import React from 'react';
import { Booking } from '@/shared/types/booking';
import { cn } from '@/shared/lib/utils';
import { CancelBooking } from '@/features/CancelBooking';
import { useIsAdminMode } from '@/entities/User/model/store';
import { Clock, CheckCircle, XCircle, User, Calendar, UserCheck } from 'lucide-react';

interface BookingCardProps {
    booking: Booking;
}

const statusConfig = {
    CONFIRMED: { text: "Предстоит", icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
    COMPLETED: { text: "Завершена", icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
    CANCELED: { text: "Отменена", icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
};

export const BookingCard = ({ booking }: BookingCardProps) => {
    const isAdminMode = useIsAdminMode();
    const { text, icon: Icon, color, bg } = statusConfig[booking.status];
    const appointmentDate = new Date(booking.appointment_time);

    const formattedDate = appointmentDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const isUpcoming = !booking.is_past && booking.status === 'CONFIRMED';

    const serviceName = booking.service?.name ?? `Услуга #${booking.service_id}`;
    const masterName = booking.employee?.user?.name ?? `Мастер #${booking.employee_id}`;
    const clientName = booking.user?.name ?? `Клиент #${booking.user_id}`;

    return (
        <div className={cn(
            "bg-secondary-bg rounded-2xl p-4 mb-4 border-2 border-transparent transition-all",
            isAdminMode && "border-link/50" // Немного изменим стиль для админа
        )}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg font-bold text-white">{serviceName}</p>
                    <p className="text-sm text-hint">
                      Мастер: {masterName}
                    </p>
                </div>
                <div className={cn("flex items-center text-xs font-semibold px-2 py-1 rounded-full", color, bg)}>
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
                        <UserCheck className="w-4 h-4 mr-2 text-hint" />
                        <span className="font-medium">{clientName}</span>
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