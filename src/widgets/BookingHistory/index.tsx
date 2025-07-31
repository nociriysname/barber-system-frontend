import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useIsAdminMode } from '@/entities/User/model/store';
import { getAllAppointments, getMyBookings } from '@/shared/api/booking';
import { BookingHistorySkeleton } from './ui/BookingHistorySkeleton';
import { BookingCard } from '@/entities/Booking/ui/BookingCard';
import { Booking } from '@/shared/types/booking';

export const BookingHistory = () => {
    const isAdminMode = useIsAdminMode();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['bookings', { isAdmin: isAdminMode }],
        queryFn: () => isAdminMode 
            ? getAllAppointments({ limit: 100, offset: 0 })
            : getMyBookings({ limit: 100, offset: 0 }),
    });

    const { upcoming, past } = useMemo(() => {
        if (!data) return { upcoming: [], past: [] };

        const upcomingBookings: Booking[] = [];
        const pastBookings: Booking[] = [];

        data.items.forEach(booking => {
            if (booking.is_past || booking.status === 'COMPLETED' || booking.status === 'CANCELED') {
                pastBookings.push(booking);
            } else {
                upcomingBookings.push(booking);
            }
        });

        pastBookings.sort((a, b) => new Date(b.appointment_time).getTime() - new Date(a.appointment_time).getTime());

        return { upcoming: upcomingBookings, past: pastBookings };
    }, [data]);
    
    if (isLoading) {
        return <BookingHistorySkeleton />;
    }

    if (isError) {
        return <div className="text-red-500 text-center p-4">Ошибка при загрузке записей: {error.message}</div>;
    }


    const navigate = useNavigate();
    const isAdminMode = useIsAdminMode();

    if (!data || data.items.length === 0) {
        if (isAdminMode) {
            return <div className="text-hint text-center p-4">Записей не найдено.</div>;
        }

        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                {/* SVG-код пингвина с анимацией */}
                <span className="text-6xl mb-4 animate-penguin-sway">🐧</span> 
                <h3 className="text-xl font-bold text-white">Здесь пока пусто</h3>
                <p className="text-hint mt-1">У вас еще нет ни одной записи.</p>
                <Button 
                    onClick={() => navigate(ROUTES.BOOK)} 
                    className="mt-6"
                >
                    Создать первую запись
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {upcoming.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-white/90 mb-4">Предстоящие</h2>
                    {upcoming.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                </section>
            )}

            {past.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-white/90 mb-4">Прошедшие</h2>
                     {past.map(booking => <BookingCard key={booking.id} booking={booking} />)}
                </section>
            )}
        </div>
    );
};
